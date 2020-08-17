const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

// Unsplash API

let loadingCount = 30;
const apiKey = "lfjcJde23Ge5h_Eru87pwFZNNgshp_2xV-AflMmgT_M";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${loadingCount}`;

const getPhotosFromApi = async () => {
  try {
    const res = await fetch(apiUrl);
    const photosArray = await res.json();
    displayPhotos(photosArray);
  } catch (error) {
    console.log(error);
  }
};

const displayPhotos = (arrayOfPhotos) => {
  imagesLoaded = 0;
  totalImages = arrayOfPhotos.length;
  arrayOfPhotos.forEach((photo) => {
    const anchor = document.createElement("a");
    setAttributes(anchor, {
      href: photo.links.html,
      target: "_blank",
    });

    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    img.addEventListener("load", imageLoader);

    anchor.appendChild(img);
    imageContainer.appendChild(anchor);
  });
};

const imageLoader = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    loadingCount = 30;
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${loadingCount}`;
  }
};

const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

// Infinite Scroll

const InfiniteScroll = () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotosFromApi();
  }
};

window.addEventListener("scroll", InfiniteScroll);

// On load
getPhotosFromApi();
