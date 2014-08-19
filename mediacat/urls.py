from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = patterns(
    '',
    url(r'^images/$', views.ImageList.as_view(), name='mediacat-image-list'),
    url(r'^images/(?P<pk>[0-9]+)/$', views.ImageDetail.as_view(), name='mediacat-image-detail'),
    url(r'^crops/$', views.CropList.as_view(), name='mediacat-crop-list'),
    url(r'^crops/(?P<pk>[0-9]+)/$', views.CropDetail.as_view(), name='mediacat-crop-detail'),
    url(r'^(?P<path>([a-z0-9-]+/)*)$', views.Library.as_view(), name='mediacat-library'),
)

urlpatterns = format_suffix_patterns(urlpatterns)
