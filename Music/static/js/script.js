document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('play');
    const volumeSlider = document.getElementById('volume-slider');
    const audio = document.getElementById('audio-player');
    const progressContainer = document.querySelector('.progress-container');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const lyricsContainer = document.getElementById('lyrics');

    let isPlaying = false;
    let lyricsData = [];
    let isSynced = false;

    // Format time
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Play / Pause
    function playSong() {
        isPlaying = true;
        playBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
        audio.play();
    }
    function pauseSong() {
        isPlaying = false;
        playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
        audio.pause();
    }
    playBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());

    // Volume
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });

    // Progress update
    audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
        syncLyrics();
    });

    // Set progress
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    });

    // Reset play button when ended
    audio.addEventListener('ended', () => pauseSong());

    // Lyrics parsing
    function parseLyrics(raw) {
        return raw.split("\n").map(line => {
            const match = line.match(/\[(\d{2}):(\d{2})\](.*)/);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const time = minutes * 60 + seconds;
                return { time, text: match[3].trim() };
            }
            return null;
        }).filter(item => item);
    }

    function renderLyrics(lyrics) {
        lyricsContainer.innerHTML = "";
        lyrics.forEach(line => {
            const p = document.createElement("p");
            p.textContent = line.text;
            p.setAttribute("data-time", line.time);
            lyricsContainer.appendChild(p);
        });
    }

    function syncLyrics() {
        if (!isSynced) return;
        const currentTime = audio.currentTime;
        let activeIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) activeIndex = i;
        }
        if (activeIndex !== -1) {
            const lines = lyricsContainer.querySelectorAll("p");
            lines.forEach(line => line.classList.remove("active"));
            const activeLine = lines[activeIndex];
            if (activeLine) {
                activeLine.classList.add("active");
                lyricsContainer.scrollTop = activeLine.offsetTop - lyricsContainer.clientHeight / 2;
            }
        }
    }

    // Init lyrics
    const rawLyrics = lyricsContainer.dataset.lyrics;
    if (rawLyrics) {
        lyricsData = parseLyrics(rawLyrics);
        if (lyricsData.length > 0) {
            isSynced = true;
            renderLyrics(lyricsData);
        } else {
            lyricsContainer.classList.add("plain");
            lyricsContainer.textContent = rawLyrics;
        }
    } else {
        lyricsContainer.classList.add("plain");
        lyricsContainer.textContent = "No lyrics available.";
    }
});
