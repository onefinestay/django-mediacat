import json

from django import template
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.safestring import mark_safe


register = template.Library()


@register.filter
def jsonify(object):
    return mark_safe(json.dumps(object, cls=DjangoJSONEncoder))


@register.simple_tag
def get_crop_url(crop, width=None, scale=1):
    from mediacat.models import ImageCrop
    if not isinstance(crop, ImageCrop):
        return ''
    if width:
        return crop.url_at_width(width * scale)
    else:
        return crop.url_at_width(crop.width * scale)


@register.assignment_tag
def get_available_crop_scales(crop, width):
    return crop.available_scales(width=width)
