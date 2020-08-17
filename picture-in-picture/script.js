const videoElement = document.getElementById("video");
const button = document.getElementById("button");

// Prompt to select media stream

const selectMediaStream = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
  } catch (error) {
    console.log(error);
  }
};

const triggerPictureInPicture = async () => {
  button.disabled = true;

  await videoElement.requestPictureInPicture();

  button.disabled = false;
};

button.addEventListener("click", triggerPictureInPicture);

selectMediaStream();
