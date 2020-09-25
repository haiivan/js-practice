const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const itemLists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((name, index) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]));
  });
}
// Filter Arrays to remove empty items

const filterArray = (arr) => {
  const filteredArray = arr.filter((item) => item !== null);

  return filteredArray;
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.addEventListener("dragstart", drag);
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if empty - update value

const updateItem = (id, column) => {
  const selectedArray = listArrays[column];

  const selectedColumnEl = listColumns[column].children;

  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
};

// Add to column, reset textbox

const addToColumn = (column) => {
  if (addItems[column].textContent) {
    const itemText = addItems[column].textContent;
    const selecterArray = listArrays[column];
    selecterArray.push(itemText);
    addItems[column].textContent = "";
    updateDOM();
  }
};
// Show input box
const showInputBox = (column) => {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
};

//  Hide input box

const hideInputBox = (column) => {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
};

// Upodate arrays

const rebuildArrays = () => {
  backlogListArray = [];
  for (let index = 0; index < backlogList.children.length; index++) {
    backlogListArray.push(backlogList.children[index].textContent);
  }
  progressListArray = [];
  for (let index = 0; index < progressList.children.length; index++) {
    progressListArray.push(progressList.children[index].textContent);
  }
  completeListArray = [];
  for (let index = 0; index < completeList.children.length; index++) {
    completeListArray.push(completeList.children[index].textContent);
  }

  onHoldListArray = [];
  for (let index = 0; index < onHoldList.children.length; index++) {
    onHoldListArray.push(onHoldList.children[index].textContent);
  }
  updateDOM();
};

// Item drag

const drag = (event) => {
  dragging = true;
  draggedItem = event.target;
};

// When item enters col area
const dragEnter = (column) => {
  listColumns[column].classList.add("over");
  currentColumn = column;
};

// Column allows for item to drop

const allowDrop = (event) => {
  event.preventDefault();
};

// Dropping Item in column

const drop = (event) => {
  event.preventDefault();
  // Remove BCGC
  listColumns.forEach((colum) => {
    colum.classList.remove("over");
  });
  // Add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
};

// On load

updateDOM();
