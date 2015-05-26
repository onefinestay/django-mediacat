from urlparse import urlparse

from django.conf import settings
from libthumbor import CryptoURL


class Backend(object):

    def thumb(self, image, **kwargs):
        url = image.url

        if not url:
            return None

        if settings.THUMBOR_BASE_URL:
            # If THUMBOR_BASE_URL is explicity set, use that
            base = settings.THUMBOR_BASE_URL
        else:
            # otherwise assume that thumbor is setup behind the same
            # CDN behind the `thumbor` namespace.
            scheme, netloc = urlparse.urlsplit(url)[:2]
            base = '{}://{}/thumbor'.format(scheme, netloc)
        crypto = CryptoURL(key=settings.THUMBOR_KEY)

        # just for code clarity
        thumbor_kwargs = kwargs
        if not 'fit_in' in thumbor_kwargs:
            thumbor_kwargs['fit_in'] = False

        thumbor_kwargs['image_url'] = url

        path = crypto.generate(**thumbor_kwargs)
        return u'{}{}'.format(base, path)
