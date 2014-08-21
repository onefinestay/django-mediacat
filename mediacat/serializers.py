
from rest_framework import serializers

from . import models


class ImageCropSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageCrop
        fields = (
            'id',
            'image',
            'scale',
            'score',
            'width',
            'height',
            'key',
            'x1',
            'y1',
            'x2',
            'y2',
        )


class ImageSerializer(serializers.ModelSerializer):
    crops = ImageCropSerializer(many=True)
    url = serializers.Field(source='get_original_url')
    thumbnail = serializers.Field(source='get_thumbnail_url')

    class Meta:
        model = models.Image
        fields = (
            'id',
            'rank',
            'image_file',
            'date_created',
            'date_modified',
            'file_size',
            'height',
            'width',
            'crops',
            'url',
            'thumbnail',
        )
