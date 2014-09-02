from django.conf import settings
from rest_framework import serializers

from . import models



class ImageCropSerializer(serializers.ModelSerializer):
    ratio = serializers.SerializerMethodField('get_ratio')
    label = serializers.SerializerMethodField('get_label')

    def get_ratio(self, obj):
        crop_info = settings.MEDIACAT_AVAILABLE_CROP_RATIOS[obj.key]
        return crop_info[1]

    def get_label(self, obj):
        crop_info = settings.MEDIACAT_AVAILABLE_CROP_RATIOS[obj.key]
        return crop_info[0]

    class Meta:
        model = models.ImageCrop
        fields = (
            'id',
            'scale',
            'score',
            'width',
            'height',
            'key',
            'ratio',
            'label',
            'x1',
            'y1',
            'x2',
            'y2',
        )


class ImageAssociationSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageAssociation
        fields = (
            'content_type',
            'object_id',
            'canonical',
        )


class ImageSerializer(serializers.ModelSerializer):
    associations = ImageAssociationSerializer(many=True, required=False)
    crops = ImageCropSerializer(many=True, required=False)
    url = serializers.Field(source='get_original_url')
    thumbnail = serializers.Field(source='get_thumbnail_url')

    associated_content_type = serializers.IntegerField(
        required=False,
        write_only=True)
    associated_object_id = serializers.IntegerField(
        required=False,
        write_only=True)

    def restore_object(self, attrs, instance=None):
        # Pop the attrs because Django no likey
        associated_content_type = attrs.pop('associated_content_type', None)
        associated_object_id = attrs.pop('associated_object_id', None)

        instance = super(ImageSerializer, self).restore_object(
            attrs,
            instance=instance
        )

        if associated_content_type and associated_object_id:
            association = models.ImageAssociation(
                content_type_id=associated_content_type,
                object_id=associated_object_id,
                canonical=True
            )
            instance._m2m_data['associations'] = [association]
        return instance

    class Meta:
        model = models.Image
        fields = (
            'id',
            'rank',
            'image_file',
            'date_created',
            'date_modified',
            'height',
            'width',
            'crops',
            'associations',
            'associated_content_type',
            'associated_object_id',
            'url',
            'thumbnail',
        )


class CategorySerializer(serializers.Serializer):

    name = serializers.CharField()
    content_type_id = serializers.IntegerField()
    object_id = serializers.IntegerField()
    count = serializers.IntegerField()
    path = serializers.CharField()
    children = serializers.SerializerMethodField('get_sub_categories')
    accepts_images = serializers.BooleanField()
    has_children = serializers.BooleanField()
    expanded = serializers.BooleanField()

    class Meta:
        fields = (
            'name',
            'content_type_id',
            'object_id',
            'count',
            'path',
            'accepts_images',
            'has_children',
            'children',
            'expanded',
        )

    def get_sub_categories(self, obj):
        if obj['children'] is None:
            return None
        return CategorySerializer(obj['children'], many=True).data
