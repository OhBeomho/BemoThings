import { canvas, ctx } from "./main.js";

export function start() {
  createParticles();
  animate();
}

export function stop() {
  stopAnimation = true;
}

const NUMBER_OF_PARTICLES = 80;
const PARTICLE_RADIUS = 2;
const AREA_WIDTH = window.innerWidth / 8 < 120 ? 120 : window.innerWidth / 8;
const AREA_HEIGHT = AREA_WIDTH;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
    this.color = `hsl(${Math.floor(Math.random() * 180 + 180)}, 100%, 50%)`;
  }

  getParticlesFromArea(areaWidth, areaHeight) {
    const array = [];

    const startX = this.x - areaWidth / 2;
    const startY = this.y - areaHeight / 2;
    const endX = startX + areaWidth;
    const endY = startY + areaHeight;

    for (let particle of particles) {
      if (particle.x > startX && particle.x < endX && particle.y > startY && particle.y < endY)
        array.push(particle);
    }

    return array;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, PARTICLE_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const particles = [];

function createParticles() {
  for (let i = 0; i < NUMBER_OF_PARTICLES; i++)
    particles.push(
      new Particle(
        Math.random() * (canvas.width - PARTICLE_RADIUS) + PARTICLE_RADIUS,
        Math.random() * (canvas.height - PARTICLE_RADIUS) + PARTICLE_RADIUS
      )
    );
}

let handle,
  stopAnimation = false;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let particle of particles) {
    drawLines(particle, AREA_WIDTH, AREA_HEIGHT);
    particle.update();
    particle.draw();
  }

  if (stopAnimation) {
    stopAnimation = false;
    particles.splice(0, particles.length);
    cancelAnimationFrame(handle);
    return;
  }

  handle = requestAnimationFrame(animate);
}

function drawLines(particle, areaWidth, areaHeight) {
  for (let p of particle.getParticlesFromArea(areaWidth, areaHeight)) {
    const gradient = ctx.createLinearGradient(particle.x, particle.y, p.x, p.y);
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, p.color);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = PARTICLE_RADIUS / 3;

    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
}
