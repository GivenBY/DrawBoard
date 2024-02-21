const canvas = document.getElementById("canvas");
const sizeElement = document.getElementById("size");
const colorElement = document.getElementById("color");
const clearElement = document.getElementById("clear");
const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");
const redoButton = document.getElementById("redo");
const undoButton = document.getElementById("undo");
const ctx = canvas.getContext("2d");

// Resize the canvas
function resizeCanvas() {
  canvas.width = window.innerWidth - 170;
  canvas.height = window.innerHeight - 40;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let color = "black";

// Update the Color of the brush
colorElement.addEventListener("change", (e) => {
  color = e.target.value;
});

let size = 1;

// Update the size of the brush on the screen using input Field
function updateValue(e) {
  const newSize = parseInt(e.target.value, 10);

  if (!isNaN(newSize)) {
    size = newSize;
    sizeElement.value = size;
  } else {
    console.log("Invalid input. Please enter a numeric value.");
  }
}

// Increase and decrease the size of the brush using buttons
increaseButton.addEventListener("click", () => {
  size += 1;

  if (size > 50) {
    size = 50;
  }
  sizeElement.value = size;
  updateSizeOnScreen();
});

decreaseButton.addEventListener("click", () => {
  size -= 1;

  if (size < 1) {
    size = 1;
  }
  sizeElement.value = size;
  updateSizeOnScreen();
});

// Drawing Constraints
let isDrawing = false;
let lines = [];
let undoStack = [];
let points = [];
var mouse = { x: 0, y: 0 };
var previous = { x: 0, y: 0 };

// Drawing Functionality
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  previous = { x: mouse.x, y: mouse.y };
  mouse = mousePos(canvas, e);
  points = [];
  points.push({ x: mouse.x, y: mouse.y });
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    previous = { x: mouse.x, y: mouse.y };
    mouse = mousePos(canvas, e);
    points.push({ x: mouse.x, y: mouse.y });
    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", (e) => {
  isDrawing = false;
  lines.push(points);
  console.log(lines);
});

// Helps to clear everything on the canvas
clearElement.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Undo Redo Event Listeners
undoButton.addEventListener("click", Undo);
redoButton.addEventListener("click", redo);

// Function to find the mouse position
function mousePos(canvas, e) {
  var ClientRect = canvas.getBoundingClientRect();
  return {
    x: Math.round(e.clientX - ClientRect.left),
    y: Math.round(e.clientY - ClientRect.top),
  };
}

// Function to draw the paths again on the canvas
function drawPaths() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines.forEach((path) => {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
  });
}

// Undo Redo Functionality
function Undo() {
  if (lines.length === 0) return;
  undoStack.push(lines.pop());
  drawPaths();
}
function redo() {
  if (undoStack.length === 0) return;
  lines.push(undoStack.pop());
  drawPaths();
}
