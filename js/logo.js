import { canvas, ctx } from "./main.js";

export function start() {
  createParticles();
  animate();
}

export function stop() {
	if (particles.length) {
  	stopAnimation = true;
	}
}

class Particle {
  constructor(x, y, returnX, returnY, color) {
    this.x = x;
    this.y = y;
    this.returnX = returnX;
    this.returnY = returnY;
    this.color = color;
    this.opacity = 0;
    this.speed = Math.random() * 10;
    this.done = false;
  }

  update() {
    this.x -= (this.x - this.returnX) / (20 - this.speed);
    this.y -= (this.y - this.returnY) / (20 - this.speed);

    if (
      this.x > this.returnX - 0.2 &&
      this.x < this.returnX + 0.2 &&
      this.y > this.returnY - 0.2 &&
      this.y < this.returnY + 0.2
    ) {
      this.x = this.returnX;
      this.y = this.returnY;
      this.done = true;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(this.x, this.y, PARTICLE_WIDTH, PARTICLE_HEIGHT);
  }
}

const image = new Image();
const imageColorArray = [];
image.src = "../images/bemologo.png";
image.addEventListener("load", loadImage);

const PARTICLE_WIDTH = 4;
const PARTICLE_HEIGHT = 4;
const particles = [];

function createParticles() {
  for (let y = 0; y < image.height; y += PARTICLE_HEIGHT) {
    for (let x = 0; x < image.width; x += PARTICLE_WIDTH) {
      const colorArray = imageColorArray[y][x];
      const color = `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
      if (color === "rgb(0, 0, 0)") {
        continue;
      }

      const particleX = x >= image.width / 2 ? canvas.width - y : y;
      const particleY = y >= image.height / 2 ? canvas.height - x : x;

      const particle = new Particle(
        particleX,
        particleY,
        canvas.width / 2 - image.width / 2 + x,
        canvas.height / 2 - image.height / 2 + y,
        color
      );
      particles.push(particle);
    }
  }
}

function loadImage() {
  ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);

  const imageData = ctx.getImageData(
    canvas.width / 2 - image.width / 2,
    canvas.height / 2 - image.height / 2,
    image.width,
    image.height
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < image.height; y++) {
    const rgbArray = [];

    for (let x = 0; x < image.width; x++) {
      const r = imageData.data[y * 4 * imageData.width + x * 4];
      const g = imageData.data[y * 4 * imageData.width + x * 4 + 1];
      const b = imageData.data[y * 4 * imageData.width + x * 4 + 2];
      rgbArray.push([r, g, b]);
    }

    imageColorArray.push(rgbArray);
  }
}

let handle,
  stopAnimation = false;
let imageOpacity = 0;

function animate() {
  if (stopAnimation) {
    stopAnimation = false;
    particles.splice(0, particles.length);
		ctx.globalAlpha = 1;
		imageOpacity = 0;

    cancelAnimationFrame(handle);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (particles.every((particle) => particle.done)) {
    for (let particle of particles) {
      if (particle.opacity > 0) {
        particle.opacity -= 0.01;
			} else if (particle.opacity < 0) {
				particle.opacity = 0;
			}

      particle.draw();
    }

    imageOpacity += 0.01;
    ctx.globalAlpha = imageOpacity;
    ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);

    if (imageOpacity >= 1) {
			ctx.globalAlpha = 1;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
    	ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
      stopAnimation = true;
    }
  } else {
    for (let particle of particles) {
      if (!particle.done) {
        particle.update();
      }

      if (particle.opacity < 1) {
        particle.opacity += 0.005;
      }

      particle.draw();
    }
  }

  handle = requestAnimationFrame(animate);
}
