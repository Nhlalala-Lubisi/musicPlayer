from django.contrib import admin
from .models import Song
from django.utils.html import format_html

class SongAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'album', 'display_image']
    readonly_fields = ['image_preview']
    
    def display_image(self, obj):
        if obj.get_image_url():
            return format_html('<img src="{}" height="50" />', obj.get_image_url())
        return "No image"
    display_image.short_description = 'Image'
    
    def image_preview(self, obj):
        if obj.get_image_url():
            return format_html('<img src="{}" height="200" />', obj.get_image_url())
        return "No image available"
    image_preview.short_description = 'Image Preview'

admin.site.register(Song, SongAdmin)