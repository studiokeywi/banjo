/**
 * 3D matrix math utilities
 *
 * @module math/m3
 * @author studioKeywi */

import type { Vector2 } from '#🪕/math/v2';
import { vector2 } from '#🪕/math/v2';

export function inverse(matrix: Matrix3, out: Matrix3 = matrix3()): Matrix3 {
  const { m00, m01, m02, m10, m11, m12, m20, m21, m22 } = matrix;
  const b01 = m22 * m11 - m12 * m21;
  const b11 = -m22 * m10 + m12 * m20;
  const b21 = m21 * m10 - m11 * m20;
  const invDet = 1.0 / (m00 * b01 + m01 * b11 + m02 * b21);
  out[0] = b01 * invDet;
  out[1] = (-m22 * m01 + m02 * m21) * invDet;
  out[2] = (m12 * m01 - m02 * m11) * invDet;
  out[3] = b11 * invDet;
  out[4] = (m22 * m00 - m02 * m20) * invDet;
  out[5] = (-m12 * m00 + m02 * m10) * invDet;
  out[6] = b21 * invDet;
  out[7] = (-m21 * m00 + m01 * m20) * invDet;
  out[8] = (m11 * m00 - m01 * m10) * invDet;
  return out;
}

export function matrix3(): Matrix3<0, 0, 0, 0, 0, 0, 0, 0, 0>;
export function matrix3<
  M00 extends number,
  M01 extends number,
  M02 extends number,
  M10 extends number,
  M11 extends number,
  M12 extends number,
  M20 extends number,
  M21 extends number,
  M22 extends number,
>(matrix: Matrix3<M00, M01, M02, M10, M11, M12, M20, M21, M22>): Matrix3<M00, M01, M02, M10, M11, M12, M20, M21, M22>;
export function matrix3<
  M00 extends number,
  M01 extends number,
  M02 extends number,
  M10 extends number,
  M11 extends number,
  M12 extends number,
  M20 extends number,
  M21 extends number,
  M22 extends number,
>(m00: M00, m01: M01, m02: M02, m10: M10, m11: M11, m12: M12, m20: M20, m21: M21, m22: M22): Matrix3<M00, M01, M02, M10, M11, M12, M20, M21, M22>;
export function matrix3<
  M00 extends number,
  M01 extends number,
  M02 extends number,
  M10 extends number,
  M11 extends number,
  M12 extends number,
  M20 extends number,
  M21 extends number,
  M22 extends number,
>(
  ...src:
    | []
    | [Matrix3<M00, M01, M02, M10, M11, M12, M20, M21, M22>]
    | [m00: M00, m01: M01, m02: M02, m10: M10, m11: M11, m12: M12, m20: M20, m21: M21, m22: M22]
): Matrix3<M00, M01, M02, M10, M11, M12, M20, M21, M22> {
  const matrix =
    typeof src[0] === 'object' ? new Float64Array(src[0]) : src.every(val => typeof val === 'number') ? new Float64Array(src) : new Float64Array(9);

  return Object.defineProperties(matrix, {
    m00: {
      get(this: Float64Array) {
        return this[0];
      },
    },
    m01: {
      get(this: Float64Array) {
        return this[1];
      },
    },
    m02: {
      get(this: Float64Array) {
        return this[2];
      },
    },
    m10: {
      get(this: Float64Array) {
        return this[3];
      },
    },
    m11: {
      get(this: Float64Array) {
        return this[4];
      },
    },
    m12: {
      get(this: Float64Array) {
        return this[5];
      },
    },
    m20: {
      get(this: Float64Array) {
        return this[6];
      },
    },
    m21: {
      get(this: Float64Array) {
        return this[7];
      },
    },
    m22: {
      get(this: Float64Array) {
        return this[8];
      },
    },
  }) as Matrix3<M00, M01, M02, M10, M11, M12, M20, M21, M22>;
}

export function multiply(left: Matrix3, right: Matrix3, out: Matrix3 = matrix3()): Matrix3 {
  const { 0: a00, 1: a01, 2: a02, 3: a10, 4: a11, 5: a12, 6: a20, 7: a21, 8: a22 } = left;
  const { 0: b00, 1: b01, 2: b02, 3: b10, 4: b11, 5: b12, 6: b20, 7: b21, 8: b22 } = right;
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}

