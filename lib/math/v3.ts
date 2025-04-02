/**
 * 3D vector math utilities
 *
 * @module math/v3
 * @author studioKeywi */

// TODO: verify completed implementations -- https://webgl2fundamentals.org/webgl/resources/m4.js
import { epsilon } from '#🪕/math/constants';

// TODO: refactors based on m3 -> m3/v2 split
export const addVectors = (left: Vector3, right: Vector3, out: Vector3 = vector3()) => {
  out[0] = left[0] + right[0];
  out[1] = left[1] + right[1];
  out[2] = left[2] + right[2];
  return out;
};

export const axisRotate = (matrix: Matrix4, axis: Vector3, angleInRads: number, out: Matrix4 = matrix4()) => {
  const [x, y, z] = scaleVector(axis, 1 / length(axis));
  const xSq = x ** 2;
  const ySq = y ** 2;
  const zSq = z ** 2;
  const cos = Math.cos(angleInRads);
  const sin = Math.sin(angleInRads);
  const oneMinusCos = 1 - cos;
  const r00 = xSq + (1 - xSq) * cos;
  const r01 = x * y * oneMinusCos + z * sin;
  const r02 = x * z * oneMinusCos - y * sin;
  const r10 = x * y * oneMinusCos - z * sin;
  const r11 = ySq + (1 - ySq) * cos;
  const r12 = y * z * oneMinusCos + x * sin;
  const r20 = x * z * oneMinusCos + y * sin;
  const r21 = y * z * oneMinusCos - x * sin;
  const r22 = zSq + (1 - zSq) * cos;
  const [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23] = matrix;
  out[0] = r00 * m00 + r01 * m10 + r02 * m20;
  out[1] = r00 * m01 + r01 * m11 + r02 * m21;
  out[2] = r00 * m02 + r01 * m12 + r02 * m22;
  out[3] = r00 * m03 + r01 * m13 + r02 * m23;
  out[4] = r10 * m00 + r11 * m10 + r12 * m20;
  out[5] = r10 * m01 + r11 * m11 + r12 * m21;
  out[6] = r10 * m02 + r11 * m12 + r12 * m22;
  out[7] = r10 * m03 + r11 * m13 + r12 * m23;
  out[8] = r20 * m00 + r21 * m10 + r22 * m20;
  out[9] = r20 * m01 + r21 * m11 + r22 * m21;
  out[10] = r20 * m02 + r21 * m12 + r22 * m22;
  out[11] = r20 * m03 + r21 * m13 + r22 * m23;
  if (matrix !== out) {
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
  }
  return out;
};

export const axisRotation = (axis: Vector3, angleInRads: number, out: Matrix4 = matrix4()) => {
  const [x, y, z] = scaleVector(axis, 1 / length(axis));
  const xSq = x ** 2;
  const ySq = y ** 2;
  const zSq = z ** 2;
  const cos = Math.cos(angleInRads);
  const sin = Math.sin(angleInRads);
  const oneMinusCos = 1 - cos;
  out[0] = xSq + (1 - xSq) * cos;
  out[1] = x * y * oneMinusCos + z * sin;
  out[2] = x * z * oneMinusCos - y * sin;
  out[3] = 0;
  out[4] = x * y * oneMinusCos - z * sin;
  out[5] = ySq + (1 - ySq) * cos;
  out[6] = y * z * oneMinusCos + x * sin;
  out[7] = 0;
  out[8] = x * z * oneMinusCos + y * sin;
  out[9] = y * z * oneMinusCos - x * sin;
  out[10] = zSq + (1 - zSq) * cos;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};

export const compose = (translation: Vector3, quaternion: Vector4, scale: Vector3, out: Matrix4 = matrix4()) => {
  const [x, y, z, w] = quaternion;
  const x2 = x + x;
  const y2 = y + y;
  const z2 = z + z;
  const xx = x * x2;
  const xy = x * y2;
  const xz = x * z2;
  const yy = y * y2;
  const yz = y * z2;
  const zz = z * z2;
  const wx = w * x2;
  const wy = w * y2;
  const wz = w * z2;
  const [sx, sy, sz] = scale;
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = translation[0];
  out[13] = translation[1];
  out[14] = translation[2];
  out[15] = 1;
  return out;
};

