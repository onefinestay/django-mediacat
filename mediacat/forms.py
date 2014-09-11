import json

from django import forms
from . import models


class MediaFormField(forms.ModelChoiceField):

    def __init__(self, crops=None, field=None, *args, **kwargs):
        self.crops = crops
        self.field = field

        kwargs['queryset'] = models.ImageCrop.objects.all()

        super(MediaFormField, self).__init__(*args, **kwargs)

    def widget_attrs(self, widget):
        attrs = super(MediaFormField, self).widget_attrs(widget)
        extra_attrs = {
            'data-mediafield': 'true',
            'data-crops': self.crops,
        }
        attrs.update(extra_attrs)
        return attrs
