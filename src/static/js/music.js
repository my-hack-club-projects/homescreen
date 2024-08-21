class MusicPlayer {
  constructor() {
    this.trackList = null;
    this.trackIndex = 0;
    this.isPlaying = false;
    this.updateTimer = null;

    // DOM elements
    this.nowPlaying = document.querySelector(".now-playing");
    this.trackName = document.querySelector(".track-name");
    this.trackArtist = document.querySelector(".track-artist");
    this.playPauseIcon = document.querySelector('.playpause-icon');
    this.currTrack = document.createElement('audio');

    // Buttons
    this.nextBtn = document.querySelector(".next-track");
    this.prevBtn = document.querySelector(".prev-track");
    this.playPauseTrackBtn = document.querySelector(".playpause-track");
    this.importTracksInput = document.querySelector("#import-tracks-input");
    this.importTracksForm = document.querySelector("#import-tracks-form");

    // Event listeners
    this.currTrack.addEventListener("ended", this.nextTrack.bind(this));
    this.nextBtn.addEventListener("click", this.nextTrack.bind(this));
    this.prevBtn.addEventListener("click", this.prevTrack.bind(this));
    this.playPauseTrackBtn.addEventListener("click", this.playPauseTrack.bind(this));

    this.importTracksInput.addEventListener("change", async function (event) {
      const count = event.target.files.length;
      console.log(`Importing ${count} tracks...`);
      
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

    this.fetchTracks();
  }

  async fetchTracks() {
    const response = await fetch('/music/tracks');
    const data = await response.json();

    if (data.success) {
      this.trackList = data.tracks;
      this.trackIndex = 0;
      this.loadTrack(0);
    }
  }

  // async importTracks(directory) {
  //   const response = await fetch('/music/import', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ directory: directory }),
  //   });

  //   const data = await response.json();

  //   if (data.success) {
  //     console.log('Tracks imported successfully');
  //     this.fetchTracks();
  //   }
  // }

  loadTrack(index) {
    clearInterval(this.updateTimer);

    const track = this.trackList[index];
    this.currTrack.src = track.path;
    this.currTrack.load();

    this.trackName.textContent = track.name;
    this.trackArtist.textContent = track.artist;

    this.updatePlayPauseIcon();
  }

  update() {
    this.updatePlayPauseIcon();
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
    this.trackIndex = (this.trackIndex + 1) % this.trackList.length;
    this.loadTrack(this.trackIndex);
    this.playTrack();
    this.update();
  }

  prevTrack() {
    this.trackIndex = (this.trackIndex - 1 + this.trackList.length) % this.trackList.length;
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
