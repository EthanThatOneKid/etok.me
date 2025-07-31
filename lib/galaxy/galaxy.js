import { makeBall } from "./ball.js";

const GALACTIC_AMPLITUDE = 100;
const GALACTIC_SHIFT = 125;

class Galaxy {
  constructor(
    { population, makeBall, xFn, yFn, rot, canvasWidth, canvasHeight },
  ) {
    this.population = population;
    this.makeBall = makeBall;
    this.xFn = xFn;
    this.yFn = yFn;
    this.rot = rot;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.balls = [];
    this.theta = 0;
  }

  render(ctx, delta) {
    this.theta += delta;
    for (const ball of this.balls) {
      ball.render(ctx, this.theta, this.xFn, this.yFn, this.rot);
    }
  }

  populate() {
    this.balls = [];
    for (let i = 0; i < this.population; i++) {
      const ball = this.makeBall(
        this.population,
        i,
        this.canvasWidth,
        this.canvasHeight,
      );
      this.balls.push(ball);
    }
  }
}

function xFn(ball, theta) {
  return (
    Math.cos(theta * ball.thetaScalar + ball.thetaOffset) *
    GALACTIC_AMPLITUDE *
    ball.xOrbitScalar
  );
}

function yFn(ball, theta) {
  return (
    Math.sin(theta * ball.thetaScalar + ball.thetaOffset) *
    GALACTIC_AMPLITUDE *
    ball.yOrbitScalar
  );
}

function rot(x, y) {
  const t = GALACTIC_SHIFT;
  return {
    x: x * Math.cos(t) - y * Math.sin(t),
    y: x * Math.sin(t) + y * Math.cos(t),
  };
}

export function makeGalaxy({ population = 100, canvasWidth, canvasHeight }) {
  return new Galaxy({
    population,
    makeBall,
    xFn,
    yFn,
    rot,
    canvasWidth,
    canvasHeight,
  });
}
