// TODO: the buildRNG pattern is neat but uh... if we don't export it, do we need to use it to build
/**
 * Simple API wrapping around arbitrary pseudo-random number generation algorithms and their common utilizations (such as random integers and shuffling arrays)
 *
 * @module math/random
 * @author studioKeywi */

const createRNG = (algorithm: (seed: number) => Generator<number, never, void>, seed: number = (Math.random() * _2pow32) >>> 0) => {
  const rng = algorithm(seed).drop(12) as Generator<number, never, void>;

  const randFloat = () => rng.next().value / _2pow32;
  const randInt = (max?: number, inclusive = false) => (typeof max === 'undefined' ? rng.next().value : (randFloat() * ((max + +inclusive) | 0)) | 0);
  const randRange = (min: number, max: number, inclusive = false) => (randInt((max - min) | 0, inclusive) + min) | 0;

  return { randFloat, randInt, randRange };
};

const cyrb128 = (str: string) => {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  const charCodes = Buffer.from(str);
  let k: number;
  for (k of charCodes) {
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0] as [number, number, number, number];
};

function* $jsf32(a: number, b: number, c: number, d: number): Generator<number, never, void> {
  let t: number;
  while (true as boolean) {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    t = (a - ((b << 27) | (b >>> 5))) | 0;
    a = b ^ ((c << 17) | (c >>> 15));
    b = (c + d) | 0;
    c = (d + t) | 0;
    d = (a + t) | 0;
    yield d >>> 0;
  }
  throw new Error();
}
function* $mulberry32(a: number): Generator<number, never, void> {
  let t: number;
  while (true as boolean) {
    t = a += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    yield (t ^ (t >>> 14)) >>> 0;
  }
  throw new Error();
}
function* $native(): Generator<number, never, void> {
  while (true as boolean) {
    yield (Math.random() * _2pow32) >>> 0;
  }
  throw new Error();
}
function* $sfc32(a: number, b: number, c: number, d: number): Generator<number, never, void> {
  let t: number;
  while (true as boolean) {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    yield t >>> 0;
  }
  throw new Error();
}
function* $splitMix32(a: number): Generator<number, never, void> {
  let t: number;
  while (true as boolean) {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    yield (t = t ^ (t >>> 15)) >>> 0;
  }
  throw new Error();
}
function* $xoshiro128ss(a: number, b: number, c: number, d: number): Generator<number, never, void> {
  let r: number;
  let t: number;
  while (true as boolean) {
    t = b << 9;
    r = Math.imul(b, 5);
    r = Math.imul((r << 7) | (r >>> 25), 9);
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = (d << 11) | (d >>> 21);
    yield r >>> 0;
  }
  throw new Error();
}

export const jsf32 = (seed?: number): RNG => createRNG(seed => $jsf32(...cyrb128(seed.toString())), seed);
export const mulberry32 = (seed?: number): RNG => createRNG(seed => $mulberry32(seed), seed);
export const native = (): RNG => createRNG(() => $native());
export const sfc32 = (seed?: number): RNG => createRNG(seed => $sfc32(...cyrb128(seed.toString())), seed);
export const splitMix32 = (seed?: number): RNG => createRNG(seed => $splitMix32(seed), seed);
export const xoshiro132 = (seed?: number): RNG => createRNG(seed => $xoshiro128ss(...cyrb128(seed.toString())), seed);

/**
 * `2 ^ 32 === 4_294_967_296`
 *
 * @internal */
const _2pow32 = 4_294_967_296;

/**
 * Utility functions that make use of (pseudo-)random number generation
 */
export interface RNG {
  /**
   * Generates a new floating point value from [0, 1)
   *
   * @returns {number} The generated float */
  randFloat(): number;
  /**
   * Generates a new integer
   *
   * @param {number} [max] Maximum value to possibly generate
   * @param {boolean} [inclusive] Whether the maximum value should be included in possible results (default `false`)
   * @returns {number} The generated integer */
  randInt(max?: number, inclusive?: boolean): number;
  /**
   * Generates a new integer within [min, max) or [min, max]
   *
   * @param {number} min Minimum value to possibly generate
   * @param {number} max Maximum value to possible generate
   * @param {boolean} [inclusive] Whether the maximum value should be included in possible results (default `false`)
   * @returns {number} The generated integer */
  randRange(min: number, max: number, inclusive?: boolean): number;
}

/**
 * Shuffles an array. Mutates the original array
 *
 * @template Type The type of array to be shuffled
 * @param {Type[]} arr The array to shuffle
 * @param {RNG} rng The {@link RNG|random number generator} to utilize
 * @returns {Type[]} The shuffled array */
export const shuffle = <Type>(arr: Type[], rng: RNG): Type[] => {
  const { length } = arr;
  let idx: number;
  let tmp: Type;
  for (idx = length - 1; idx >= 0; idx--) {
    const swap = rng.randInt(idx);
    tmp = arr[idx];
    arr[idx] = arr[swap];
    arr[swap] = tmp;
  }
  return arr;
};
