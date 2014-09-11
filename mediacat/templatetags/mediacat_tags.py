import json

from django import template
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.safestring import mark_safe


register = template.Library()


@register.filter
def jsonify(object):
    return mark_safe(json.dumps(object, cls=DjangoJSONEncoder))


@register.simple_tag
def get_crop_url(crop, width=None):
    if width:
        return crop.url_at_width(width)
    else:
        return crop.url


@register.simple_tag
def get_retina_crop_url(crop, width=None):
    if width:
        return crop.retina_url_at_width(width)
    else:
        return crop.retina_url
