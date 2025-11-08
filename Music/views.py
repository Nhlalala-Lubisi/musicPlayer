from django.shortcuts import render, redirect
from .models import Song
from django.core.paginator import Paginator
import requests

def index(request):
    paginator = Paginator(Song.objects.all(), 1)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    context = {"page_obj": page_obj}
    return render(request, "index.html", context)

def search_song(request):
    query = request.GET.get('q', '')
    results = []
    
    if query:
        # Search Deezer API
        response = requests.get(f'https://api.deezer.com/search?q={query}&limit=10')
        if response.status_code == 200:
            data = response.json()
            results = data.get('data', [])
    
    return render(request, 'search.html', {'results': results, 'query': query})

def add_song(request):
    if request.method == 'POST':
        deezer_id = request.POST.get('deezer_id')
        
        # Check if song already exists
        if Song.objects.filter(deezer_id=deezer_id).exists():
            return redirect('Music:index')
        
        # Get track details from Deezer
        response = requests.get(f'https://api.deezer.com/track/{deezer_id}')
        if response.status_code == 200:
            track_data = response.json()
            
            # Create new song entry
            song = Song(
                title=track_data.get('title', ''),
                artist=track_data.get('artist', {}).get('name', ''),
                deezer_id=deezer_id,
                image_url=track_data.get('album', {}).get('cover_medium', ''),  # Use image_url for Deezer
                preview_url=track_data.get('preview', ''),
                duration=str(track_data.get('duration', 0)),
                album=track_data.get('album', {}).get('title', '')
            )
            song.save()
            
            return redirect('Music:index')
    
    return redirect('Music:search_song')