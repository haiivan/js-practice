const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateElement = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElement = document.querySelectorAll("span");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let coundownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min.

const today = new Date().toISOString().split("T")[0];
dateElement.setAttribute("min", today);

function updateDOM() {
  coundownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    inputContainer.hidden = true;

    // Coundown has ended
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(coundownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      //Populating Coundown
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElement[0].textContent = `${days}`;
      timeElement[1].textContent = `${hours}`;
      timeElement[2].textContent = `${minutes}`;
      timeElement[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

// Take values from FORM INPUT
function updateCoundown(event) {
  event.preventDefault();
  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  // Get current version
  if (countdownDate === "") {
    alert("Please select a date");
  } else {
    countdownValue = new Date(countdownDate).getTime();

    updateDOM();
  }
}

// Reset all values
function reset() {
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  clearInterval(coundownActive);
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

function restorePreviousCountdown() {
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listener.
countdownForm.addEventListener("submit", updateCoundown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

// Load local storage
restorePreviousCountdown();
