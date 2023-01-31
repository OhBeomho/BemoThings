import { canvas, ctx } from "./main.js";

export function start() {
  ctx.fillStyle = ctx.strokeStyle = "white";

  createPendulums();
  animate();
}

export function stop() {
  stopAnimation = true;
}

const PENDULUM_RADIUS = 8;
const PENDULUM_GAP = 2;
const NUMBER_OF_PENDULUM = 15;

const pendulums = [];

class Pendulum {
  constructor(x, y, speed, index) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.index = index;
    this.i = 0;
  }

  update() {
    const r = PENDULUM_RADIUS * (this.index + 1) + PENDULUM_GAP * (this.index + 1);
    this.i += this.speed;
    this.x = canvas.width / 2 + Math.sin(this.i) * r * 2;
    this.y = canvas.height / 2 + Math.cos(this.i) * r * 2;

    if (this.i >= 2 * Math.PI) {
      this.i = 2 * Math.PI;
      this.speed = -this.speed;
    } else if (this.i <= 0) {
      this.i = 0;
      this.speed = -this.speed;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, PENDULUM_RADIUS, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }
}

function createPendulums() {
  for (let i = 0; i < NUMBER_OF_PENDULUM; i++) {
    const pendulum = new Pendulum(
      canvas.width / 2,
      canvas.height / 2 - (PENDULUM_RADIUS * (i + 1) + PENDULUM_GAP * (i + 1)),
      (i + 5) / 1000,
      i
    );
    pendulums.push(pendulum);
  }
}

let handle,
  stopAnimation = false;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let pendulum of pendulums) {
    pendulum.update();
    pendulum.draw();
  }

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, canvas.height / 2);
  ctx.lineTo(
    canvas.width / 2,
    canvas.height / 2 +
      (PENDULUM_RADIUS * pendulums.length + PENDULUM_GAP * pendulums.length) * 2 +
      PENDULUM_RADIUS * 2
  );
  ctx.stroke();

  if (stopAnimation) {
    stopAnimation = false;
    pendulums.splice(0, pendulums.length);
    cancelAnimationFrame(handle);
    return;
  }

  handle = requestAnimationFrame(animate);
}
