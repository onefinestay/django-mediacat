import json

from django import template
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.safestring import mark_safe


register = template.Library()


@register.filter
def jsonify(object):
    return mark_safe(json.dumps(object, cls=DjangoJSONEncoder))
