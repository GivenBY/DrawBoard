const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
function setUpCanvas() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.translate(0.5, 0.5);
  var sizeWidth = (100 * window.innerWidth) / 100 - 60,
    sizeHeight = (100 * window.innerHeight) / 100 || 766;
  canvas.width = sizeWidth;
  canvas.height = sizeHeight;
  canvas.style.width = sizeWidth;
  canvas.style.height = sizeHeight;
}

window.onload = setUpCanvas();
const sizeEl = document.getElementById("size");
const colorEl = document.getElementById("color");
const clearEl = document.getElementById("clear");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");

let size = 1;
let x = undefined;
let y = undefined;
let color = "black";
let isPressed = false;

canvas.addEventListener("mousedown", (e) => {
  isPressed = true;

  x = e.offsetX;
  y = e.offsetY;
});

canvas.addEventListener("mouseup", () => {
  isPressed = false;

  x = undefined;
  y = undefined;
});

function updateValue(e) {
  const newSize = parseInt(e.target.value, 10);

  // Check if parsing was successful and newSize is a valid integer
  if (!isNaN(newSize)) {
    size = newSize;
    sizeEl.value = size;
  } else {
    console.log("Invalid input. Please enter a numeric value.");
  }
}

canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;

    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);
    x = x2;
    y = y2;
  }
});

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
}

increaseBtn.addEventListener("click", () => {
  size += 1;

  if (size > 50) {
    size = 50;
  }
  sizeEl.value = size;
  updateSizeOnScreen();
});

decreaseBtn.addEventListener("click", () => {
  size -= 1;

  if (size < 1) {
    size = 1;
  }
  sizeEl.value = size;
  updateSizeOnScreen();
});

colorEl.addEventListener("change", (e) => {
  color = e.target.value;
});

clearEl.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
