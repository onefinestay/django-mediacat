from django import forms
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe

from . import models


class MediaInput(forms.HiddenInput):
    is_hidden = False

    def __init__(self, *args, **kwargs):
        self.preview_scale = kwargs.pop('preview_scale', None)
        super(MediaInput, self).__init__(*args, **kwargs)

    def render(self, name, value, attrs=None):
        key = self.attrs['data-crop-key']

        if isinstance(key, basestring):
            confs = None
            conf = settings.MEDIALIBRARY_CROPS[key]
        else:
            self.attrs['data-crop-key'] = ','.join(self.attrs['data-crop-key'])
            confs = [settings.MEDIALIBRARY_CROPS[k] for k in key]
            conf = confs[0]

        width = conf[1], conf[2]

        if not self.preview_scale:
            width = 200
        else:
            width = int(width * self.preview_scale)

        attrs['data-preview-width'] = width

        if value:
            try:
                crop = models.ImageCrop.objects.get(pk=value)
                attrs['data-image-id'] = crop.image.pk
            except models.ImageCrop.DoesNotExist:
                value = None
                crop = None

        if value:
            html = super(MediaInput, self).render(name, value, attrs=attrs)
            html += '<img width="{}" class="mediainput-preview" src="{}" />'. \
                format(width, crop.thumbnail_url(width=width))
        else:
            html = super(MediaInput, self).render(name, None, attrs=attrs)
            html += '<img width="{}" style="background-color: #ccc;" class="mediainput-preview" src="http://placehold.it/{}x{}" />'. \
                format(width, conf[1] * 2, conf[2] * 2)
        html += '<a href="javascript:;" class="mediainput-library"><span class="icon-pencil"></span></a>'
        return mark_safe('<div class="mediainput-widget">' + html + '</div>')
