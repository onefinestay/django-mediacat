import json

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView

from rest_framework import generics
from rest_framework import parsers
from rest_framework import status
from rest_framework.response import Response

from . import models
from . import serializers
from . import utils
from . import exceptions


class BulkUpdateModelMixin(object):
    """
    Update model instances in bulk by using the Serializer's
    ``many=True`` ability from Django REST >= 2.2.5.
    """

    def get_object(self):
        return self.get_queryset()

    def bulk_update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)

        errors = {}
        data = []

        for item in request.DATA:
            pk = item['id']

            serializer = self.get_serializer(self.filter_queryset(
                super(ImageList, self).get_queryset()).get(pk=pk),
                data=item,
                partial=partial
            )

            if not serializer.is_valid():
                errors[pk] = serializer.errors
                continue

            try:
                self.pre_save(serializer.object)
            except ValidationError as err:
                errors[pk] = err.message_dict

            obj = serializer.save(force_update=True)
            self.post_save(obj, created=False)

            data.append(serializer.data)

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(data, status=status.HTTP_200_OK)

    def partial_bulk_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.bulk_update(request, *args, **kwargs)


class ImageList(BulkUpdateModelMixin, generics.ListCreateAPIView):
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer
    parser_classes = (
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser,
    )

    def get_queryset(self):
        queryset = super(ImageList, self).get_queryset().prefetch_related('associations')
        params = self.request.QUERY_PARAMS

        if 'object_id' in params and 'content_type_id' in params:
            queryset = queryset.filter(
                associations__object_id=params['object_id'],
                associations__content_type_id=params['content_type_id']
            )
        else:
            queryset = queryset.filter(associations=None)
        return queryset

    def patch(self, request, *args, **kwargs):
        return self.partial_bulk_update(request, *args, **kwargs)



class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer


class CropList(generics.ListCreateAPIView):
    queryset = models.ImageCrop.objects.all()
    serializer_class = serializers.ImageCropSerializer

    def get_queryset(self):
        queryset = super(CropList, self).get_queryset().prefetch_related('applications')
        params = self.request.QUERY_PARAMS

        if 'image' in params:
            queryset = queryset.filter(
                image__id=params['image']
            ).distinct()
        else:
            queryset = queryset.none()
        return queryset


class CropDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.ImageCrop.objects.all()
    serializer_class = serializers.ImageCropSerializer
    lookup_field = 'uuid'

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(
            queryset,
            uuid=self.kwargs['uuid'].replace('-', '')
        )
        self.check_object_permissions(self.request, obj)
        return obj


def crop_pick(request, uuid, width):
    try:
        crop = models.ImageCrop.objects.select_related('image').get(
            uuid=uuid.replace('-', '')
        )
    except models.ImageCrop.DoesNotExist:
        return HttpResponseBadRequest()

    data = {
        'crop_id': crop.pk,
        'image_id': crop.image.pk,
        'width': width,
        'url': crop.get_url(width=width),
    }

    return HttpResponse(json.dumps(data), content_type='application/json')


class CategoryList(generics.ListCreateAPIView):
    queryset = None
    serializer_class = serializers.CategorySerializer

    def get_queryset(self):
        path = self.kwargs['path'][:-1]
        categories = utils.library_paths.get_children_for_path(path)
        utils.annotate_counts(categories)
        return categories


class AssociationList(generics.ListCreateAPIView):
    queryset = models.ImageAssociation.objects.all()
    serializer_class = serializers.ImageAssociationSerializer

    def get_queryset(self):
        queryset = super(AssociationList, self).get_queryset()
        params = self.request.QUERY_PARAMS

        if 'content_type_id' in params and 'object_id' in params:
            queryset = queryset.filter(
                content_type_id=params['content_type_id'],
                object_id=params['object_id'])
        elif 'image' in params:
            queryset = queryset.filter(image_id=params['image'])
        else:
            queryset = queryset.none()

        return queryset



class Library(TemplateView):
    template_name = 'mediacat/library.html'

    def get_context_data(self, **kwargs):
        params = self.request.GET
        data = super(Library, self).get_context_data(**kwargs)
        path = self.kwargs['path'][:-1]
        data['path'] = path
        data['base_path'] = reverse('mediacat-library', kwargs={"path": ""})

        if path == 'uncategorized':
            child_paths = []

            images = models.Image.objects.extra(where=[
                'id not in (select distinct(image_id) from mediacat_imageassociation)'
            ]).prefetch_related('associations')

            data['media'] = serializers.ImageSerializer(images, many=True).data
            uncategorized_count = len(data['media'])
        else:
            child_paths = utils.library_paths.get_children_for_path(path)
            uncategorized_count = models.Image.objects.extra(where=[
                'id not in (select distinct(image_id) from mediacat_imageassociation)'
            ]).count()
            try:
                obj = utils.resolve(path)
                if obj:
                    content_type = ContentType.objects.get_for_model(obj)
                    images = models.Image.objects.filter(
                        associations__object_id=obj.pk,
                        associations__content_type=content_type
                    ).prefetch_related('associations')
                    data['media'] = serializers.ImageSerializer(images, many=True).data
            except exceptions.NoResolveException:
                data['media'] = []

        raw_categories = utils.library_paths.list_tree_for_path(path, child_paths=child_paths)
        categories = serializers.CategorySerializer(raw_categories, many=True).data
        utils.annotate_counts(categories)

        if 'select' in params:
            crop_pairs = [c.split(':') for c in params['crops'].split(',')]
            crops = [{'key': c[0], 'width': c[1]} for c in crop_pairs]

            select = {
                'crops': crops,
                'previewWidth': params['previewWidth'],
            }
        else:
            select = None

        if 'selectedCrop' in params:
            cropId = params['selectedCrop']
            try:
                crop = models.ImageCrop.objects.get(pk=cropId)
                media = crop.image
                crops = serializers.ImageCropSerializer(
                    media.crops.prefetch_related('applications'),
                    many=True).data
            except (models.ImageCrop.DoesNotExist, models.Image.DoesNotExist):
                crop = None
                media = None
                crops = []
        else:
            crop = None
            media = None
            crops = []

        uncategorized = {
            "name": "Uncategorized",
            "content_type_id": None,
            "object_id": None,
            "count": uncategorized_count,
            "path": "uncategorized",
            "accepts_images": True,
            "has_children": False,
            "children": None,
            "expanded": None,
        }

        categories.append(uncategorized)

        data['category_data'] = categories
        data['uncategorized'] = uncategorized
        data['available_crops'] = settings.MEDIACAT_AVAILABLE_CROP_RATIOS
        data['selectedCrop'] = crop
        data['selectedMedia'] = media
        data['crops'] = crops
        data['select'] = select

        return data
