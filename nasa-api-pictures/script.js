const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

const showContent = (page) => {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
};

// NASA AIP
const apiKey = "DEMO_KEY";
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

const createDOMNodes = (page) => {
  const currentArr =
    page === "results" ? resultsArray : Object.values(favorites);

  currentArr.forEach((item) => {
    // Card container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = item.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = item.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-image-top");
    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = item.title;
    // Save text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to favorites";
      saveText.addEventListener("click", () => {
        saveFavorite(item.url);
      });
    } else {
      saveText.textContent = "Remove from Favorites";
      saveText.addEventListener("click", () => {
        removeFavorite(item.url);
      });
    }
    // Card text
    const cardText = document.createElement("p");
    cardText.textContent = item.explanation;
    // Footer
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Date
    const date = document.createElement("strong");
    date.textContent = item.date;
    // Copyright
    const copyright = document.createElement("span");
    copyright.textContent = item.copyright ? ` ${item.copyright}` : "";
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
};

const updateDOM = (page) => {
  // Get favorites
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
};

// GET images from api

const getNasaPictures = async () => {
  // Show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    console.log(error);
  }
};

//Add result to favorites

const saveFavorite = (itemUrl) => {
  // Loop throug results array to select favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show Saved confirmation
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
};

// Remove item from favorite
const removeFavorite = (itemUrl) => {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
};
getNasaPictures();
