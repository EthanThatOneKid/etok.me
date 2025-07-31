/**
 * Re-maps a number from one range to another.
 */
export function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

/**
 * Generates a random number between a min and max value.
 */
export function random(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

/**
 * Converts an angle from radians to degrees.
 */
export function degrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Creates an HSL color string.
 */
export function makeHSL(p) {
  return `hsl(${p}, 100%, 50%)`;
}
