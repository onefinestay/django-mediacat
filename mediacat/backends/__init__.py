from django.conf import settings

try:
    from django.utils.module_loading import import_string
except ImportError:
    from django.utils.module_loading import import_by_path as import_string


DEFAULT_BACKEND = 'mediacat.backends.thumbor.Backend'


def get_backend():
    return import_string(getattr(
        settings,
        'MEDIACAT_THUMBNAIL_BACKEND',
        DEFAULT_BACKEND
    ))()
