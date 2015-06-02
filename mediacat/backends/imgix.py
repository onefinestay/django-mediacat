from django.conf import settings

import hashlib
import urllib
import urlparse
import zlib

SHARD_STRATEGY_CRC = "crc"
SHARD_STRATEGY_CYCLE = "cycle"

SIGNATURE_MODE_QUERY = "query"
SIGNATURE_MODE_PATH = "path"  # Unsupported at the moment


class UrlBuilder(object):
    def __init__(self, domains, use_https=False, sign_key=None, sign_mode=SIGNATURE_MODE_QUERY, shard_strategy=SHARD_STRATEGY_CRC):
        if not isinstance(domains, list):
            domains = [domains]
        self._domains = domains
        self._sign_key = sign_key
        self._sign_mode = sign_mode
        self._use_https = use_https
        self._shard_strategy = shard_strategy
        self._shard_next_index = 0

    def create_url(self, path, **parameters):
        if self._shard_strategy == SHARD_STRATEGY_CRC:
            crc = zlib.crc32(path) & 0xffffffff
            index = crc % len(self._domains)  # Deterministically choose a domain
            domain = self._domains[index]

        elif self._shard_strategy == SHARD_STRATEGY_CYCLE:
            domain = self._domains[self._shard_next_index]
            self._shard_next_index = (self._shard_next_index + 1) % len(self._domains)

        else:
            domain = self._domains[0]

        scheme = "https" if self._use_https else "http"
        url_obj = UrlHelper(
            domain,
            path,
            scheme,
            sign_key=self._sign_key,
            sign_mode=self._sign_mode,
            **parameters
        )
        return str(url_obj)


class UrlHelper(object):
    @classmethod
    def from_url(cls, url):
        pass

    def __init__(self, domain, path, scheme="http", sign_key=None, sign_mode=SIGNATURE_MODE_QUERY, **parameters):
        self._scheme = scheme
        self._host = domain
        self._path = path
        self._sign_key = sign_key
        if sign_mode != SIGNATURE_MODE_QUERY:
            raise Exception("Path signatures are not supported yet.")
        self._sign_mode = sign_mode
        self._parameters = {}
        for key, value in parameters.iteritems():
            self.set_parameter(key, value)

    def set_parameter(self, key, value):
        if not value:
            self.delete_parameter(key)
            return

        self._parameters[key] = value

    def delete_parameter(self, key):
        if key in self._parameters:
            del self._parameters[key]

    def __str__(self):
        query_pairs = []
        for key in sorted(self._parameters.keys()):
            query_pairs.append((str(key), str(self._parameters[key])))

        path = urllib.quote(self._path, safe=":/")
        if not path.startswith("/"):
            path = "/" + path  # Fix web proxy style URLs
        query = urllib.urlencode(query_pairs)
        if self._sign_key:
            delim = "" if query == "" else "?"
            signing_value = self._sign_key + path + delim + query
            signature = hashlib.md5(signing_value).hexdigest()
            if query:
                query += "&s=" + signature
            else:
                query = "s=" + signature

        return urlparse.urlunparse([
            self._scheme,
            self._host,
            path,
            "",
            query,
            "",
        ])


class Backend(object):

    def thumb(self, image, **kwargs):
        path = image.name

        if not path:
            return None

        builder = UrlBuilder(settings.IMGIX_BASE_URL, use_https=True)
        builder_kwargs = {
            'w': kwargs.get('width', None),
            'h': kwargs.get('height', None),
        }

        if 'crop' in kwargs:
            rect = '{left},{top},{width},{height}'.format(
                left=kwargs['crop'][0][0],
                top=kwargs['crop'][0][1],
                width=kwargs['crop'][1][0] - kwargs['crop'][0][0],
                height=kwargs['crop'][1][1] - kwargs['crop'][0][1],
            )

            builder_kwargs.update({
                'auto': 'format',
                'fit': 'crop',
                'rect': rect,
            })
        else:
            builder_kwargs.update({
                'fit': 'clip',
            })

        return builder.create_url(path, **builder_kwargs)
