import importlib
import re

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse

from .exceptions import NoResolveException, NoReverseException


replacer_regex = re.compile('\(\?P\<(.+?)\>.*?\)')


def include(app_conf):
    app = importlib.import_module(app_conf)
    return app.library_paths


def ctype_get_canonical_image_category(self):
    return reverse('cms', **self.get_medialibrary_path_params())


def ctype_get_medialibrary_path_params(self):
    return {
        'model': self.model
    }


ContentType.get_canonical_image_category = ctype_get_canonical_image_category
ContentType.get_medialibrary_path_params = ctype_get_medialibrary_path_params


class Path(object):
    def __init__(self, regex, handler, name=None, children=None):
        self.regex = regex
        self.compiled_regex = re.compile(regex)
        self.handler = handler
        self.name = name
        if not children:
            self.children = []
        elif isinstance(children, PathPatterns):
            self.children = children.paths
        else:
            self.children = children

        for child in self.children:
            child.parent = self

    @property
    def depth(self):
        return len(self.regex.split('/'))

    @property
    def trimmed_regex(self):
        trimmed = self.regex
        if trimmed[0] == '^':
            trimmed = trimmed[1:]
        if trimmed[-1] == '$':
            trimmed = trimmed[:-1]
        return trimmed

    def flatten(self, prefix=None):
        paths = []
        prefixed_regex = regex = self.trimmed_regex

        if prefix:
            prefixed_regex = u'{}/{}'.format(prefix, prefixed_regex)

        for child in self.children:
            child_regex = child.trimmed_regex
            joined_regex = u'{}/{}'.format(regex, child_regex)

            if prefix:
                joined_regex = u'{}/{}'.format(prefix, joined_regex)

            joined_regex = r'^{}$'.format(joined_regex)

            path = Path(
                regex=joined_regex,
                handler=child.handler,
                name=child.name,
            )
            path.parent = self
            paths.append(path)
            paths.extend(child.flatten(prefix=prefixed_regex))
        return paths

    def list_all(self):
        paths = []
        handler = self.handler(self.name)
        paths.extend(handler.list_all(children=self.children))
        return paths

    def list_children(self):
        paths = []
        for child in self.children:
            paths.extend(child.list())
        return paths

    def list(self, child_paths=None, match_path=None, **kwargs):
        paths = []
        handler = self.handler(self.name, **kwargs)
        paths.extend(handler.list(child_paths=child_paths, match_path=match_path))
        return paths

    def resolve(self, path):
        matches = self.compiled_regex.match(path)
        if matches:
            handler = self.handler(name=self.name, **matches.groupdict())
            return handler.get_object()
        raise NoResolveException()

    def resolve_to_path(self, path):
        matches = self.compiled_regex.match(path)
        if matches:
            return self
        raise NoResolveException()

    def reverse(self, name, **kwargs):
        if self.name == name:
            replaced = replacer_regex.sub(lambda m: kwargs[m.group(1)], self.regex)
            if replaced[0] == '^':
                replaced = replaced[1:]
            if replaced[-1] == '$':
                replaced = replaced[:-1]
            return replaced
        raise NoReverseException()

    def __repr__(self):
        return '{} (name={})\n'.format(self.regex, self.name)


class BasePathHandler(object):

    def __init__(self, name, **kwargs):
        self.name = name
        self.kwargs = kwargs

    def get_object(self):
        return None

    def get_display_name(self, obj):
        if obj:
            return unicode(obj)
        return 'No Name'

    def list_all(self, children, parent_obj=None):
        from .utils import reverse
        paths = []

        for obj in self.get_queryset():
            content_type_id = ContentType.objects.get_for_model(obj).pk
            object_id = obj.pk

            params = obj.get_medialibrary_path_params()

            data = {
                'name': self.get_display_name(obj),
                'content_type_id': content_type_id,
                'object_id': object_id,
                'path': reverse(self.name, **params),
                'children': [],
            }

            for child in children:
                handler = child.handler(child.name, **params)
                data['children'].extend(handler.list_all(children=child.children, parent_obj=obj))
            paths.append(data)
        return paths

    def list(self, child_paths=None, match_path=None):
        from .utils import reverse
        paths = []

        for obj in self.get_queryset():
            content_type_id = ContentType.objects.get_for_model(obj).pk
            object_id = obj.pk

            params = obj.get_medialibrary_path_params()

            data = {
                'name': self.get_display_name(obj),
                'content_type_id': content_type_id,
                'object_id': object_id,
                'path': reverse(self.name, **params),
                'children': [],
            }
            print data['path'], str(match_path)
            if data['path'] == match_path:
                data['children'] = child_paths

            paths.append(data)
        return paths


class NullHandler(BasePathHandler):
    display_name = 'No Name'

    def list_all(self, children, parent_obj=None):
        from .utils import reverse
        paths = []

        if parent_obj:
            params = parent_obj.get_medialibrary_path_params()
        else:
            params = {}

        data = {
            'name': self.display_name,
            'content_type_id': None,
            'object_id': None,
            'path': reverse(self.name, **params),
            'children': []
        }

        for child in children:
            handler = child.handler(child.name, **params)
            data['children'].extend(handler.list_all(children=child.children, parent_obj=parent_obj))
        paths.append(data)

        return paths

    def list(self, child_paths=None, match_path=None):
        from .utils import reverse

        paths = []

        data = {
            'name': self.display_name,
            'content_type_id': None,
            'object_id': None,
            'path': reverse(self.name, **self.kwargs),
            'children': child_paths,
        }

        paths.append(data)

        return paths


class PathPatterns(object):

    def __init__(self, *paths):
        self.paths = paths
        self._flattened_paths = []
        self._build_flattened_paths()

        for path in self.paths:
            path.parent = None

    def _build_flattened_paths(self):
        self._flattened_paths = []
        for p in self.paths:
            self._flattened_paths.append(p)
            self._flattened_paths.extend(p.flatten())

    def resolve(self, path):
        for p in self._flattened_paths:
            try:
                return p.resolve(path)
            except NoResolveException:
                continue
        return None

    def reverse(self, name, **kwargs):
        for p in self._flattened_paths:
            try:
                return p.reverse(name, **kwargs)
            except NoReverseException:
                continue
        return None

    def list_all(self):
        paths = []
        for p in self.paths:
            paths.extend(p.list_all())
        return paths

    def list_root_paths(self):
        paths = []
        for p in self.paths:
            paths.extend(p.list())
        return paths

    def resolve_to_path(self, path):
        for p in self._flattened_paths:
            try:
                return p.resolve_to_path(path)
            except NoResolveException:
                continue
        return None

    def list_tree_for_path(self, path, params=None, child_paths=None, list_children=True):
        if not path:
            return self.list_root_paths()

        obj_path = self.resolve_to_path(path)

        if not params:
            obj = self.resolve(path)
            params = obj.get_medialibrary_path_params()

        if list_children:
            pass # fetch children here?

        paths = obj_path.list(child_paths=child_paths, match_path=path, **params)

        if not obj_path.parent:
            return paths

        parent_path = self.reverse(obj_path.parent.name, **params)

        return self.list_tree_for_path(parent_path, params=params, child_paths=paths)



