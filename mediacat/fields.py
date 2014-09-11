from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

from .forms import MediaFormField
from .models import (
    ImageCrop,
    ImageCropApplication,
)
from .widgets import MediaInput


class MediaFieldMixin(object):
    def contribute_to_class(self, cls, name):
        self.set_attributes_from_name(name)
        self.model = cls
        cls._meta.add_virtual_field(self)

        # Connect myself as the descriptor for this field
        setattr(cls, name, self)

        models.signals.post_save.connect(self._post_save, sender=cls)
        models.signals.pre_delete.connect(self._pre_delete, sender=cls)

    def get_model_attr_name(self):
        return '_mediacat_crop_{}'.format(self.name)

    def __get__(self, instance, instance_type=None):
        """
        retrieve image crop from by instance
        """
        if instance is None:
            raise AttributeError('Can only be accessed via instance')

        if self.get_value(instance):
            return self.get_value(instance)

        ct = ContentType.objects.get_for_model(instance)
        try:
            self.set_value(instance, ImageCrop.objects.get(
                applications__object_id=instance.id,
                applications__content_type=ct,
                applications__field_name=self.name))
        except ImageCrop.DoesNotExist:
            self.set_value(instance, None)
        return self.get_value(instance)

    def has_value(self, instance):
        return hasattr(instance, self.get_model_attr_name())

    def get_value(self, instance):
        return getattr(instance, self.get_model_attr_name(), None)

    def set_value(self, instance, value):
        setattr(instance, self.get_model_attr_name(), value)

    def __set__(self, instance, value):
        """
        sets a crop instance as a crop instance application
        """
        attr_name = self.get_model_attr_name()
        setattr(instance, attr_name, value)

    def _post_save(self, instance=None, created=False, **kwargs):
        if not instance:
            return

        crop = self.get_value(instance)

        if crop and not crop.pk:
            crop.save()
            self.set_value(instance, crop)

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

        if crop_application.crop_id != crop.id:
            crop_application.crop = crop
            crop_application.save()

    def _pre_delete(self, instance=None, **kwargs):
        if not instance:
            return

        ct = ContentType.objects.get_for_model(instance)
        ImageCropApplication.objects.filter(
            object_id=instance.id,
            content_type=ct,
            crop__key=self.key).delete()

    def save_form_data(self, instance, data):
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

        if crop_application.crop != data:
            crop_application.crop = data
            crop_application.save()



class MediaField(MediaFieldMixin, models.Field):

    def __init__(self, key=None, keys=None, width=None, crops=None, **kwargs):
        kwargs['editable'] = True
        if key and width:
            self.crops = ((key, width),)
        elif keys and width:
            self.crops = ((key, width) for key in keys)
        elif crops:
            self.crops = crops
        else:
            raise ValidationError("Improperly configured MediaField, must supply one of (key and width), (keys and width) or crops")

        super(MediaField, self).__init__(**kwargs)

    def formfield(self, **kwargs):
        widget = kwargs.pop('widget', MediaInput())

        defaults = {
            'crops': self.crops,
            'form_class': MediaFormField,
            'field': self,
        }
        defaults.update(kwargs)
        defaults['widget'] = widget
        return super(MediaField, self).formfield(**defaults)
