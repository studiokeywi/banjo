/**
 * 2D vector math utilities
 *
 * @module math/v2
 * @author studioKeywi
 */

import { epsilon } from '#🪕/math/constants';
import type { clamp } from '#🪕/math/conversions'; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { lerp } from '#🪕/math/easing'; // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Adds two {@link Vector2|vectors} together by adding their respective components
 *
 * @param {Vector2} left Left operand
 * @param {Vector2} right Right operand
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The result of addition */
export function add(left: Vector2, right: Vector2, out?: Vector2): Vector2;
/**
 * Adds a single value to both components of a {@link Vector2|vector}
 *
 * @param {Vector2} vector Vector in question
 * @param {Vector2} scalar Scalar value
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The result of addition */
export function add(vector: Vector2, scalar: number, out?: Vector2): Vector2; // eslint-disable-line @typescript-eslint/unified-signatures
export function add(vector: Vector2, rightOrScalar: number | Vector2, out: Vector2 = vector2()): Vector2 {
  if (typeof rightOrScalar === 'number') {
    out[0] = vector[0] + rightOrScalar;
    out[1] = vector[1] + rightOrScalar;
  } else {
    out[0] = vector[0] + rightOrScalar[0];
    out[1] = vector[1] + rightOrScalar[1];
  }
  return out;
}

/**
 * Calculates the angle (in radians) between two provided {@link Vector2|vectors}
 *
 * @param {Vector2} left Left operand
 * @param {Vector2} right Right operand
 * @returns {number} The angle (in radians) */
export const angleBetween = (left: Vector2, right: Vector2): number => {
  return Math.acos(dot(left, right));
};

/**
 * Calculates the distance between two provided {@link Vector2|vectors} by calculating the effective hypotenuse between them
 *
 * @param {Vector2} from Left operand
 * @param {Vector2} to Right operand
 * @returns {number} The linear distance */
export const distance = (from: Vector2, to: Vector2): number => {
  return Math.hypot(from[0] - to[0], from[1] - to[1]);
};

/**
 * Calculates the squared distance between two provided {@link Vector2|vectors} by calculating the effective hypotenuse between them
 *
 * @param {Vector2} from Left operand
 * @param {Vector2} to Right operand
 * @returns {number} The linear distance */
export const distanceSq = (from: Vector2, to: Vector2): number => {
  return (from[0] - to[0]) ** 2 + (from[1] - to[1]) ** 2;
};

/**
 * Calculates the dot product of two provided {@link Vector2|vectors}, which is a value representing the similarity of the two
 *
 * @param {Vector2} left Left operand
 * @param {Vector2} right Right operand
 * @returns {number} The calculated dot product */
export const dot = (left: Vector2, right: Vector2): number => {
  return left[0] * right[0] + left[1] * right[1];
};

/**
 * Hashes a given {@link Vector2|vector's} coordinates using a negative-integer friendly version of the Szudzik pairing function
 *
 * **NOTE**: This function requires integers to guarantee uniqueness
 * @param {Vector2} vector Vector to hash
 * @returns {number} Unique hashed integer value*/
export const hash = (vector: Vector2): number => {
  const x = vector[0];
  const y = vector[1];
  const Q = x >= 0 ? 2 * x : -2 * x - 1;
  const R = y >= 0 ? 2 * y : -2 * y - 1;
  return Q >= R ? Q ** 2 + Q + R : R ** 2 + Q;
};

/**
 * Calculates the magnitude of the {@link Vector2|vector} provided by calculating its effective hypotenuse
 *
 * @param {Vector2} vector Vector in question
 * @returns {number} The vector's magnitude */
export const length = (vector: Vector2): number => {
  return Math.hypot(vector[0], vector[1]);
};

/**
 * Calculates a {@link lerp|linear interpolation} between two vectors based on some "transition point" `t`. Will {@link clamp} the value of `t` to [0, 1]
 *
 * @param {Vector2} a First vector
 * @param {Vector2} b Second vector
 * @param {number} t Transition point
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns The linearly interpolated vector */
export const lerpVectors = (a: Vector2, b: Vector2, t: number, out: Vector2 = vector2()): Vector2 => {
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  out[0] = a[0] + t * (b[0] - a[0]);
  out[1] = a[1] + t * (b[1] - a[1]);
  return out;
};

/**
 * Calculates a {@link lerp|linear interpolation} between two vectors based on some "transition point" `t`
 *
 * @param {Vector2} a First vector
 * @param {Vector2} b Second vector
 * @param {number} t Transition point
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns The linearly interpolated vector */
export const lerpVectorsUnclamped = (a: Vector2, b: Vector2, t: number, out: Vector2 = vector2()): Vector2 => {
  out[0] = a[0] + t * (b[0] - a[0]);
  out[1] = a[1] + t * (b[1] - a[1]);
  return out;
};

/**
 * Calculates the squared magnitude of the {@link Vector2|vector} provided by calculating its effective hypotenuse
 *
 * @param {Vector2} vector Vector in question
 * @returns {number} The vector's squared magnitude */
