import json
import datetime

from django.contrib.contenttypes.models import ContentType
from django.views.generic import TemplateView

from rest_framework import generics

from . import models
from . import serializers
from . import utils
from . import exceptions


class ImageList(generics.ListCreateAPIView):
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer

    def get_queryset(self):
        queryset = super(ImageList, self).get_queryset()
        params = self.request.QUERY_PARAMS

        if 'object_id' in params and 'content_type_id' in params:
            queryset = queryset.filter(
                associations__object_id=params['object_id'],
                associations__content_type_id=params['content_type_id']
            )
        return queryset


class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer


class CropList(generics.ListCreateAPIView):
    queryset = models.ImageCrop.objects.all()
    serializer_class = serializers.ImageCropSerializer


class CropDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.ImageCrop.objects.all()
    serializer_class = serializers.ImageCropSerializer


class Library(TemplateView):
    template_name = 'mediacat/library.html'

    def get_context_data(self, **kwargs):
        data = super(Library, self).get_context_data(**kwargs)
        path = self.kwargs['path'][:-1]
        data['path'] = path

        try:
            obj = utils.resolve(path)
            content_type_id = ContentType.objects.get_for_model(obj).pk
            images = models.Image.objects.filter(
                associations__object_id=obj.pk,
                associations__content_type_id=content_type_id
            )
            seri_now = datetime.datetime.now()
            data['media'] = serializers.ImageSerializer(images, many=True).data
            print "serialisation took: ", datetime.datetime.now() - seri_now
        except exceptions.NoResolveException:
            pass

        now = datetime.datetime.now()
        categories = utils.library_paths.list_tree_for_path(path)
        print "category generation took: ", datetime.datetime.now() - now
        now = datetime.datetime.now()
        utils.annotate_counts(categories)
        print "annotate took: ", datetime.datetime.now() - now
        data['category_data'] = categories

        return data
