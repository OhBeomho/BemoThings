import { canvas, ctx } from "./main.js";

export function start() {
  createParticles();
  animate();
}

export function stop() {
  stopAnimation = true;
}

const PARTICLE_SIZE = 8;
const NUMBER_OF_PARTICLES = 20;
const particles = [];

class Particle {
  constructor(x, y, index, color) {
    this.x = this.originX = x;
    this.y = this.originY = y;
    this.index = index;
    this.a = ((2 * Math.PI) / 100) * ((index / NUMBER_OF_PARTICLES) * 400);
    this.color = color;
  }

  update() {
    this.a += 0.1;
    this.x =
      this.originX +
      Math.sin((this.index * Math.PI) / (NUMBER_OF_PARTICLES / 2)) * Math.sin(this.a) * 50;
    this.y =
      this.originY +
      Math.cos((this.index * Math.PI) / (NUMBER_OF_PARTICLES / 2)) * Math.sin(this.a) * 50;

    if (this.a >= 8 * Math.PI) {
      this.a = 0;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, PARTICLE_SIZE, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function createParticles() {
  for (let i = 0; i < NUMBER_OF_PARTICLES; i++) {
    const x = canvas.width / 2 + Math.sin((i * Math.PI) / (NUMBER_OF_PARTICLES / 2)) * 100;
    const y = canvas.height / 2 + Math.cos((i * Math.PI) / (NUMBER_OF_PARTICLES / 2)) * 100;

    particles.push(
      new Particle(x, y, i, `hsl(${parseInt((i / NUMBER_OF_PARTICLES) * 360)}, 100%, 50%)`)
    );
  }
}

let handle,
  stopAnimation = false;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let particle of particles) {
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
