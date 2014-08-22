import importlib
from collections import defaultdict

from django.db.models import Count
from django.conf import settings

from . import models


app_conf = settings.MEDIACAT_CONF
app = importlib.import_module(app_conf)

library_paths = app.library_paths

reverse = library_paths.reverse
resolve = library_paths.resolve
list_all = library_paths.list_all


def model_to_path(obj):
    return obj.get_canonical_image_category()


def annotate_counts(categories):

    content_types = []

    def _get_content_types(cat):
        ctypes = []
        ctypes.append(cat['content_type_id'])
        if cat['children']:
            for child in cat['children']:
                ctypes += _get_content_types(child)
        return ctypes

    for category in categories:
        content_types += _get_content_types(category)

    content_types = set(content_types)
    count_map = {}

    for ctype in content_types:
        counts = models.ImageAssociation.objects.filter(content_type_id=ctype)\
            .values('object_id')\
            .annotate(count=Count('object_id'))
        count_map[ctype] = {c['object_id']: c['count'] for c in counts}

    def _annotate(cat):
        try:
            cat['count'] = count_map[cat['content_type_id']][cat['object_id']]
        except KeyError:
            cat['count'] = 0

        if cat['children']:
            for child in cat['children']:
                _annotate(child)

    for category in categories:
        _annotate(category)
