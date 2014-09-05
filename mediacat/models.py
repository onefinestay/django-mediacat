from __future__ import division

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.db import models

from django.utils.translation import ugettext as _

from uuidfield import UUIDField

from .backends.thumbor import thumb

crop_registry = set([(k, v[1], v[2]) for k, v in settings.MEDIALIBRARY_CROPS.items()])


RATING_CHOICES = (
    (5, 'Outstanding'),
    (4, 'Excellent'),
    (3, 'Good'),
    (2, 'Adequate'),
    (1, 'Bad'),
    (0, 'Rejected'),
)


class Image(models.Model):
    image_file = models.ImageField(
        upload_to='media-library',
        width_field='width',
        height_field='height',
    )
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)
    file_size = models.IntegerField(blank=True, null=True)
    alt_text = models.CharField(max_length=100, null=True, blank=True)
    caption = models.TextField(blank=True, null=True)
    rank = models.SmallIntegerField(default=0, db_index=True)

    rating = models.SmallIntegerField(
        choices=RATING_CHOICES,
        blank=True,
        null=True,
        db_index=True
    )

    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    xmp_data = models.TextField(blank=True)
    exif_data = models.TextField(blank=True)

    def __unicode__(self):
        return self.image_file.name

    def get_original_url(self):
        return self.image_file.url

    def get_thumbnail_url(self, width=160):
        url = self.image_file.url

        if not url:
            return None

        return thumb(
            url,
            fit_in=True,
            width=width,
            filters=['quality({})'.format(85)]
        )

    class Meta:
        verbose_name = _('Image')
        verbose_name_plural = _('Images')

    def save(self, **kwargs):
        from .xmp.extract import extract_xmp_data
        from .exif.extract import extract_exif_data
        self.xmp_data = extract_xmp_data(self.image_file.file)
        self.exif_data = extract_exif_data(self.image_file.file)
        return super(Image, self).save(**kwargs)


class ImageAssociation(models.Model):
    image = models.ForeignKey(Image, related_name='associations')
    content_type = models.ForeignKey(ContentType, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    object = generic.GenericForeignKey('content_type', 'object_id')
    canonical = models.BooleanField(default=False)

    class Meta:
        unique_together = ('image', 'content_type', 'object_id')
        index_together = [
            ['image', 'content_type', 'object_id']
        ]

    def save(self, **kwargs):
        # We want to make sure this is 1 and only 1 canonical image. To that
        # end if this instance is canonical then turn all others to False. If
        # this instance is not set to canonical, and there aren't any others,
        # then force it to be True

        if self.canonical:
            self.__class__.objects.filter(image=self.image).update(canonical=False)
        else:
            if not self.__class__.objects.filter(image=self.image, canonical=True).exists():
                self.canonical = True
        return super(ImageAssociation, self).save(**kwargs)


CROP_KEY_CHOICES = [(k, v[0]) for k, v in settings.MEDIACAT_AVAILABLE_CROP_RATIOS.items()]


class ImageCrop(models.Model):
    uuid = UUIDField(auto=True, hyphenate=True, null=True)

    image = models.ForeignKey(Image, related_name='crops')
    key = models.CharField(
        max_length=100,
        choices=CROP_KEY_CHOICES,
        db_index=True,
    )
    width = models.SmallIntegerField(db_index=True)
    height = models.SmallIntegerField(db_index=True)

    x1 = models.SmallIntegerField(verbose_name='left', blank=True, null=True)
    y1 = models.SmallIntegerField(verbose_name='top', blank=True, null=True)
    x2 = models.SmallIntegerField(verbose_name='right', blank=True, null=True)
    y2 = models.SmallIntegerField(verbose_name='bottom', blank=True, null=True)

    class Meta:
        unique_together = (
            ('image', 'width', 'height'),
        )

    def save(self, *args, **kwargs):
        self.width = self.x2 - self.x1
        self.height = self.y2 - self.y1
        super(ImageCrop, self).save(*args, **kwargs)

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


class ImageCropApplication(models.Model):
    """
    Represents the use of an `ImageCrop` from another model.
    """

    crop = models.ForeignKey(ImageCrop, related_name='applications')
    field_name = models.CharField(max_length=255)  # This should be more than enough...

    content_type = models.ForeignKey(ContentType, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    object = generic.GenericForeignKey('content_type', 'object_id')
