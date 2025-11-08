from django.db import models

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    deezer_id = models.BigIntegerField(unique=True, null=True, blank=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)  # Restored ImageField
    image_url = models.URLField(max_length=500, blank=True, null=True)  # Added URL field for Deezer images
    audio_file = models.FileField(upload_to='songs/', blank=True, null=True)
    audio_link = models.URLField(blank=True, null=True)
    preview_url = models.URLField(blank=True, null=True)
    lyrics = models.TextField(blank=True, null=True)
    duration = models.CharField(max_length=20, blank=True, null=True)
    album = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} - {self.artist}"
    
    def get_image_url(self):
        """Return either the uploaded image or the URL image"""
        if self.image:
            return self.image.url
        elif self.image_url:
            return self.image_url
        return None