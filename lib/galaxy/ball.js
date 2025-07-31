import { degrees, makeHSL, map, random } from "./utils.js";

const MIN_THETA_SCALAR = 0.5;
const MAX_THETA_SCALAR = 1.5;
const MIN_BALL_DIAMETER = 5;
const MAX_BALL_DIAMETER = 20;
const MIN_X_ORBIT_SCALAR = 1;
const MAX_X_ORBIT_SCALAR = 1.75;
const MIN_Y_ORBIT_SCALAR = 0.8;
const MAX_Y_ORBIT_SCALAR = 1.2;

class Ball {
  constructor({
    fillColor,
    strokeColor,
    xOffset,
    yOffset,
    xOrbitScalar,
    yOrbitScalar,
    thetaOffset,
    thetaScalar,
  }) {
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.xOrbitScalar = xOrbitScalar;
    this.yOrbitScalar = yOrbitScalar;
    this.thetaOffset = thetaOffset;
    this.thetaScalar = thetaScalar;

    this.diameter = map(
      this.thetaScalar,
      MAX_THETA_SCALAR,
      MIN_THETA_SCALAR,
      MIN_BALL_DIAMETER,
      MAX_BALL_DIAMETER,
    );
  }

  render(ctx, theta, xFn, yFn, rot) {
    let x = xFn(this, theta);
    let y = yFn(this, theta);

    if (rot) {
      const rotation = rot(x, y);
      x = rotation.x;
      y = rotation.y;
    }

    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor ? this.strokeColor : "transparent";

    ctx.beginPath();
    ctx.arc(
      x + this.xOffset,
      y + this.yOffset,
      this.diameter / 2,
      0,
      2 * Math.PI,
    );
    ctx.fill();
    if (this.strokeColor) {
      ctx.stroke();
    }
  }
}

export function makeBall(population, i, canvasWidth, canvasHeight) {
  const xOffset = canvasWidth * 0.5;
  const yOffset = canvasHeight * 0.5;
  const xOrbitScalar = random(MIN_X_ORBIT_SCALAR, MAX_X_ORBIT_SCALAR);
  const yOrbitScalar = random(MIN_Y_ORBIT_SCALAR, MAX_Y_ORBIT_SCALAR);
  const thetaOffset = (2 * Math.PI * i) / population;
  const thetaScalar = random(MIN_THETA_SCALAR, MAX_THETA_SCALAR);
  const fillColor = makeHSL(Math.floor(degrees(thetaOffset)));

  return new Ball({
    fillColor,
    xOffset,
    yOffset,
    xOrbitScalar,
    yOrbitScalar,
    thetaOffset,
    thetaScalar,
  });
}
