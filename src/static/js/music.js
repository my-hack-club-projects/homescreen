class MusicPlayer {
  constructor() {
    this.trackList = null;
    this.filteredList = null;
    this.filter = [];
    this.history = [];
    this.trackIndex = 0;
    this.isPlaying = false;
    this.updateTimer = null;

    // DOM elements
    this.nowPlaying = document.querySelector(".now-playing");
    this.trackName = document.querySelector(".track-name");
    this.trackArtist = document.querySelector(".track-artist");
    this.artistFilterPopup = document.querySelector(".artist-filter-popup")
    this.playPauseIcon = document.querySelector('.playpause-icon');
    this.currTrack = document.createElement('audio');

    // Buttons
    this.nextBtn = document.querySelector(".next-track");
    this.prevBtn = document.querySelector(".prev-track");
    this.playPauseTrackBtn = document.querySelector(".playpause-track");
    this.importTracksInput = document.querySelector("#import-tracks-input");
    this.importTracksForm = document.querySelector("#import-tracks-form");
    this.artistFilterButton = document.querySelector(".artist-filter-btn")

    // Event listeners
    this.currTrack.addEventListener("ended", this.nextTrack.bind(this));
    this.nextBtn.addEventListener("click", this.nextTrack.bind(this));
    this.prevBtn.addEventListener("click", this.prevTrack.bind(this));
    this.playPauseTrackBtn.addEventListener("click", this.playPauseTrack.bind(this));

    this.importTracksInput.addEventListener("change", async function (event) {
      this.trackName.textContent = 'Importing...';
      this.trackArtist.textContent = '';
      
      const formData = new FormData();
      for (let i = 0; i < event.target.files.length; i++) {
        formData.append('file', event.target.files[i]);
      }

      const response = await fetch('/music/import', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
  
      if (data.success) {
        this.fetchTracks();
      } else {
        alert('Failed to import tracks');
      }
    }.bind(this));

    this.artistFilterButton.addEventListener("click", function () {
      this.artistFilterPopup.classList.toggle("hidden");
      
      if (!this.artistFilterPopup.classList.contains("hidden")) {
        const artistList = new Set();
        this.trackList.forEach(track => {
          artistList.add(track.artist);
        });

        const artistFilterList = document.querySelector(".artist-filter-list");
        artistFilterList.innerHTML = '';
        artistList.forEach(artist => {
          const artistFilter = document.createElement('button');
          artistFilter.textContent = this.filter.includes(artist) ? "✓ " + artist : artist;
          artistFilter.classList.add('artist-filter-item', 'bg-white', 'hover:bg-gray-200', 'rounded-md', 'w-full', 'p-2');
          if (this.filter.includes(artist)) {
            artistFilter.classList.add('bg-gray-200');
          }
          artistFilter.addEventListener("click", function () {
            if (this.filter.includes(artist)) {
              this.filter = this.filter.filter(item => item !== artist);
              artistFilter.textContent = artist;
              artistFilter.classList.remove('bg-gray-200');
            } else {
              this.filter.push(artist);
              artistFilter.textContent = "✓ " + artist;
              artistFilter.classList.add('bg-gray-200');
            }
            this.update();

            if (!this.filter.includes(this.trackArtist.textContent)) {
              this.trackIndex = 0;
              this.history = [0];
              this.loadTrack(0);
            }
          }.bind(this));
          artistFilterList.appendChild(artistFilter);
        });
      } else {
        const artistFilterItems = document.querySelectorAll('.artist-filter-item');
        artistFilterItems.forEach(item => {
          item.removeEventListener('click', null);
          item.remove();
        });
      }
    }.bind(this));

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', this.playTrack.bind(this));
      navigator.mediaSession.setActionHandler('stop', function () {
        this.pauseTrack();
        this.fetchTracks();
      }.bind(this));
      navigator.mediaSession.setActionHandler('pause', this.pauseTrack.bind(this));
      navigator.mediaSession.setActionHandler('previoustrack', this.prevTrack.bind(this));
      navigator.mediaSession.setActionHandler('nexttrack', this.nextTrack.bind(this));
    }

    this.update();
    this.fetchTracks();
  }

  async fetchTracks() {
    this.trackName.textContent = 'Loading...';
    this.trackArtist.textContent = '';

    const response = await fetch('/music/tracks');
    const data = await response.json();

    if (data.success) {
      this.trackList = data.tracks;
      this.trackIndex = 0;
      this.history = [0];
      this.update();
      this.loadTrack(0);
    }
  }

  loadTrack(index) {
    clearInterval(this.updateTimer);

    if (this.filteredList.length === 0) {
      this.trackName.textContent = 'No tracks imported';
      this.trackArtist.textContent = '';
      return;
    }

    if (index < 0 || index >= this.filteredList.length) {
      console.error('Invalid track index');
      return
    }

    const track = this.filteredList[index];
    this.currTrack.src = track.path;
    this.currTrack.load();

    this.trackName.textContent = track.name;
    this.trackArtist.textContent = track.artist;

    this.updatePlayPauseIcon();
  }

  update() {
    this.updatePlayPauseIcon();

    let filteredList = this.trackList;
    if (this.filter.length > 0) {
      filteredList = this.trackList.filter(track => {
        return this.filter.includes(track.artist);
      });
    } else {
      filteredList = this.trackList;
    }
    this.filteredList = filteredList;
  }

  playPauseTrack() {
    this.isPlaying ? this.pauseTrack() : this.playTrack();
  }

  updatePlayPauseIcon() {
    if (this.playPauseIcon) {
      this.playPauseIcon.src = this.isPlaying 
        ? 'https://www.svgrepo.com/show/36641/pause.svg' 
        : 'https://www.svgrepo.com/show/148207/play-button.svg';
    }
  }

  playTrack() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.trackName.textContent,
        artist: this.trackArtist.textContent,
      });
    }

    this.currTrack.play();
    this.isPlaying = true;
    this.update();
  }

  pauseTrack() {
    this.currTrack.pause();
    this.isPlaying = false;
    this.update();
  }

  nextTrack() {
    if (this.history.length >= this.filteredList.length) {
      this.history.shift();
    }
    let nextIndex = Math.round(Math.random() * (this.filteredList.length - 1));
    while (this.history.includes(nextIndex)) {
      nextIndex = Math.round(Math.random() * (this.filteredList.length - 1));
    }
    this.history.push(nextIndex)
    this.trackIndex = nextIndex;
    this.loadTrack(this.trackIndex);
    this.playTrack();
    this.update();
  }

  prevTrack() {
    if (this.history.length <= 1) {
      return;
    }
    this.history.pop();
    this.trackIndex = this.history[this.history.length - 1];
    this.loadTrack(this.trackIndex);
    this.playTrack();
    this.update();
  }

  seekTo(seekSlider) {
    const seekTo = this.currTrack.duration * (seekSlider.value / 100);
    this.currTrack.currentTime = seekTo;
  }

  setVolume(volumeSlider) {
    this.currTrack.volume = volumeSlider.value / 100;
  }
}

const musicPlayer = new MusicPlayer();
