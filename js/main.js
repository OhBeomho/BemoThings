export const canvas = document.querySelector(".view canvas");

canvas.width = (window.innerWidth / 100) * 80;
canvas.height = (window.innerHeight / 100) * 80;

export const ctx = canvas.getContext("2d");

import { start as startChaksi, stop as stopChaksi } from "./chaksi.js";
import { start as startPendulum, stop as stopPendulum } from "./pendulum.js";
import { start as startParticle, stop as stopParticle } from "./particle.js";
import { start as startLogo, stop as stopLogo } from "./logo.js";

const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const viewButton = document.getElementById("view");
const closeButton = document.getElementById("close");
const view = document.querySelector(".view");

const things = [
  {
    name: "Optical Illusion",
    start: startChaksi,
    stop: stopChaksi,
  },
  {
    name: "Pendulum wave",
    start: startPendulum,
    stop: stopPendulum,
	},
  {
    name: "Connecting particles",
    start: startParticle,
    stop: stopParticle,
  },
  {
    name: "Logo animation",
    start: startLogo,
    stop: stopLogo,
  }
];
let currentIndex = 0;
let currentThing = things[currentIndex];

document.querySelector(".thing-name").innerText = currentThing.name;

nextButton.addEventListener("click", () => changeCurrentThing(currentIndex + 1));
previousButton.addEventListener("click", () => changeCurrentThing(currentIndex - 1));
viewButton.addEventListener("click", () => {
  currentThing.start();
  view.style.display = "block";
});
closeButton.addEventListener("click", () => {
  currentThing.stop();
  view.style.display = "none";
});

function changeCurrentThing(index) {
  currentIndex = index;

  if (currentIndex >= things.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = things.length - 1;
  }

  currentThing = things[currentIndex];

	document.querySelector(".thing").style.backgroundPosition = `${currentIndex * 100 / (things.length - 1)}% 0`;
  document.querySelector(".thing-name").innerText = currentThing.name;
}