export const lengthSq = (vector: Vector2): number => {
  return vector[0] ** 2 + vector[1] ** 2;
};

/**
 * Calculates the equivalent of a {@link Vector2|vector} whose magnitude is 1
 *
 * @param {Vector2} vector Vector in question
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The normalized vector */
export const normalize = (vector: Vector2, out: Vector2 = vector2()): Vector2 => {
  const len = length(vector);
  if (len <= epsilon) {
    out[0] = out[1] = 0;
  } else if (len > 0) {
    out[0] = vector[0] / len;
    out[1] = vector[1] / len;
  }
  return out;
};

/**
 * Calculates the projection of one {@link normalize|normalized} {@link Vector2|vector} against another
 *
 * @param {Vector2} target Left operand
 * @param {Vector2} destination Right operand
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The projected vector */
export const normProject = (target: Vector2, destination: Vector2, out: Vector2 = vector2()): Vector2 => {
  const factor = dot(target, destination);
  return scale(destination, factor, out);
};

/**
 * Calculates the reflection of one {@link normalize|normalized} {@link Vector2|vector} against an axis
 *
 * @param {Vector2} incoming Left operand
 * @param {Vector2} axis Right operand
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The reflected vector */
export const normReflect = (incoming: Vector2, axis: Vector2, out: Vector2 = vector2()): Vector2 => {
  const projected = normProject(incoming, axis, out);
  const scaled = scale(projected, 2, out);
  return subtract(scaled, incoming, out);
};

/**
 * Calculates a perpendicular {@link Vector2|vector}. Equivalent to the vector rotated 90 degrees counter-clockwise
 *
 * @param {Vector2} vector Vector in question
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The perpendicular vector */
export const perpendicular = (vector: Vector2, out: Vector2 = vector2()): Vector2 => {
  [out[0], out[1]] = [vector[1], -vector[0]];
  return out;
};

/**
 * Calculates the projection of one {@link Vector2|vector} against another
 *
 * @param {Vector2} target Left operand
 * @param {Vector2} destination Right operand
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The projected vector */
export const project = (target: Vector2, destination: Vector2, out: Vector2 = vector2()): Vector2 => {
  const factor = dot(target, destination) / lengthSq(destination);
  return scale(destination, factor, out);
};

/**
 * Calculates the reflection of one {@link Vector2|vector} against an axis
 *
 * @param {Vector2} incoming Left operand
 * @param {Vector2} axis Right operand
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The reflected vector */
export const reflect = (incoming: Vector2, axis: Vector2, out: Vector2 = vector2()): Vector2 => {
  const projected = project(incoming, axis, out);
  const scaled = scale(projected, 2, out);
  return subtract(scaled, incoming, out);
};

/**
 * Calculates the reverse of a {@link Vector2|vector}. Equivalent to the vector rotated 180 degrees counter-clockwise
 *
 * @param {Vector2} vector Vector in question
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The reversed vector */
export const reverse = (vector: Vector2, out: Vector2 = vector2()): Vector2 => {
  return scale(vector, -1, out);
};

/**
 * Calculates the rotation of a {@link Vector2|vector} by a given angle (in radians)
 *
 * @param {Vector2} vector Vector in question
 * @param {number} radians Rotation amount
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The rotated vector */
export const rotate = (vector: Vector2, radians: number, out: Vector2 = vector2()): Vector2 => {
  radians = -radians; // NOTE: we invert the angle to ensure that the rotation makes sense in quadrant IV space
  const x = vector[0];
  const y = vector[1];
  out[0] = x * Math.cos(radians) - y * Math.sin(radians);
  out[1] = x * Math.sin(radians) + y * Math.cos(radians);
  if (Math.abs(out[0]) <= epsilon) {
    out[0] = 0;
  }
  if (Math.abs(out[1]) <= epsilon) {
    out[1] = 0;
  }
  return out;
};

/**
 * Calculates the scaled version of a {@link Vector2|vector}
 *
 * @param {Vector2} vector Vector in question
 * @param {number} scale Factor by which each component of the vector will be scaled
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The scaled vector */
export function scale(vector: Vector2, scale: number, out?: Vector2): Vector2;
/**
 * Calculates the scaled version of a {@link Vector2|vector}
 *
 * @param {Vector2} vector Vector in question
 * @param {number} scaleX Factor by which the x component of the vector will be scaled
 * @param {number} scaleY Factor by which the y component of the vector will be scaled
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The scaled vector */
export function scale(vector: Vector2, scaleX: number, scaleY: number, out?: Vector2): Vector2;
export function scale(vector: Vector2, scaleOrScaleX: number, scaleYOrOut?: number | Vector2, out?: Vector2): Vector2 {
  if (typeof scaleYOrOut === 'number') {
    out ??= vector2();
    out[0] = vector[0] * scaleOrScaleX;
    out[1] = vector[1] * scaleYOrOut;
    return out;
  }
  scaleYOrOut ??= vector2();
  scaleYOrOut[0] = vector[0] * scaleOrScaleX;
  scaleYOrOut[1] = vector[1] * scaleOrScaleX;
  return scaleYOrOut;
}