export const copy = (src: Matrix4, out: Matrix4 = matrix4()) => {
  out[0] = src[0];
  out[1] = src[1];
  out[2] = src[2];
  out[3] = src[3];
  out[4] = src[4];
  out[5] = src[5];
  out[6] = src[6];
  out[7] = src[7];
  out[8] = src[8];
  out[9] = src[9];
  out[10] = src[10];
  out[11] = src[11];
  out[12] = src[12];
  out[13] = src[13];
  out[14] = src[14];
  out[15] = src[15];
  return out;
};

export const cross = (left: Vector3, right: Vector3, out: Vector3 = vector3()) => {
  out[0] = left[1] * right[2] - left[2] * right[1];
  out[1] = left[2] * right[0] - left[0] * right[2];
  out[2] = left[0] * right[1] - left[1] * right[0];
  return out;
};

export const decompose = (mat: Matrix4, translation: Vector3, quaternion: Matrix4, scale: Vector3) => {
  let sx = length(vector3(...mat.slice(0, 3)));
  const sy = length(vector3(...mat.slice(4, 7)));
  const sz = length(vector3(...mat.slice(8, 11)));
  const det = determinate(mat);
  if (det < 0) {
    sx = -sx;
  }
  translation[0] = mat[12];
  translation[1] = mat[13];
  translation[2] = mat[14];
  const matrix = copy(mat);
  const invSX = 1 / sx;
  const invSY = 1 / sy;
  const invSZ = 1 / sz;
  matrix[0] *= invSX;
  matrix[1] *= invSX;
  matrix[2] *= invSX;
  matrix[4] *= invSY;
  matrix[5] *= invSY;
  matrix[6] *= invSY;
  matrix[8] *= invSZ;
  matrix[9] *= invSZ;
  matrix[10] *= invSZ;
  quatFromRotationMatrix(matrix, quaternion);
  scale[0] = sx;
  scale[1] = sy;
  scale[2] = sz;
};

export const determinate = (m: Matrix4) => {
  const [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33] = m;
  const tmp_0 = m22 * m33;
  const tmp_1 = m32 * m23;
  const tmp_2 = m12 * m33;
  const tmp_3 = m32 * m13;
  const tmp_4 = m12 * m23;
  const tmp_5 = m22 * m13;
  const tmp_6 = m02 * m33;
  const tmp_7 = m32 * m03;
  const tmp_8 = m02 * m23;
  const tmp_9 = m22 * m03;
  const tmp_10 = m02 * m13;
  const tmp_11 = m12 * m03;
  const t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  const t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  const t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  const t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  return 1 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
};

export const distance = (left: Vector3, right: Vector3) => Math.sqrt(distanceSq(left, right));

export const distanceSq = (left: Vector3, right: Vector3) => {
  const [dx, dy, dz] = subtractVectors(left, right);
  return dx ** 2 + dy ** 2 + dz ** 2;
};

export const frustum = (left: number, right: number, bottom: number, top: number, near: number, far: number, out: Matrix4 = matrix4()) => {
  const dx = right - left;
  const dy = top - bottom;
  const dz = far - near;
  out[0] = (2 * near) / dx;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = (2 * near) / dy;
  out[6] = 0;
  out[7] = 0;
  out[8] = (left + right) / dx;
  out[9] = (top + bottom) / dy;
  out[10] = -(far + near) / dz;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (-2 * near * far) / dz;
  out[15] = 0;
  return out;
};

export const dot = (left: Vector3, right: Vector3) => left[0] * right[0] + left[1] * right[1] + left[2] * right[2];

export const identity = (out: Matrix4 = matrix4()) => {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};

