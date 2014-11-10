import json

from django import template
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.http import urlquote
from django.utils.safestring import mark_safe



register = template.Library()


@register.filter
def jsonify(object):
    return mark_safe(json.dumps(object, cls=DjangoJSONEncoder))


@register.simple_tag
def get_crop_url(crop, width=None, scale=1, urlencode=False, safe=None):
    from mediacat.models import ImageCrop
    if not isinstance(crop, ImageCrop):
        return ''
    if width:
        url = crop.url_at_width(width * scale)
    else:
        url = crop.url_at_width(crop.width * scale)

    if urlencode:
        kwargs = {}
        if safe is not None:
            kwargs['safe'] = safe
        url = urlquote(url, **kwargs)

    return url


@register.assignment_tag
def get_available_crop_scales(crop, width):
    from mediacat.models import ImageCrop
    if not isinstance(crop, ImageCrop):
        return []
    return crop.available_scales(width=width)



@register.simple_tag
def get_crop_height(crop, width):
    from mediacat.models import ImageCrop
    if not isinstance(crop, ImageCrop):
        return ''

    return crop.height_at_width(width)