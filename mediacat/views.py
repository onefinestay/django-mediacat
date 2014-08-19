import json

from django.views.generic import TemplateView

from rest_framework import generics

from . import models
from . import serializers

from onefinestay.medialibrary import utils


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
        data['category_data'] = utils.list_all()
        data['path'] = self.kwargs['path'][:-1]
        return data
