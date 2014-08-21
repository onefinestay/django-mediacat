import importlib
from collections import defaultdict

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
    images = models.ImageAssociation.objects.all()
    image_map = {}

    for image in images:
        content_type_id = image.content_type_id
        obj_id = image.object_id

        if content_type_id not in image_map:
            image_map[content_type_id] = defaultdict(int)

        image_map[content_type_id][obj_id] += 1

    def _annotate(cat):
        try:
            cat['count'] = image_map[cat['content_type_id']][cat['object_id']]
        except KeyError:
            cat['count'] = 0

        if cat['children']:
            for child in cat['children']:
                _annotate(child)

    for category in categories:
        _annotate(category)

