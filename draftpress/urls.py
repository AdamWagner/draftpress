from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from marketing.views import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'draftpress.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'marketing.views.home', name='home'),
    url(r'^admin/', include(admin.site.urls)),

)
