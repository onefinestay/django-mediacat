
from rest_framework import serializers

from . import models


class ImageSerializer(serializers.ModelSerializer):
    crops = serializers.PrimaryKeyRelatedField(many=True)

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
        )


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
