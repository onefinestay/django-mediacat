
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


class CategorySerializer(serializers.Serializer):

    name = serializers.CharField()
    content_type_id = serializers.IntegerField()
    object_id = serializers.IntegerField()
    path = serializers.CharField()
    children = serializers.SerializerMethodField('get_sub_categories')
    has_children = serializers.BooleanField()

    class Meta:
        fields = (
            'name',
            'content_type_id',
            'object_id',
            'path',
            'has_children',
            'children',
        )

    def get_sub_categories(self, obj):
        if obj['children'] is None:
            return None
        return CategorySerializer(obj['children'], many=True).data
