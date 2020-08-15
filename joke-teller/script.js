// VoiceRSS Javascript SDK

const button = document.getElementById("button");
const audioElement = document.getElementById("audio");

// Passing joke to RSS API

const toggleButton = () => {
  button.disabled = !button.disabled;
};

const tellJoke = (joke) => {
  VoiceRSS.speech({
    key: "f0d719f90a6e48d0aa61e0b4fe6b8fc1",
    src: joke,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
};

// Get Jokes From API

const getJokes = async () => {
  let joke = "";
  const apiUrl =
    "https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.type === "twopart") {
      joke = `${data.setup} ... ${data.delivery}`;
    }

    if (data.type === "single") {
      joke = data.joke;
    }

    tellJoke(joke);

    toggleButton();
  } catch (error) {
    console.log(error);
  }
};

button.addEventListener("click", getJokes);
audioElement.addEventListener("ended", toggleButton);
