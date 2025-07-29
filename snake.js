const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const size = 16;
const scale = canvas.width / size;
let snake = [{x: 8, y: 8}];
let dir = {x: 0, y: -1};
let food = {x: 4, y: 4};
let running = true;

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);
}

function placeFood() {
  food.x = Math.floor(Math.random() * size);
  food.y = Math.floor(Math.random() * size);
}

function update() {
  if (!running) return;
  const head = {x: (snake[0].x + dir.x + size) % size,
                y: (snake[0].y + dir.y + size) % size};
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    running = false;
    alert('Game Over');
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.forEach(seg => drawPixel(seg.x, seg.y, '#0f0'));
  drawPixel(food.x, food.y, '#f00');
}

function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, 150);

function setDirection(newDir) {
  if ((newDir.x + dir.x === 0 && newDir.y + dir.y === 0)) return;
  dir = newDir;
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp': setDirection({x: 0, y: -1}); break;
    case 'ArrowDown': setDirection({x: 0, y: 1}); break;
    case 'ArrowLeft': setDirection({x: -1, y: 0}); break;
    case 'ArrowRight': setDirection({x: 1, y: 0}); break;
  }
});

document.querySelectorAll('[data-key]').forEach(btn => {
  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    switch (btn.dataset.key) {
      case 'UP': setDirection({x:0, y:-1}); break;
      case 'DOWN': setDirection({x:0, y:1}); break;
      case 'LEFT': setDirection({x:-1, y:0}); break;
      case 'RIGHT': setDirection({x:1, y:0}); break;
    }
  });
});