/**
 * Subtracts two {@link Vector2|vectors} together by subtracting their respective components
 *
 * @param {Vector2} left Left operand
 * @param {Vector2} right Right operand
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The result of subtraction */
export function subtract(left: Vector2, right: Vector2, out?: Vector2): Vector2;
/**
 * Subtracts a single value to both components of a {@link Vector2|vector}
 *
 * @param {Vector2} vector Vector in question
 * @param {Vector2} scalar Scalar value
 * @param {Vector2} [out] Optional {@link Vector2|vector} to store the output (can be used to inject results into an existing vector)
 * @returns {Vector2} The result of subtraction */
export function subtract(vector: Vector2, scalar: number, out?: Vector2): Vector2; // eslint-disable-line @typescript-eslint/unified-signatures
export function subtract(vector: Vector2, rightOrScalar: number | Vector2, out: Vector2 = vector2()): Vector2 {
  if (typeof rightOrScalar === 'number') {
    out[0] = vector[0] - rightOrScalar;
    out[1] = vector[1] - rightOrScalar;
  } else {
    out[0] = vector[0] - rightOrScalar[0];
    out[1] = vector[1] - rightOrScalar[1];
  }
  return out;
}

/**
 * Additional accessors defined over the {@link Float64Array} shape of a {@link Vector2}
 *
 * @internal */ // prettier-ignore
const vector2API = {
  /** Value of the X coordinate */ x: { get() { return this[0]; }, set(val: number) { this[0] = val; }, enumerable: true },
  /** Value of the Y coordinate */ y: { get() { return this[1]; }, set(val: number) { this[1] = val; }, enumerable: true },
} as const satisfies PropertyDescriptorMap & ThisType<Float64Array>;

/**
 * Create a new {@link Vector2|vector} set with values of `[0, 0]`
 *
 * @returns {Vector2} The new vector */
export function vector2(): Vector2<0, 0>;
/**
 * Create a new {@link Vector2|vector} using an existing vector's values
 *
 * @returns {Vector2} The new vector */
export function vector2<X extends number, Y extends number>(vector: Vector2<X, Y>): Vector2<X, Y>;
/**
 * Create a new {@link Vector2|vector} using the provided values
 *
 * @returns {Vector2} The new vector */
export function vector2<X extends number, Y extends number>(x: X, y: Y): Vector2<X, Y>;
export function vector2<X extends number, Y extends number>(...[arg1, arg2]: [] | [vector: Vector2<X, Y>] | [x: X, y: Y]): Vector2<X, Y> {
  if (typeof arg1 === 'undefined') {
    return Object.defineProperties(new Float64Array(2), vector2API) as Vector2<X, Y>;
  } else if (arg1 === +arg1 && arg2 === +(arg2 as number)) {
    return Object.defineProperties(new Float64Array([arg1, arg2]), vector2API) as Vector2<X, Y>;
  } else if (arg1 instanceof Float64Array) {
    return Object.defineProperties(new Float64Array(arg1), vector2API) as Vector2<X, Y>;
  }
  throw new Error("Invalid arguments passed to 'vector2'");
}
Object.defineProperty(vector2, Symbol.hasInstance, {
  value: (idk: unknown) => idk instanceof Float64Array && idk.length === 2 && (idk as Vector2).x === idk[0] && (idk as Vector2).y === idk[1],
});

/**
 * Unit {@link Vector2|vector} (-1, -1)
 */
export const upLeft = () => vector2(-1, -1);
/**
 * Unit {@link Vector2|vector} (0, -1)
 */
export const up = () => vector2(0, -1);
/**
 * Unit {@link Vector2|vector} (1, -1)
 */
export const upRight = () => vector2(1, -1);

/**
 * Unit {@link Vector2|vector} (-1, 0)
 */
export const left = () => vector2(-1, 0);
/**
 * Unit {@link Vector2|vector} (0, 0)
 */
export const origin = () => vector2();
/**
 * Unit {@link Vector2|vector} (1, 0)
 */
export const right = () => vector2(1, 0);

/**
 * Unit {@link Vector2|vector} (-1, 1)
 */
export const downLeft = () => vector2(-1, 1);
/**
 * Unit {@link Vector2|vector} (0, 1)
 */
export const down = () => vector2(0, 1);
/**
 * Unit {@link Vector2|vector} (1, 1)
 */
export const downRight = () => vector2(1, 1);

/**
 * Unit {@link Vector2|vector} (0, 0)
 */
export const zero = () => vector2(0, 0);
/**
 * Unit {@link Vector2|vector} (1, 1)
 */
export const one = () => vector2(1, 1);

/**
 * 2-dimensional Vector object
 */
export type Vector2<X extends number = number, Y extends number = number> = Float64Array &
  [
    /**
     * Value of the X coordinate
     */
    x: X,
    /**
     * Value of the Y coordinate
     */
    y: Y,
  ] & {
    /**
     * Value of the X coordinate
     */
    x: X;
    /**
     * Value of the Y coordinate
     */
    y: Y;
  };
