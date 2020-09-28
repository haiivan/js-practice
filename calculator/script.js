const calculatorDisplay = document.querySelector("h1");
const inputBtns = document.querySelectorAll("button");
const clearBtn = document.getElementById("clear-btn");

let firtValue = 0;
let operatorValue = "";
let awaitingNextValue = false;

const sendNumberValue = (number) => {
  if (awaitingNextValue) {
    calculatorDisplay.textContent = number;
    awaitingNextValue = false;
  } else {
    const displayValue = calculatorDisplay.textContent;
    calculatorDisplay.textContent =
      displayValue === "0" ? number : displayValue + number;
  }
};

const addDecimal = () => {
  if (awaitingNextValue) {
    return;
  }

  if (!calculatorDisplay.textContent.includes(".")) {
    calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
  }
};

const calculate = {
  "/": (firstNumber, secondNumber) => firstNumber / secondNumber,
  "*": (firstNumber, secondNumber) => firstNumber * secondNumber,
  "+": (firstNumber, secondNumber) => firstNumber + secondNumber,
  "-": (firstNumber, secondNumber) => firstNumber - secondNumber,
  "=": (firstNumber, secondNumber) => secondNumber,
};

const useOperator = (operator) => {
  const currentValue = Number(calculatorDisplay.textContent);

  if (operatorValue && awaitingNextValue) {
    operatorValue = operator;
    return;
  }

  if (!firtValue) {
    firtValue = currentValue;
  } else {
    const calculation = calculate[operatorValue](firtValue, currentValue);
    calculatorDisplay.textContent = calculation;
    firtValue = calculation;
  }

  awaitingNextValue = true;
  operatorValue = operator;
};

// Add event Listeners for buttons

inputBtns.forEach((inputBtn) => {
  if (inputBtn.classList.length === 0) {
    inputBtn.addEventListener("click", () => sendNumberValue(inputBtn.value));
  } else if (inputBtn.classList.contains("operator")) {
    inputBtn.addEventListener("click", () => useOperator(inputBtn.value));
  } else if (inputBtn.classList.contains("decimal")) {
    inputBtn.addEventListener("click", () => addDecimal());
  }
});

const resetAll = () => {
  calculatorDisplay.textContent = "0";
  firtValue = 0;
  operatorValue = "";
  awaitingNextValue = false;
};

clearBtn.addEventListener("click", resetAll);
