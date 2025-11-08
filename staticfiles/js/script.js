document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const audio = new Audio();
    const progressContainer = document.querySelector('.progress-container');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const volumeSlider = document.querySelector('.volume-slider');
    const songItems = document.querySelectorAll('.song-item');
    
    // Mock songs data
    const songs = [
        {
            title: 'Summer Vibes',
            artist: 'Ocean Waves',
            src: 'https://assets.codepen.io/217233/music1.mp3',
            duration: '4:30',
            cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
        },
        {
            title: 'Night City',
            artist: 'Synthwave Collective',
            src: 'https://assets.codepen.io/217233/music2.mp3',
            duration: '3:45',
            cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
        },
        {
            title: 'Rock Anthem',
            artist: 'Guitar Heroes',
            src: 'https://assets.codepen.io/217233/music3.mp3',
            duration: '5:20',
            cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
        },
        {
            title: 'Jazz Cafe',
            artist: 'Smooth Quartet',
            src: 'https://assets.codepen.io/217233/music4.mp3',
            duration: '6:15',
            cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
        }
    ];
    
    let currentSongIndex = 0;
    let isPlaying = false;
    
    // Load song
    function loadSong(index) {
        const song = songs[index];
        audio.src = song.src;
        document.querySelector('.song-title').textContent = song.title;
        document.querySelector('.song-artist').textContent = song.artist;
        document.querySelector('.album-art img').src = song.cover;
        document.querySelector('.duration').textContent = song.duration;
        
        // Update active song in playlist
        songItems.forEach((item, idx) => {
            if (idx === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Play song
    function playSong() {
        isPlaying = true;
        playBtn.querySelector('i').classList.remove('fa-play');
        playBtn.querySelector('i').classList.add('fa-pause');
        audio.play();
    }
    
    // Pause song
    function pauseSong() {
        isPlaying = false;
        playBtn.querySelector('i').classList.remove('fa-pause');
        playBtn.querySelector('i').classList.add('fa-play');
        audio.pause();
    }
    
    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }
    
    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }
    
    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update time display
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    }
    
    // Set progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    }
    
    // Set volume
    function setVolume() {
        audio.volume = volumeSlider.value / 100;
    }
    
    // Event listeners
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    
    // Click on song in playlist
    songItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
    });
    
    // Load first song
    loadSong(currentSongIndex);
});