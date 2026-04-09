/**
 * mathUtils.js
 * Pure, side-effect-free math functions.
 * No React imports. No store imports. No DOM access.
 * Safe to use in any context — components, hooks, workers.
 */

/**
 * Clamps a value to the [0, 1] range.
 * @param {number} value
 * @returns {number}
 */
export const clamp01 = (value) => Math.min(1, Math.max(0, value));

/**
 * Linear interpolation between two values.
 * @param {number} start
 * @param {number} end
 * @param {number} amount - Blend factor in [0, 1].
 * @returns {number}
 */
export const lerp = (start, end, amount) => start + (end - start) * amount;

/**
 * Reads a z_index from a timeline stop object.
 * Returns the fallback if the value is missing or non-finite.
 * @param {{ z_index?: unknown } | null | undefined} stop
 * @param {number} [fallback=0]
 * @returns {number}
 */
export const getZIndex = (stop, fallback = 0) => {
  const parsed = Number(stop?.z_index);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Computes the normalised scroll progress value [0, 1] for a given stop.
 * Maps each stop's z_index to a position along the scroll axis.
 *
 * @param {object} stop - Timeline stop object with a z_index field.
 * @param {number} index - Fallback ordinal index of the stop.
 * @param {number} maxZIndexMagnitude - Absolute maximum z_index in the dataset (> 0).
 * @returns {number} A value in [0, 1] representing where this stop sits in scroll-space.
 */
export const getStopScrollPosition = (stop, index, maxZIndexMagnitude) => {
  const safeMax = Math.abs(maxZIndexMagnitude) || 1;
  return Math.abs(getZIndex(stop, index)) / safeMax;
};

/**
 * Determines whether a timeline stop is the "active" one given the current
 * scroll progress and a proximity threshold.
 *
 * @param {number} scrollProgress - Current normalised scroll position [0, 1].
 * @param {number} stopScrollPosition - The stop's normalised scroll position [0, 1].
 * @param {number} [threshold=0.16] - Maximum distance at which a stop is considered active.
 * @returns {boolean}
 */
export const isStopActive = (scrollProgress, stopScrollPosition, threshold = 0.16) =>
  Math.abs(scrollProgress - stopScrollPosition) <= threshold;

/**
 * Finds the closest timeline stop to the current scroll progress.
 *
 * @param {Array<object>} stops - Sorted array of timeline stop objects.
 * @param {number} scrollProgress - Current normalised scroll position [0, 1].
 * @param {number} maxZIndexMagnitude - Absolute maximum z_index in the dataset.
 * @param {number} [threshold=0.16] - Proximity threshold for activation.
 * @returns {{ stop: object, stopProgress: number } | null}
 */
export const findActiveStop = (stops, scrollProgress, maxZIndexMagnitude, threshold = 0.16) => {
  if (!stops.length) return null;

  let bestMatch = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  stops.forEach((stop, index) => {
    const stopProgress = getStopScrollPosition(stop, index, maxZIndexMagnitude);
    const distance = Math.abs(scrollProgress - stopProgress);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = { stop, stopProgress };
    }
  });

  return bestMatch && bestDistance <= threshold ? bestMatch : null;
};

/**
 * Normalises a raw scroll progress value to 3 decimal places.
 * Prevents redundant Zustand updates for micro-movements.
 * @param {number} value
 * @returns {number}
 */
export const normalizeScrollProgress = (value) => {
  const clamped = clamp01(Number(value) || 0);
  return Math.round(clamped * 1000) / 1000;
};

/**
 * Computes scroll progress from the current DOM state.
 * Pure read — no side effects.
 * @returns {number} Normalised scroll progress in [0, 1].
 */
export const getScrollProgress = () => {
  const documentElement = document.documentElement;
  const scrollTop = window.scrollY || documentElement.scrollTop || 0;
  const scrollHeight = Math.max(
    documentElement.scrollHeight,
    document.body?.scrollHeight || 0,
  );
  const viewportHeight = window.innerHeight || documentElement.clientHeight || 1;
  const maxScroll = Math.max(scrollHeight - viewportHeight, 1);
  return clamp01(scrollTop / maxScroll);
};

/**
 * Generates an array of [x, y, z] Vector3 coordinates perfectly distributed
 * on a sphere using the Fibonacci spiral algorithm.
 *
 * @param {number} samples - Number of nodes
 * @param {number} radius - Radius of the sphere
 * @returns {Array<[number, number, number]>}
 */
export const generateFibonacciSphere = (samples = 10, radius = 1) => {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
    const r = Math.sqrt(1 - y * y); // radius at y

    const theta = phi * i; // golden angle increment

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    points.push([x * radius, y * radius, z * radius]);
  }

  return points;
};
