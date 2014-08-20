import importlib

from django.conf import settings

app_conf = settings.MEDIACAT_CONF
app = importlib.import_module(app_conf)

library_paths = app.library_paths

reverse = library_paths.reverse
resolve = library_paths.resolve
list_all = library_paths.list_all
