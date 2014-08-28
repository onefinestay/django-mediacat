from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

from .models import ImageCrop, ImageCropApplication


class MediaFieldMixin(object):
    def contribute_to_class(self, cls, name):
        self.set_attributes_from_name(name)
        self.model = cls
        cls._meta.add_virtual_field(self)

        # Connect myself as the descriptor for this field
        setattr(cls, name, self)

        models.signals.post_save.connect(self._post_save, sender=cls)
        models.signals.pre_delete.connect(self._pre_delete, sender=cls)

    def __get__(self, instance, instance_type=None):
        """
        retrieve image crop from by instance
        """
        if instance is None:
            raise AttributeError('Can only be accessed via instance')

        if hasattr(self, '_crop'):
            return self._crop

        ct = ContentType.objects.get_for_model(instance)
        try:
            self._crop = ImageCrop.objects.get(
                applications__object_id=instance.id,
                applications__content_type=ct,
                key=self.key)
        except ImageCrop.DoesNotExist:
            self._crop = None

        return self._crop

    def __set__(self, instance, value):
        """
        sets a crop instance as a crop instance application
        """
        self._crop = value

    def _post_save(self, instance=None, created=False, **kwargs):
        if not getattr(self, '_crop', None):
            return

        if not instance:
            return

        if not self._crop.pk:
            self._crop = self._crop.save()

        ct = ContentType.objects.get_for_model(instance)
        try:
            crop_application = ImageCropApplication.objects.get(
                object_id=instance.id,
                content_type=ct,
                field_name=self.name)
        except ImageCropApplication.DoesNotExist:
            crop_application = ImageCropApplication(
                object_id=instance.id,
                content_type=ct,
                field_name=self.name)

        if crop_application.crop_id == self._crop.id:
            crop_application.crop = self._crop
            crop_application.save()

    def _pre_delete(self, instance=None, **kwargs):
        if not instance:
            return

        ct = ContentType.objects.get_for_model(instance)
        ImageCropApplication.objects.filter(
            object_id=instance.id,
            content_type=ct,
            crop__key=self.key).delete()


class MediaField(MediaFieldMixin, models.Field):

    def __init__(self, key, **kwargs):
        self.key = key
        super(MediaField, self).__init__(**kwargs)
