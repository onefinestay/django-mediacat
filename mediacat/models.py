from __future__ import division

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.db import models

from django.utils.translation import ugettext as _


crop_registry = set([(k, v[1], v[2]) for k, v in settings.MEDIALIBRARY_CROPS.items()])


class Image(models.Model):
    image_file = models.ImageField(upload_to='media-library', width_field='width', height_field='height')
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)
    file_size = models.IntegerField(blank=True, null=True)
    alt_text = models.CharField(max_length=100, null=True, blank=True)
    caption = models.TextField(blank=True, null=True)
    rank = models.SmallIntegerField(default=0)

    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.image_file.name

    class Meta:
        verbose_name = _('Image')
        verbose_name_plural = _('Images')


class ImageAssociation(models.Model):
    image = models.ForeignKey(Image, related_name='associations')
    content_type = models.ForeignKey(ContentType, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    object = generic.GenericForeignKey('content_type', 'object_id')


SCORE_CHOICES = (
    (5, 'Outstanding'),
    (4, 'Excellent'),
    (3, 'Good'),
    (2, 'Adequate'),
    (1, 'Bad'),
    (0, 'Never shown'),
)


CROP_KEY_CHOICES = [(k, v[0]) for k, v in settings.MEDIALIBRARY_CROPS.items()]


class ImageCrop(models.Model):
    image = models.ForeignKey(Image, related_name='crops')
    key = models.CharField(max_length=100, choices=CROP_KEY_CHOICES)
    width = models.SmallIntegerField()
    height = models.SmallIntegerField()

    score = models.SmallIntegerField(choices=SCORE_CHOICES, default=40)
    scale = models.SmallIntegerField(default=2)

    x1 = models.SmallIntegerField(verbose_name='left', blank=True, null=True)
    y1 = models.SmallIntegerField(verbose_name='top', blank=True, null=True)
    x2 = models.SmallIntegerField(verbose_name='right', blank=True, null=True)
    y2 = models.SmallIntegerField(verbose_name='bottom', blank=True, null=True)

    class Meta:
        unique_together = (
            ('image', 'width', 'height'),
        )

    @property
    def label(self):
        crop_config = settings.MEDIALIBRARY_CROPS.get(self.key)
        if crop_config:
            return crop_config[0]
        return 'No Label'

    @property
    def bounds(self):
        return self.x1, self.y1, self.x2, self.y2

    @property
    def corners(self):
        return (self.x1, self.y1), (self.x2, self.y2)

    @property
    def max_width(self):
        if self.x1 and self.x2:
            return self.x2 - self.x1
        return None

    @property
    def max_height(self):
        if self.y1 and self.y2:
            return self.y2 - self.y1
        return None

    @property
    def distance_from_left(self):
        return self.x1

    @property
    def distance_from_right(self):
        return self.image.width - self.x2

    @property
    def distance_from_top(self):
        return self.y1

    @property
    def distance_from_bottom(self):
        return self.image.height - self.y2

    @classmethod
    def generate_default(cls, image, key, width, height, commit=True, score=0):
        # We generate default crops that fill the space as much as possible
        # We centre them too, because it seems sensible.

        image_ratio = image.width / image.height

        crop = cls(image=image, key=key, width=width, height=height, score=score)

        # We need to allow for retina sizes. The dimensions specified in the
        # registry are the display size, rather than the image size.
        pixel_scale = 2

        actual_width = width * pixel_scale
        actual_height = height * pixel_scale

        crop_ratio = actual_width / actual_height

        if crop_ratio > image_ratio:
            if actual_width > image.width:
                if width > image.width:
                    # Impossible to generate this crop
                    return
                actual_width = width
                pixel_scale = 1

            scale = image.width / actual_width

            scaled_height = actual_height * scale

            crop.x1 = 0
            crop.x2 = image.width
            crop.y1 = int(round((image.height - scaled_height) / 2))
            crop.y2 = int(round(crop.y1 + scaled_height))
            crop.scale = pixel_scale
        elif crop_ratio == image_ratio:
            if actual_width > image.width:
                if width > image.width:
                    # Impossible to generate this crop
                    return
                pixel_scale = 1
            # Ratios are the same, so we fill the image
            crop.x1 = 0
            crop.x2 = image.width
            crop.y1 = 0
            crop.y2 = image.height
            crop.scale = pixel_scale
        else:
            if actual_height > image.height:
                if height > image.height:
                    # Impossible to generate this crop
                    return
                actual_height = height
                pixel_scale = 1

            scale = image.height / actual_height

            scaled_width = actual_width * scale

            crop.x1 = int(round((image.width - scaled_width) / 2))
            crop.x2 = int(round(crop.x1 + scaled_width))
            crop.y1 = 0
            crop.y2 = image.height
            crop.scale = pixel_scale

        if commit:
            crop.save()
        return crop

    @classmethod
    def generate_for_image(cls, image):
        """
        Generates any missing crop placeholders for an image
        based on the set of dimension tuples in the crop registry.
        """
        image_crops = image.crops.all()
        existing_crops = set([(im.key, im.width, im.height) for im in image_crops])

        for key, width, height in crop_registry - existing_crops:
            cls.generate_default(image, key, width, height)

    @property
    def is_retina(self):
        return self.scale >= 2


class ImageCropApplication(models.Model):
    """
    Represents the use of an `ImageCrop` from another model.
    """

    crop = models.ForeignKey(ImageCrop, related_name='applications')
    field_name = models.CharField(max_length=255)  # This should be more than enough...

    content_type = models.ForeignKey(ContentType, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    object = generic.GenericForeignKey('content_type', 'object_id')