export function pipe(...pipeline: ((matrix: Matrix3) => Matrix3)[]): (matrix: Matrix3) => Matrix3 {
  return function (matrix: Matrix3): Matrix3 {
    return pipeline.reduce(function (lastMatrix, fn) {
      return fn(lastMatrix);
    }, matrix);
  };
}

export function printMatrix(matrix: Matrix3): void {
  console.log(
    '[[%o %o %o]\n [%o %o %o]\n [%o %o %o]]',
    matrix.m00,
    matrix.m01,
    matrix.m02,
    matrix.m10,
    matrix.m11,
    matrix.m12,
    matrix.m20,
    matrix.m21,
    matrix.m22
  );
}

export function project(matrix: Matrix3, vector: Vector2, out?: Matrix3): Matrix3;
export function project(matrix: Matrix3, width: number, height: number, out?: Matrix3): Matrix3;
export function project(
  ...[arg1, arg2, arg3, arg4]: [matrix: Matrix3, vector: Vector2, out?: Matrix3] | [matrix: Matrix3, width: number, height: number, out?: Matrix3]
): Matrix3 {
  if (typeof arg2 === 'object' && typeof arg3 !== 'number') return multiply(arg1, projection(arg2), arg3 ?? matrix3());
  if (typeof arg2 === 'number' && typeof arg3 === 'number') return multiply(arg1, projection(arg2, arg3), arg4 ?? matrix3());

  throw new Error("Invalid arguments provided to 'project'");
}

export function projection(vector: Vector2, out?: Matrix3): Matrix3;
export function projection(width: number, height: number, out?: Matrix3): Matrix3;
export function projection(vecOrWidth: Vector2 | number, outOrHeight: Matrix3 | undefined | number, out: Matrix3 = matrix3()): Matrix3 {
  let x: number | null = null;
  let y: number | null = null;
  if (typeof vecOrWidth === 'number' && typeof outOrHeight === 'number') {
    x = vecOrWidth;
    y = outOrHeight;
  } else if (typeof vecOrWidth === 'object') ({ x, y } = vecOrWidth);
  if (x === null || y === null) throw new Error("Invalid arguments provided to 'projection'");
  if (typeof outOrHeight === 'object') out = outOrHeight;
  out[0] = 2 / x;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -2 / y;
  out[5] = 0;
  out[6] = -1;
  out[7] = 1;
  out[8] = 1;
  return out;
}

export function rotate(matrix: Matrix3, angleRads: number, out: Matrix3 = matrix3()): Matrix3 {
  return multiply(matrix, rotation(angleRads), out);
}

