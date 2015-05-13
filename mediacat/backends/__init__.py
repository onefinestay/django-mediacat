from django.conf import settings
from django.utils.module_loading import import_by_path


DEFAULT_BACKEND = 'mediacat.backends.thumbor.Backend'


def get_backend():
    return import_by_path(getattr(
        settings,
        'MEDIACAT_THUMBNAIL_BACKEND',
        DEFAULT_BACKEND
    ))()
