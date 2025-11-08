# urls.py update
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.urls import path

app_name = "Music"
urlpatterns = [
    path("", views.index, name="index"),
    path("search/", views.search_song, name="search_song"),
    path("add-song/", views.add_song, name="add_song"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)