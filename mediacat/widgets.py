import json

from django import forms
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe

from . import models


class MediaInput(forms.HiddenInput):
    is_hidden = False

    def __init__(self, *args, **kwargs):
        self.preview_scale = kwargs.pop('preview_scale', 1)
        self.category = kwargs.pop('category', None)
        super(MediaInput, self).__init__(*args, **kwargs)

    def render(self, name, value, attrs=None):
        if value:
            try:
                crop = models.ImageCrop.objects.get(pk=value)
                image = crop.image
            except models.ImageCrop.DoesNotExist:
                value = None
                crop = None
                image = None
        else:
            value = None
            crop = None
            image = None

        crops = self.attrs['data-crops']

        if not crop:
            starting_crop = crops[0]
            key, width = starting_crop
        else:
            key = crop.key
            starting_crop = next((c for c in crops if c[0] == key), crops[0])
            width = starting_crop[1]

        conf = settings.MEDIACAT_AVAILABLE_CROP_RATIOS[key]
        ratio = conf[1]
        label = conf[0]

        width = int(width * self.preview_scale)
        height = int(round(float(width) / ratio))

        category = self.category

        crops = ','.join(['{}:{}'.format(*c) for c in crops])

        return mark_safe(render_to_string(
            'mediacat/widgets/mediainput.html',
            {
                'id': attrs['id'],
                'name': name,
                'category': category,
                'ratio': ratio,
                'label': label,
                'width': width,
                'height': height,
                'value': value,
                'crop': crop,
                'image': image,
                'crops': crops,
            }
        ))