export function rotation(angleRads: number, out: Matrix3 = matrix3()) {
  const cos = Math.cos(angleRads);
  const sin = Math.sin(angleRads);
  out[0] = cos;
  out[1] = -sin;
  out[2] = 0;
  out[3] = sin;
  out[4] = cos;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

export function scale(matrix: Matrix3, scaleBy: Vector2, out?: Matrix3): Matrix3;
export function scale(matrix: Matrix3, scaleX: number, scaleY: number, out?: Matrix3): Matrix3;
export function scale(
  ...[arg1, arg2, arg3, arg4]: [matrix: Matrix3, vector: Vector2, out?: Matrix3] | [matrix: Matrix3, width: number, height: number, out?: Matrix3]
): Matrix3 {
  if (typeof arg2 === 'object' && typeof arg3 !== 'number') return multiply(arg1, scaling(arg2), arg3 ?? matrix3());
  if (typeof arg2 === 'number' && typeof arg3 === 'number') return multiply(arg1, scaling(arg2, arg3), arg4 ?? matrix3());

  throw new Error("Invalid arguments provided to 'scale'");
}

export function scaling<X extends number, Y extends number>(scaleBy: Vector2<X, Y>, out?: Matrix3): Matrix3<X, 0, 0, 0, Y, 0, 0, 0, 1>;
export function scaling<X extends number, Y extends number>(scaleX: X, scaleY: Y, out?: Matrix3): Matrix3<X, 0, 0, 0, Y, 0, 0, 0, 1>;
export function scaling<X extends number, Y extends number>(
  scaleByOrX: Vector2<X, Y> | X,
  outOrScaleY: Matrix3 | undefined | Y,
  out: Matrix3 = matrix3()
): Matrix3<X, 0, 0, 0, Y, 0, 0, 0, 1> {
  let x: number | null = null;
  let y: number | null = null;
  if (typeof scaleByOrX === 'number' && typeof outOrScaleY === 'number') {
    x = scaleByOrX;
    y = outOrScaleY;
  } else if (typeof scaleByOrX === 'object') ({ x, y } = scaleByOrX);
  if (x === null || y === null) throw new Error("Invalid arguments provided to 'scaling'");
  if (typeof outOrScaleY === 'object') out = outOrScaleY;
  out[0] = x;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = y;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out as Matrix3<X, 0, 0, 0, Y, 0, 0, 0, 1>;
}

export function transformPoint(matrix: Matrix3, vec: Vector2): Vector2 {
  const { m00, m01, m02, m10, m11, m12, m20, m21, m22 } = matrix;
  const { x, y } = vec;
  const d = x * m02 + y * m12 + m22;
  return vector2((x * m00 + y * m10 + m20) / d, (x * m01 + y * m11 + m21) / d);
}

export function translate(matrix: Matrix3, translateBy: Vector2, out?: Matrix3): Matrix3;
export function translate(matrix: Matrix3, translateX: number, translateY: number, out?: Matrix3): Matrix3;
export function translate(
  ...[arg1, arg2, arg3, arg4]: [matrix: Matrix3, vector: Vector2, out?: Matrix3] | [matrix: Matrix3, width: number, height: number, out?: Matrix3]
): Matrix3 {
  if (typeof arg2 === 'object' && typeof arg3 !== 'number') return multiply(arg1, translation(arg2), arg3 ?? matrix3());
  if (typeof arg2 === 'number' && typeof arg3 === 'number') return multiply(arg1, translation(arg2, arg3), arg4 ?? matrix3());

  throw new Error("Invalid arguments provided to 'translate'");
}
export function translation<X extends number, Y extends number>(translateBy: Vector2<X, Y>, out?: Matrix3): Matrix3<1, 0, 0, 0, -1, 0, X, Y, 1>;
export function translation<X extends number, Y extends number>(translateX: X, translateY: Y, out?: Matrix3): Matrix3<1, 0, 0, 0, -1, 0, X, Y, 1>;
export function translation<X extends number, Y extends number>(
  translateByOrX: Vector2<X, Y> | X,
  outOrTranslateY: Matrix3 | undefined | Y,
  out: Matrix3 = matrix3()
): Matrix3<1, 0, 0, 0, -1, 0, X, Y, 1> {
  let x: number | null = null;
  let y: number | null = null;
  if (typeof translateByOrX === 'number' && typeof outOrTranslateY === 'number') {
    x = translateByOrX;
    y = outOrTranslateY;
  } else if (typeof translateByOrX === 'object') ({ x, y } = translateByOrX);
  if (x === null || y === null) throw new Error("Invalid arguments provided to 'translation'");
  if (typeof outOrTranslateY === 'object') out = outOrTranslateY;
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -1;
  out[5] = 0;
  out[6] = x;
  out[7] = y;
  out[8] = 1;
  return out as Matrix3<1, 0, 0, 0, -1, 0, X, Y, 1>;
}

export const identity = matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
export const one = matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
export const zero = matrix3();

export type Matrix3<
  M00 extends number = number,
  M01 extends number = number,
  M02 extends number = number,
  M10 extends number = number,
  M11 extends number = number,
  M12 extends number = number,
  M20 extends number = number,
  M21 extends number = number,
  M22 extends number = number,
> = Float64Array &
  [m00: M00, m01: M01, m02: M02, m10: M10, m11: M11, m12: M12, m20: M20, m21: M21, m22: M22] & {
    m00: M00;
    m01: M01;
    m02: M02;
    m10: M10;
    m11: M11;
    m12: M12;
    m20: M20;
    m21: M21;
    m22: M22;
  };
