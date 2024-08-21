class MusicPlayer {
  constructor(trackList) {
    this.trackList = trackList;
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

    // Event listeners
    this.currTrack.addEventListener("ended", this.nextTrack.bind(this));
    this.nextBtn.addEventListener("click", this.nextTrack.bind(this));
    this.prevBtn.addEventListener("click", this.prevTrack.bind(this));
    this.playPauseTrackBtn.addEventListener("click", this.playPauseTrack.bind(this));
  }

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

const trackList = [
  {
    name: "Night Owl",
    artist: "Broke For Free",
    image: "https://images.pexels.com/photos/2264753/pexels-photo-2264753.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
    path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"
  },
  {
    name: "Enthusiast",
    artist: "Tours",
    image: "https://images.pexels.com/photos/3100835/pexels-photo-3100835.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
    path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3"
  },
  {
    name: "Shipping Lanes",
    artist: "Chad Crouch",
    image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
    path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
  },
];

const musicPlayer = new MusicPlayer(trackList);
musicPlayer.loadTrack(0);