export const inverse = (matrix: Matrix4, dst: Matrix4 = matrix4()) => {
  const [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33] = matrix;
  const tmp_0 = m22 * m33;
  const tmp_1 = m32 * m23;
  const tmp_2 = m12 * m33;
  const tmp_3 = m32 * m13;
  const tmp_4 = m12 * m23;
  const tmp_5 = m22 * m13;
  const tmp_6 = m02 * m33;
  const tmp_7 = m32 * m03;
  const tmp_8 = m02 * m23;
  const tmp_9 = m22 * m03;
  const tmp_10 = m02 * m13;
  const tmp_11 = m12 * m03;
  const tmp_12 = m20 * m31;
  const tmp_13 = m30 * m21;
  const tmp_14 = m10 * m31;
  const tmp_15 = m30 * m11;
  const tmp_16 = m10 * m21;
  const tmp_17 = m20 * m11;
  const tmp_18 = m00 * m31;
  const tmp_19 = m30 * m01;
  const tmp_20 = m00 * m21;
  const tmp_21 = m20 * m01;
  const tmp_22 = m00 * m11;
  const tmp_23 = m10 * m01;
  const t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  const t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  const t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  const t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  const d = determinate(matrix);
  dst[0] = d * t0;
  dst[1] = d * t1;
  dst[2] = d * t2;
  dst[3] = d * t3;
  dst[4] = d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  dst[5] = d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  dst[6] = d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  dst[7] = d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  dst[8] = d * (tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33 - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  dst[9] = d * (tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33 - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  dst[10] = d * (tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33 - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  dst[11] = d * (tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23 - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  dst[12] = d * (tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12 - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  dst[13] = d * (tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22 - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  dst[14] = d * (tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02 - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  dst[15] = d * (tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12 - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  return dst;
};

export const length = (vector: Vector3) => Math.sqrt(lengthSq(vector));

export const lengthSq = (vector: Vector3) => vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2;

export const lookAt = (camPos: Vector3, target: Vector3, up: Vector3, out: Matrix4 = matrix4()) => {
  const zAxis = normalize(subtractVectors(camPos, target));
  const xAxis = normalize(cross(up, zAxis));
  const yAxis = normalize(cross(zAxis, xAxis));
  out[0] = xAxis[0];
  out[1] = xAxis[1];
  out[2] = xAxis[2];
  out[3] = 0;
  out[4] = yAxis[0];
  out[5] = yAxis[1];
  out[6] = yAxis[2];
  out[7] = 0;
  out[8] = zAxis[0];
  out[9] = zAxis[1];
  out[10] = zAxis[2];
  out[11] = 0;
  out[12] = camPos[0];
  out[13] = camPos[1];
  out[14] = camPos[2];
  out[15] = 1;
  return out;
};

export const matrix4 = (...src: Matrix4 | number[]) => {
  const matrix = src.length ? new Float64Array(src) : new Float64Array(16);
  return Object.assign(matrix, {
    get m00() {
      return matrix[0];
    },
    get m01() {
      return matrix[1];
    },
    get m02() {
      return matrix[2];
    },
    get m03() {
      return matrix[3];
    },
    get m10() {
      return matrix[4];
    },
    get m11() {
      return matrix[5];
    },
    get m12() {
      return matrix[6];
    },
    get m13() {
      return matrix[7];
    },
    get m20() {
      return matrix[8];
    },
    get m21() {
      return matrix[9];
    },
    get m22() {
      return matrix[10];
    },
    get m23() {
      return matrix[11];
    },
    get m30() {
      return matrix[12];
    },
    get m31() {
      return matrix[13];
    },
    get m32() {
      return matrix[14];
    },
    get m33() {
      return matrix[15];
    },
  }) as Matrix4;
};

export const multiply = (left: Matrix4, right: Matrix4, out: Matrix4 = matrix4()) => {
  const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = left;
  const [b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33] = right;
  out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
  out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
  out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
  out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
  out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
  out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
  out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
  out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
  out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
  out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
  out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
  out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
  out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
  out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
  return out;
};

export const normalize = (vector: Vector3, out: Vector3 = vector3()) => {
  const len = length(vector);
  if (len > epsilon) {
    out[0] = vector[0] / len;
    out[1] = vector[1] / len;
    out[2] = vector[2] / len;
  }
  return out;
};

export const orthographic = (left: number, right: number, bottom: number, top: number, near: number, far: number, out: Matrix4 = matrix4()) => {
  out[0] = 2 / (right - left);
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 2 / (top - bottom);
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 / (near - far);
  out[11] = 0;
  out[12] = (left + right) / (left - right);
  out[13] = (bottom + top) / (bottom - top);
  out[14] = (near + far) / (near - far);
  out[15] = 1;
  return out;
};

export const perspective = (fovInRads: number, aspect: number, near: number, far: number, out: Matrix4 = matrix4()) => {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fovInRads);
  const rangeInv = 1.0 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (near + far) * rangeInv;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = near * far * rangeInv * 2;
  out[15] = 0;
  return out;
};

export const pipe =
  (...pipeline: ((matrix: Matrix4) => Matrix4)[]) =>
  (matrix: Matrix4) =>
    pipeline.reduce((lastMatrix, fn) => fn(lastMatrix as never), matrix);

export const printMatrix = (matrix: Matrix4) => {
  console.log('[[%o %o %o %o]\n [%o %o %o %o]\n [%o %o %o %o]\n [%o %o %o %o]]', ...matrix);
};

export const printVector = (vector: Vector3 | Vector4) => {
  console.log(vector.length === 3 ? '(%o, %o, %o)' : '(%o, %o, %o, %o)', ...vector);
};

export const quatFromRotationMatrix = (matrix: Matrix4, out: Matrix4) => {
  const [, , , , , m11, m12, m13, , m21, m22, m23, , m31, m32, m33] = matrix;
  const trace = m11 + m22 + m33;
  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1);
    out[3] = 0.25 / s;
    out[0] = (m32 - m23) * s;
    out[1] = (m13 - m31) * s;
    out[2] = (m21 - m12) * s;
  } else if (m11 > m22 && m11 > m33) {
    const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
    out[3] = (m32 - m23) / s;
    out[0] = 0.25 * s;
    out[1] = (m12 + m21) / s;
    out[2] = (m13 + m31) / s;
  } else if (m22 > m33) {
    const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
    out[3] = (m13 - m31) / s;
    out[0] = (m12 + m21) / s;
    out[1] = 0.25 * s;
    out[2] = (m23 + m32) / s;
  } else {
    const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
    out[3] = (m21 - m12) / s;
    out[0] = (m13 + m31) / s;
    out[1] = (m23 + m32) / s;
    out[2] = 0.25 * s;
  }
};

export const scale = (matrix: Matrix4, sx: number, sy: number, sz: number, out: Matrix4 = matrix4()) => {
  out[0] = sx * matrix[0];
  out[1] = sx * matrix[1];
  out[2] = sx * matrix[2];
  out[3] = sx * matrix[3];
  out[4] = sy * matrix[4];
  out[5] = sy * matrix[5];
  out[6] = sy * matrix[6];
  out[7] = sy * matrix[7];
  out[8] = sz * matrix[8];
  out[9] = sz * matrix[9];
  out[10] = sz * matrix[10];
  out[11] = sz * matrix[11];
  if (matrix !== out) {
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
  }
  return out;
};

export const scaleVector = (vector: Vector3, scalar: number, out: Vector3 = vector3()) => {
  out[0] = vector[0] * scalar;
  out[1] = vector[1] * scalar;
  out[2] = vector[2] * scalar;
  return out;
};

export const scaling = (sx: number, sy: number, sz: number, out: Matrix4 = matrix4()) => {
  out[0] = sx;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = sy;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = sz;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};

export const subtractVectors = (left: Vector3, right: Vector3, out: Vector3 = vector3()) => {
  out[0] = left[0] - right[0];
  out[1] = left[1] - right[1];
  out[2] = left[2] - right[2];
  return out;
};

export const transformDirection = (matrix: Matrix4, vector: Vector3, out: Vector3 = vector3()) => {
  const [v0, v1, v2] = vector;
  out[0] = v0 * matrix[0 * 4 + 0] + v1 * matrix[1 * 4 + 0] + v2 * matrix[2 * 4 + 0];
  out[1] = v0 * matrix[0 * 4 + 1] + v1 * matrix[1 * 4 + 1] + v2 * matrix[2 * 4 + 1];
  out[2] = v0 * matrix[0 * 4 + 2] + v1 * matrix[1 * 4 + 2] + v2 * matrix[2 * 4 + 2];
  return out;
};

export const transformNormal = (matrix: Matrix4, vector: Vector3, out: Vector3 = vector3()) => {
  const mi = inverse(matrix);
  const [v0, v1, v2] = vector;
  out[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
  out[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
  out[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];
  return out;
};

export const transformPoint = (matrix: Matrix4, vector: Vector3, out: Vector3 = vector3()) => {
  const [v0, v1, v2] = vector;
  const d = v0 * matrix[0 * 4 + 3] + v1 * matrix[1 * 4 + 3] + v2 * matrix[2 * 4 + 3] + matrix[3 * 4 + 3];
  out[0] = (v0 * matrix[0 * 4 + 0] + v1 * matrix[1 * 4 + 0] + v2 * matrix[2 * 4 + 0] + matrix[3 * 4 + 0]) / d;
  out[1] = (v0 * matrix[0 * 4 + 1] + v1 * matrix[1 * 4 + 1] + v2 * matrix[2 * 4 + 1] + matrix[3 * 4 + 1]) / d;
  out[2] = (v0 * matrix[0 * 4 + 2] + v1 * matrix[1 * 4 + 2] + v2 * matrix[2 * 4 + 2] + matrix[3 * 4 + 2]) / d;
  return out;
};

export const transformVector = (matrix: Matrix4, vector: Vector4, out: Vector4 = vector4()) => {
  for (let idx = 0; idx < 4; idx++) {
    out[idx] = 0;
    for (let jdx = 0; jdx < 4; idx++) {
      out[idx] += vector[jdx] * matrix[jdx * 4 + idx];
    }
  }
  return out;
};

export const translate = (matrix: Matrix4, tx: number, ty: number, tz: number, out: Matrix4 = matrix4()) => {
  const [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33] = matrix;
  if (matrix !== out) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
  }
  out[12] = m00 * tx + m10 * ty + m20 * tz + m30;
  out[13] = m01 * tx + m11 * ty + m21 * tz + m31;
  out[14] = m02 * tx + m12 * ty + m22 * tz + m32;
  out[15] = m03 * tx + m13 * ty + m23 * tz + m33;
  return out;
};

export const translation = (tx: number, ty: number, tz: number, out: Matrix4 = matrix4()) => {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = tx;
  out[13] = ty;
  out[14] = tz;
  out[15] = 1;
  return out;
};

export const transpose = (matrix: Matrix4, out: Matrix4 = matrix4()) => {
  out[0] = matrix[0];
  out[1] = matrix[4];
  out[2] = matrix[8];
  out[3] = matrix[12];
  out[4] = matrix[1];
  out[5] = matrix[5];
  out[6] = matrix[9];
  out[7] = matrix[13];
  out[8] = matrix[2];
  out[9] = matrix[6];
  out[10] = matrix[10];
  out[11] = matrix[14];
  out[12] = matrix[3];
  out[13] = matrix[7];
  out[14] = matrix[11];
  out[15] = matrix[15];
  return out;
};

export const vector3 = (...src: Vector3 | number[]) => {
  const vector = src.length ? new Float64Array(src) : new Float64Array(3);
  return Object.assign(vector, {
    get x() {
      return vector[0];
    },
    get y() {
      return vector[1];
    },
    get z() {
      return vector[2];
    },
  }) as Vector3;
};

export const vector4 = (...src: Vector4 | number[]) => {
  const vector = src.length ? new Float64Array(src) : new Float64Array(4);
  return Object.assign(vector, {
    get x() {
      return vector[0];
    },
    get y() {
      return vector[1];
    },
    get z() {
      return vector[2];
    },
    get w() {
      return vector[3];
    },
  }) as Vector4;
};

export const xRotate = (matrix: Matrix4, angleInRads: number, out: Matrix4 = matrix4()) => {
  const [, , , , m10, m11, m12, m13, m20, m21, m22, m23] = matrix;
  const cos = Math.cos(angleInRads);
  const sin = Math.sin(angleInRads);
  out[4] = cos * m10 + sin * m20;
  out[5] = cos * m11 + sin * m21;
  out[6] = cos * m12 + sin * m22;
  out[7] = cos * m13 + sin * m23;
  out[8] = cos * m20 - sin * m10;
  out[9] = cos * m21 - sin * m11;
  out[10] = cos * m22 - sin * m12;
  out[11] = cos * m23 - sin * m13;
  if (matrix !== out) {
    out[0] = matrix[0];
    out[1] = matrix[1];
    out[2] = matrix[2];
    out[3] = matrix[3];
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
  }

  return out;
};

export const xRotation = (angleInRads: number, out: Matrix4 = matrix4()) => {
  const cos = Math.cos(angleInRads);
  const sin = Math.sin(angleInRads);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = cos;
  out[6] = sin;
  out[7] = 0;
  out[8] = 0;
  out[9] = -sin;
  out[10] = cos;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};

export const yRotate = (matrix: Matrix4, angleInRads: number, out: Matrix4 = matrix4()) => {
  const [m00, m01, m02, m03, , , , , m20, m21, m22, m23] = matrix;
  const cos = Math.cos(angleInRads);
  const sin = Math.sin(angleInRads);

  out[0] = cos * m00 - sin * m20;
  out[1] = cos * m01 - sin * m21;
  out[2] = cos * m02 - sin * m22;
  out[3] = cos * m03 - sin * m23;
  out[8] = cos * m20 + sin * m00;
  out[9] = cos * m21 + sin * m01;
  out[10] = cos * m22 + sin * m02;
  out[11] = cos * m23 + sin * m03;

  if (matrix !== out) {
    out[4] = matrix[4];
    out[5] = matrix[5];
    out[6] = matrix[6];
    out[7] = matrix[7];
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
  }

  return out;
};

export const yRotation = (angleInRads: number, out: Matrix4 = matrix4()) => {
  const cos = Math.cos(angleInRads);
  const sin = Math.sin(angleInRads);
  out[0] = cos;
  out[1] = 0;
  out[2] = -sin;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = sin;
  out[9] = 0;
  out[10] = cos;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};

export const zRotate = (matrix: Matrix4, angleInRads: number, out: Matrix4 = matrix4()) => {
  const [m00, m01, m02, m03, m10, m11, m12, m13] = matrix;
  const cos = Math.cos(angleInRads);
  const sin = Math.sin(angleInRads);

  out[0] = cos * m00 + sin * m10;
  out[1] = cos * m01 + sin * m11;
  out[2] = cos * m02 + sin * m12;
  out[3] = cos * m03 + sin * m13;
  out[4] = cos * m10 - sin * m00;
  out[5] = cos * m11 - sin * m01;
  out[6] = cos * m12 - sin * m02;
  out[7] = cos * m13 - sin * m03;

  if (matrix !== out) {
    out[8] = matrix[8];
    out[9] = matrix[9];
    out[10] = matrix[10];
    out[11] = matrix[11];
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
  }

  return out;
};

export const zRotation = (angleInRads: number, out: Matrix4 = matrix4()) => {
  const cos = Math.cos(angleInRads);
  const sin = Math.sin(angleInRads);
  out[0] = cos;
  out[1] = sin;
  out[2] = 0;
  out[3] = 0;
  out[4] = -sin;
  out[5] = cos;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};

// prettier-ignore
export type Matrix4 = Float64Array & [
  m00: number, m01: number, m02: number, m03: number,
  m10: number, m11: number, m12: number, m13: number,
  m20: number, m21: number, m22: number, m23: number,
  m30: number, m31: number, m32: number, m33: number
] & {
  m00: number, m01: number, m02: number, m03: number,
  m10: number, m11: number, m12: number, m13: number,
  m20: number, m21: number, m22: number, m23: number,
  m30: number, m31: number, m32: number, m33: number
};

export type Vector3 = Float64Array & [x: number, y: number, z: number] & { x: number; y: number; z: number };

export type Vector4 = Float64Array & [x: number, y: number, z: number, w: number] & { x: number; y: number; z: number; w: number };
