from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from django.contrib import admin
admin.autodiscover()

from marketing.views import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'draftpress.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', TemplateView.as_view(template_name='marketing/home.html'), name="pricing"),
    url(r'^admin/', include(admin.site.urls)),

)
