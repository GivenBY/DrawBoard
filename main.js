const canvas = document.getElementById("canvas");
const sizeElement = document.getElementById("size");
const colorElement = document.getElementById("color");
const clearElement = document.getElementById("clear");
const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");
const redoButton = document.getElementById("redo");
const undoButton = document.getElementById("undo");
const ctx = canvas.getContext("2d");

// Error handling for DOM elements to ensure they exist before adding event listeners
if (!canvas || !sizeElement || !colorElement || !clearElement || !increaseButton || !decreaseButton || !redoButton || !undoButton) {
  console.error("One or more required DOM elements are missing.");
  return;
}

// Resize the canvas
let resizeTimeout;
function resizeCanvas() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    canvas.width = window.innerWidth - 170;
    canvas.height = window.innerHeight - 40;
  }, 100);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Update the Color of the brush
let color = "black";
colorElement.addEventListener("change", (e) => {
  color = e.target.value;
});

// Update the size of the brush on the screen using input Field
let size = 1;
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
function updateBrushSize(increment) {
  size = Math.min(50, Math.max(1, size + increment));
  sizeElement.value = size;
  updateSizeOnScreen();
}

increaseButton.addEventListener("click", () => updateBrushSize(1));
decreaseButton.addEventListener("click", () => updateBrushSize(-1));

// Drawing Constraints
let isDrawing = false;
let points = [];
let lines = [];
let undoStack = [];
var mouse = { x: 0, y: 0 };
var previous = { x: 0, y: 0 };

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  previous = { x: mouse.x, y: mouse.y };
  mouse = mousePos(canvas, e);
  points = [{ x: mouse.x, y: mouse.y }];
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    previous = { x: mouse.x, y: mouse.y };
    mouse = mousePos(canvas, e);
    points.push({ x: mouse.x, y: mouse.y });
    drawLine(previous, mouse);
  }
});

canvas.addEventListener("mouseup", () => {
  if (isDrawing) {
    isDrawing = false;
    lines.push([...points]);
  }
});

function drawLine(prev, curr) {
  requestAnimationFrame(() => {
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
  });
}

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
  lines.forEach(path => {
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
