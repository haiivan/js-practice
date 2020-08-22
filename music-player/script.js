const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const music = document.querySelector("audio");

const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

const currentTimeElement = document.getElementById("current-time");
const durationElement = document.getElementById("duration");

const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");

// Music
const songs = [
  {
    name: "jacinto-1",
    displayName: "Electric Chill Machine",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-2",
    displayName: "Seven Nation Army (Remix)",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-3",
    displayName: "Goodnight, Disco Queen",
    artist: "Jacinto Design",
  },
  {
    name: "metric-1",
    displayName: "Front Row (Remix)",
    artist: "Metric/Jacinto Design",
  },
];

// Check if Playing
let isPlaying = false;

// Play

const playSong = () => {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
};

// Pause

const pauseSong = () => {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
};

// Play or pause

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

// Update DOM

const loadSong = (song) => {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
};

// Current song

let songIndex = 0;

// prev Song
const prevSong = () => {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
};

// next Song
const nextSong = () => {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
};

// On load, select first song

loadSong(songs[songIndex]);

// Update Pogress bar

const displayTime = (element, durationOrCurrentTime) => {
  const minutes = Math.floor(durationOrCurrentTime / 60);
  let seconds = Math.floor(durationOrCurrentTime % 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  // Delay
  if (seconds) {
    element.textContent = `${minutes}:${seconds}`;
  }
};

const updateProgressBar = (event) => {
  if (isPlaying) {
    const { duration, currentTime } = event.srcElement;
    // Update progress bar
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Display duration and progress

    displayTime(durationElement, duration);
    displayTime(currentTimeElement, currentTime);
  }
};

const setProgressBar = (event) => {
  const width = event.srcElement.clientWidth;
  const clickX = event.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
};

// Event Listeners

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

music.addEventListener("timeupdate", updateProgressBar);
music.addEventListener("ended", nextSong);
progressContainer.addEventListener("click", setProgressBar);
