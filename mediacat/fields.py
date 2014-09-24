from django.db import models
from django.core.exceptions import ValidationError
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

    def get_model_attr_name(self, field_name=None):
        return '_mediacat_crop_{}'.format(field_name or self.name)

    def __get__(self, instance, instance_type=None):
        """
        retrieve image crop from by instance
        """
        if instance is None:
            raise AttributeError('Can only be accessed via instance')

        media_fields = [f for f in instance._meta.virtual_fields if isinstance(f, self.__class__)]
        media_field_names = [f.name for f in media_fields]

        if self.get_value(instance):
            return self.get_value(instance)

        ct = ContentType.objects.get_for_model(instance)
        try:
            applications = ImageCropApplication.objects.select_related('crop', 'crop__image').filter(
                object_id=instance.id,
                content_type=ct,
                field_name__in=media_field_names
            )
            self.set_values(instance, applications)
        except ImageCrop.DoesNotExist:
            self.set_value(instance, None)
        return self.get_value(instance)

    def has_value(self, instance):
        return hasattr(instance, self.get_model_attr_name())

    def get_value(self, instance):
        return getattr(instance, self.get_model_attr_name(), None)

    def set_values(self, instance, applications):
        for a in applications:
            self.set_value(instance, a.crop, a.field_name)

    def set_value(self, instance, value, field_name=None):
        setattr(instance, self.get_model_attr_name(field_name), value)

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

        if not crop:
            return

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

        keys = [c[0] for c in self.crops]

        ct = ContentType.objects.get_for_model(instance)
        ImageCropApplication.objects.filter(
            object_id=instance.id,
            content_type=ct,
            crop__key__in=keys).delete()

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
