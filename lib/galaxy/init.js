import { makeGalaxy } from "./galaxy.js";

globalThis.addEventListener("load", () => {
  const canvas = document.getElementById("galaxyCanvas");
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }
  const ctx = canvas.getContext("2d");

  const POPULATION = 100;
  const ANIMATION_SPEED = 0.6;

  let GALAXY;
  let lastFrameTime = performance.now();

  function resetGalaxy() {
    GALAXY = makeGalaxy({
      population: POPULATION,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });
    GALAXY.populate();
    lastFrameTime = performance.now();
  }

  function animationLoop(currentTime) {
    const elapsedTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (GALAXY) {
      GALAXY.render(ctx, elapsedTime * ANIMATION_SPEED);
    }

    requestAnimationFrame(animationLoop);
  }

  canvas.addEventListener("click", () => {
    console.log("Canvas clicked. Resetting galaxy.");
    resetGalaxy();
  });

  resetGalaxy();
  requestAnimationFrame(animationLoop);
});
