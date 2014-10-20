from django.db import models
from django.db.models.fields.subclassing import Creator
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType
from django.db import transaction

from .forms import MediaFormField
from .models import (
    ImageCrop,
    ImageCropApplication,
)
from .widgets import MediaInput


def post_save_hook(sender, **kwargs):
    instance = kwargs['instance']

    if not instance:
        return

    applications = getattr(instance, MediaField.get_cache_name(), {})
    ct = ContentType.objects.get_for_model(instance)

    with transaction.atomic():
        # Clear existing applications
        ImageCropApplication.objects.filter(
            object_id=instance.id,
            content_type=ct,
        ).delete()

        new_applications = []

        for field_name, crop in applications.items():
            new_applications.append(ImageCropApplication(
                object_id=instance.id,
                content_type=ct,
                field_name=field_name,
                crop=crop
            ))

        if new_applications:
            ImageCropApplication.objects.bulk_create(new_applications)


def pre_delete_hook(sender, **kwargs):
    instance = kwargs['instance']

    if not instance:
        return

    ct = ContentType.objects.get_for_model(instance)

    ImageCropApplication.objects.filter(
        object_id=instance.id,
        content_type=ct,
    ).delete()


class MediaFieldCreator(Creator):
    def __init__(self, field):
        self.field = field
        self.cache_name = field.get_cache_name()

    def get_db_applications(self, instance):
        ct = ContentType.objects.get_for_model(instance)

        raw_applications = ImageCropApplication \
            .objects \
            .select_related('crop', 'crop__image') \
            .filter(
                object_id=instance.id,
                content_type=ct,
            )
        return {a.field_name: a.crop for a in raw_applications}

    def __get__(self, instance, owner=None):
        if instance is None:
            raise AttributeError('Can only be accessed via instance')

        try:
            applications = getattr(instance, self.cache_name)
        except AttributeError:
            applications = self.get_db_applications(instance)
            setattr(instance, self.cache_name, applications)

        return applications.get(self.field.attname, None)

    def __set__(self, instance, value):
        try:
            applications = getattr(instance, self.cache_name)
        except AttributeError:
            applications = self.get_db_applications(instance)
        applications[self.field.attname] = value
        setattr(instance, self.cache_name, applications)


class MediaFieldMeta(models.SubfieldBase):
    def __new__(cls, name, bases, attrs):
        def contribute_to_class(self, cls, name):
            self.set_attributes_from_name(name)
            self.model = cls
            cls._meta.add_virtual_field(self)
            cls._meta.local_fields.append(self) # Hack to make this work with modelforms
            setattr(cls, self.name, MediaFieldCreator(self))

            models.signals.post_save.connect(
                post_save_hook,
                sender=cls,
                dispatch_uid='mediacat_post_save_hook',
            )
            models.signals.pre_delete.connect(
                pre_delete_hook,
                sender=cls,
                dispatch_uid='mediacat_pre_delete_hook',
            )

        new_class = super(MediaFieldMeta, cls).__new__(cls, name, bases, attrs)
        new_class.contribute_to_class = contribute_to_class
        return new_class


class MediaField(models.Field):
    __metaclass__ = MediaFieldMeta

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

    # def save_form_data(self, instance, data):
    #     setattr(instance, self.name, data)

    @classmethod
    def get_cache_name(cls):
        return '_mediacat_crop_cache'

    def get_attname(self):
        return self.name

    def get_attname_column(self):
        attname = self.get_attname()
        return attname, None

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
