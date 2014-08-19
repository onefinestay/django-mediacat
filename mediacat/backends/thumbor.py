from urlparse import urlparse

from django.conf import settings
from libthumbor import CryptoURL


def thumb(url, **kwargs):
    '''
        returns a thumbor url for 'url' with **kwargs as thumbor options.

        Positional arguments:
        url -- the location of the original image

        Keyword arguments:
        For the complete list of thumbor options
        https://github.com/globocom/thumbor/wiki/Usage
        and the actual implementation for the url generation
        https://github.com/heynemann/libthumbor/blob/master/libthumbor/url.py
    '''
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
        thumbor_kwargs['fit_in'] = True

    thumbor_kwargs['image_url'] = url

    path = crypto.generate(**thumbor_kwargs)
    return u'{}{}'.format(base, path)
