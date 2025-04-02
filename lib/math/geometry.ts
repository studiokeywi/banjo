/**
 * 2D convex polygonal/circular representations and utilities for detecting and calculating various intersections and overlaps
 *
 * @module math/geometry
 * @author studioKeywi */

// TODO: finish coverage then worry about de-class'ing the whole shebang
// TODO: still don't know what the "offset" for these things is all about... if we don't need it, nuke it
import { epsilon } from '#🪕/math/constants';
import type { Vector2 } from '#🪕/math/v2';
import { add, distance, dot, hash, length, lengthSq, normalize, perpendicular, reverse, rotate, scale, subtract, vector2 } from '#🪕/math/v2';

/**
 * Identifier value for being in the left voronoi region used for circle/polygon overlaps
 *
 * @internal */
const LEFT_VORONOI_REGION = -1;

/**
 * Identifier value for being in the middle voronoi region used for circle/polygon overlaps
 *
 * @internal */
const MIDDLE_VORONOI_REGION = 0;

/**
 * Identifier value for being in the right voronoi region used for circle/polygon overlaps
 *
 * @internal */
const RIGHT_VORONOI_REGION = 1;

// TODO: anything that can be simplified via generic box math should be here
/**
 * A Box is a {@link Polygon|non-polygonal} representation of an axis-aligned bounding box
 */
export class Box {
  /**
   * The height of the box
   */
  #height: number;
  /**
   * The location of the box
   */
  #position: Vector2;
  /**
   * The width of the box
   */
  #width: number;

  /**
   * The height of the box
   */
  get height() {
    return this.#height;
  }
  /**
   * The location of the box
   */
  get position() {
    return this.#position;
  }
  /**
   * The width of the box
   */
  get width() {
    return this.#width;
  }

  /**
   * Create a new box
   *
   * @param {Vector2} position Location of the box
   * @param {number} width Width of the box
   * @param {number} [height] Height of the box. Defaults to the `width` */
  constructor(position: Vector2 = vector2(), width: number = 0, height: number = width) {
    this.#height = height;
    this.#position = position;
    this.#width = width;
  }

  /**
   * Converts to a {@link Quad|polygonal} representation of the box
   *
   * @returns {Quad} */
  toQuad(): Quad {
    const height = this.#height;
    const width = this.#width;
    return new Quad(vector2(this.#position), vector2(), vector2(width, 0), vector2(width, height), vector2(0, height));
  }
}

// TODO: anything that can be simplified via generic circle math should be here
/**
 * A Circle is a {@link Polygon|non-polygonal} round shape defined by all the points a set radius away from a central point
 */
export class Circle {
  /**
   * The offset of the circle
   */
  #offset: Vector2 = vector2();
  /**
   * The location of the circle
   */
  #position: Vector2;
  /**
   * The radius of the circle
   */
  #radius: number;

  /**
   * The offset of the circle
   */
  get offset() {
    return this.#offset;
  }
  /**
   * The location of the circle
   */
  get position() {
    return this.#position;
  }
  /**
   * The radius of the circle
   */
  get radius() {
    return this.#radius;
  }

  /**
   * Create a new circle
   *
   * @param {Vector2} position Location of the circle
   * @param {number} radius Radius of the circle */
  constructor(position: Vector2 = vector2(), radius: number = 0) {
    this.#position = position;
    this.#radius = radius;
  }

  /**
   * Get the {@link Box|box} that contains this circle
   *
   * @returns {Box} The containing box */
  getAABB(): Box {
    const radius = this.#radius;
    const dblRadius = radius * 2;
    const corner = add(this.#position, this.#offset);
    const position = subtract(corner, vector2(radius, radius));
    return new Box(position, dblRadius);
  }

  /**
   * Get the {@link Quad|polygon} representation of the {@link Box|box} that contains this circle
   *
   * @returns {Quad} The containing polygon */
  getAABBAsQuad(): Quad {
    return this.getAABB().toQuad();
  }

  /**
   * Set the offset of this circle
   *
   * @param {Vector2} offset The new offset
   * @returns {this} This object for chaining */
  setOffset(offset: Vector2): this {
    this.#offset = offset;
    return this;
  }
}

/**
 * Information about when a ray intersects with a circle or a segment
 */
export class Intersection {
  /**
   * Angle at which the intersection occurred (in radians)
   */
  angle = 0;
  /**
   * Distance away from the ray origin where the intersection occurred
   */
  distance = Infinity;
  /**
   * Normal vector to the vector that was hit
   */
  normal: Vector2 = vector2();
  /**
   * Location of the intersection
   */
  vector: Vector2 = vector2();

  /**
   * Resets Intersection state for reuse
   */
  clear() {
    this.angle = 0;
    this.distance = Infinity;
    this.normal[0] = this.normal[1] = 0;
    this.vector[0] = this.vector[1] = 0;
  }
}

/**
 * Information about when circles and/or polygons overlap
 */
export class Overlap {
  /**
   * The first shape
   */
  A?: Circle | Polygon;
  /**
   * Whether the first shape is contained within the second
   */
  aInB = true;
  /**
   * The second shape
   */
  B?: Circle | Polygon;
  /**
   * Whether the second shape is contained within the first
   */
  bInA = true;
  /**
   * TODO: confirm what this is
   */
  distance = Infinity;
  /**
   * TODO: confirm what this is
   */
  normal: Vector2 = vector2();
  /**
   * TODO: confirm what this is
   */
  vector: Vector2 = vector2();

  /**
   * Resets Overlap state for reuse
   */
  clear() {
    this.A = undefined;
    this.aInB = true;
    this.B = undefined;
    this.bInA = true;
    this.distance = Infinity;
    this.normal[0] = this.normal[1] = 0;
    this.vector[0] = this.vector[1] = 0;
  }
}

/**
 * A polygon is a convex shape constructed with straight line segments
 */
export class Polygon<Sides extends number = number> {
  /**
   * The angle of this polygon
   */
  #angle = 0;
  /**
   * The calculated vertices of this polygon
   */
  #calculatedVertices: Vector2[] = [];
  /**
   * The edges of this polygon
   */
  #edges: Vector2[] = [];
  /**
   * The normals of each edge of this polygon
   */
  #normals: Vector2[] = [];
  /**
   * The offset of this polygon
   */
  #offset: Vector2 = vector2();
  /**
   * The location of this polygon
   */
  #position: Vector2;
  /**
   * The vertices of this polygon
   */
  #vertices: Vector2[] = [];

  /**
   * The angle of this polygon
   */
  get angle() {
    return this.#angle;
  }
  /**
   * The calculated vertices of this polygon
   */
  get calculatedVertices() {
    return this.#calculatedVertices.slice();
  }
  /**
   * The edges of this polygon
   */
  get edges() {
    return this.#edges.slice();
  }
  /**
   * The normals of each edge of this polygon
   */
  get normals() {
    return this.#normals.slice();
  }
  /**
   * The offset of this polygon
   */
  get offset() {
    return this.#offset;
  }
  /**
   * The location of this polygon
   */
  get position() {
    return this.#position;
  }
  /**
   * The vertices of this polygon
   */
  get vertices() {
    return this.#vertices.slice();
  }

  /**
   * Create a new polygon
   *
   * @param {Vector2} position The location of the polygon
   * @param {Vector2[]} vertices The vertices of the polygon */
  constructor(position: Vector2 = vector2(), ...vertices: Vector2[] & { length: Sides }) {
    this.#position = position;
    this.setVertices(...vertices);
  }

  /**
   * Recalculates the vertices, edges, and normals of the polygon based on its position and offset
   *
   * @returns {this} This for chaining */
  #recalculate(): this {
    const angle = this.#angle;
    const calculatedVertices = this.#calculatedVertices;
    const { length: calcLength } = calculatedVertices;
    const edges = this.#edges;
    const normals = this.#normals;
    const offset = this.#offset;
    const vertices = this.#vertices;
    const { length } = vertices;
    let idx: number;
    for (idx = 0; idx < length; idx++) {
      const cur = (calculatedVertices[idx] = vector2(vertices[idx]));
      add(cur, offset, cur);
      if (angle !== 0) {
        rotate(cur, angle, cur);
      }
    }
    for (idx = 0; idx < length; idx++) {
      const p1 = calculatedVertices[idx];
      const p2 = calculatedVertices[(idx + 1) % calcLength];
      const edge = (edges[idx] = vector2(p2));
      subtract(edge, p1, edge);
      const normal = (normals[idx] = vector2(edge));
      perpendicular(normal, normal);
      normalize(normal, normal);
    }
    return this;
  }

  /**
   * Get the {@link Box|box} that contains this polygon
   *
   * @returns {Box} The containing box */
  getAABB(): Box {
    const calculatedVertices = this.#calculatedVertices;
    const { length } = calculatedVertices;
    let xMin, xMax, yMin, yMax;
    xMin = xMax = calculatedVertices[0].x;
    yMin = yMax = calculatedVertices[0].y;
    let idx: number;
    for (idx = 1; idx < length; idx++) {
      const { x, y } = calculatedVertices[idx];
      if (x < xMin) {
        xMin = x;
      } else if (x > xMax) {
        xMax = x;
      }
      if (y < yMin) {
        yMin = y;
      } else if (y > yMax) {
        yMax = y;
      }
    }
    const position = add(vector2(this.#position), vector2(xMin, yMin));
    const width = xMax - xMin;
    const height = yMax - yMin;
    return new Box(position, width, height);
  }

  /**
   * Get the {@link Quad|polygonal} representation of the {@link Box|box} that contains this polygon
   *
   * @returns {Quad} The containing quad */
  getAABBAsQuad(): Quad {
    return this.getAABB().toQuad();
  }

  /**
   * Get the location of the geometric center of the polygon
   *
   * @returns {Vector2} The centroid's location */
  getCentroid(): Vector2 {
    const calculatedVertices = this.#calculatedVertices;
    const { length } = calculatedVertices;
    let centroidX = 0;
    let centroidY = 0;
    let ar = 0;
    let idx: number;
    for (idx = 0; idx < length; idx++) {
      const { x: curX, y: curY } = calculatedVertices[idx];
      const { x: nextX, y: nextY } = calculatedVertices[idx + 1 < length ? idx + 1 : 0];
      const a = curX * nextY - nextX * curY;
      centroidX += (curX + nextX) * a;
      centroidY += (curY + nextY) * a;
      ar += a;
    }
    ar *= 3;
    const centroid = vector2(centroidX, centroidY);
    return scale(centroid, 1 / ar, centroid);
  }

  /**
   * Rotates the polygon by a given angle
   *
   * @param {number} radians The angle to rotate
   * @returns {this} This for chaining */
  rotate(radians: number): this {
    const vertices = this.#vertices;
    for (const vertex of vertices) {
      rotate(vertex, radians, vertex);
    }
    return this.#recalculate();
  }

  /**
   * Sets the angle of the polygon
   *
   * @param {number} radians The new angle
   * @returns {this} This for chaining */
  setAngle(radians: number): this {
    this.#angle = radians;
    return this.#recalculate();
  }

  /**
   * Sets the offset of the polygon
   *
   * @param {Vector2} offset The new offset
   * @returns {this} This for chaining */
  setOffset(offset: Vector2): this {
    this.#offset = offset;
    return this.#recalculate();
  }

  /**
   * Sets the vertices of the polygon
   *
   * @param {Vector2[]} vertices The new vertices
   * @returns {this} This for chaining */
  setVertices(...vertices: Vector2[]): this {
    if (this.#vertices.length === vertices.length) {
      return this;
    }
    let idx: number;
    const calculatedVertices: Vector2[] = (this.#calculatedVertices = []);
    const edges: Vector2[] = (this.#edges = []);
    const normals: Vector2[] = (this.#normals = []);
    for (idx = 0; idx < vertices.length; idx++) {
      const cur = vertices[idx];
      const next = vertices[idx + 1 < vertices.length ? idx + 1 : 0];
      if (cur !== next && cur.x === next.x && cur.y === next.y) {
        vertices.splice(idx--, 1);
        continue;
      }
      calculatedVertices.push(vector2());
      edges.push(vector2());
      normals.push(vector2());
    }
    this.#vertices = vertices;
    return this.#recalculate();
  }

  /**
   * Translates the polygon by a given vector
   *
   * @param {Vector2} vector The translation amount
   * @returns {this} */
  translate(vector: Vector2): this {
    const vertices = this.#vertices;
    for (const vertex of vertices) {
      add(vertex, vector, vertex);
    }
    return this.#recalculate();
  }
}

// TODO: anything that can be simplified via generic hex math should be overloaded here
/**
 * A hexagon is a 6-sided {@link Polygon|polygon}
 */
export class Hex extends Polygon<6> {}

// TODO: anything that can be simplified via triangle math should be overloaded here
/**
 * A triangle is a 3-sided {@link Polygon|polygon}
 */
export class Triangle extends Polygon<3> {}

// TODO: anything that can be simplified via generic quad math should be overloaded here
/**
 * A quad is a 4-sided {@link Polygon|polygon}
 */
export class Quad extends Polygon<4> {}

/**
 * Calculates whether or not there is a separating axis between two {@link Polygon|polygons}
 *
 * @param {Vector2} positionA Position of the first polygon
 * @param {Vector2[]} verticesA[] Vertices of the first polygon
 * @param {Vector2} positionB Position of the second polygon
 * @param {Vector2[]} verticesB[] Vertices of the second polygon
 * @param {Vector2} axis Vector used as a normal to calculate vertices
 * @param {Overlap} [overlap] Optional {@link Overlap} object to store information
 * @param {Vector2} [tmpVec] Optional vector used for storing temporary calculations
 * @returns {boolean} Whether a separating axis betweens the polygons */
const findSeparatingAxis = (
  positionA: Vector2,
  verticesA: Vector2[],
  positionB: Vector2,
  verticesB: Vector2[],
  axis: Vector2,
  overlap?: Overlap,
  tmpVec: Vector2 = vector2()
): boolean => {
  const rangeA: [min: number, max: number] = [NaN, NaN];
  const rangeB: [min: number, max: number] = [NaN, NaN];
  subtract(positionB, positionA, tmpVec);
  flattenVertices(verticesA, axis, rangeA);
  flattenVertices(verticesB, axis, rangeB);
  const projectedOffset = dot(tmpVec, axis);
  rangeB[0] += projectedOffset;
  rangeB[1] += projectedOffset;
  const [aMin, aMax] = rangeA;
  const [bMin, bMax] = rangeB;
  if (!(Math.max(aMin, bMin) - Math.min(aMax, bMax) <= 0)) {
    return true;
  }
  if (!overlap) {
    return false;
  }
  let distance = 0;
  if (aMin < bMin) {
    overlap.aInB = false;
    if (aMax < bMax) {
      distance = aMax - bMin;
      overlap.bInA = false;
    } else {
      const option1 = aMax - bMin;
      const option2 = bMax - aMin;
      distance = option1 < option2 ? option1 : -option2;
    }
  } else {
    overlap.bInA = false;
    if (aMax > bMax) {
      distance = aMin - bMax;
      overlap.aInB = false;
    } else {
      const option1 = aMax - bMin;
      const option2 = bMax - aMin;
      distance = option1 < option2 ? option1 : -option2;
    }
  }
  const absOverlap = Math.abs(distance);
  if (absOverlap < overlap.distance) {
    overlap.distance = absOverlap;
    overlap.normal = vector2(axis);
    if (distance < 0) {
      reverse(overlap.normal, overlap.normal);
    }
  }
  return false;
};

/**
 * Calculates the minimum and maximum value of a given set of vertices
 *
 * @param {Vector2[]} vertices List of vertices
 * @param {Vector2} normal The vector against which values are calculated
 * @param {[min: number, max: number]} [out] Optional output array to contain the values  (can be used to inject results into an existing array)
 * @returns {[min: number, max: number]} The calculated minimum and maximum */
const flattenVertices = (
  vertices: Vector2[],
  normal: Vector2,
  out: [min: number, max: number] = [NaN, NaN] as [number, number]
): [min: number, max: number] => {
  let min = Infinity;
  let max = -Infinity;
  for (const vertex of vertices) {
    const dotProd = dot(vertex, normal);
    if (dotProd < min) {
      min = dotProd;
    } else if (dotProd > max) {
      max = dotProd;
    }
  }
  out[0] = min;
  out[1] = max;
  return out;
};

/**
 * Determines the voronoi region for a given vertex and line
 *
 * @param {Vector2} line
 * @param {Vector2} vertex
 * @returns {VoronoiRegion} */
const voronoiRegion = (line: Vector2, vertex: Vector2): VoronoiRegion => {
  const dotProd = dot(vertex, line);
  return dotProd < 0 ? LEFT_VORONOI_REGION : dotProd > lengthSq(line) ? RIGHT_VORONOI_REGION : MIDDLE_VORONOI_REGION;
};

/**
 * Casts a ray at a circle and determines if there is an intersection
 *
 * @param {Vector2} rayStart Origin of the ray
 * @param {Vector2} direction Direction of the ray
 * @param {Circle} circle Circle in question
 * @param {number} [target] Minimum distance that must be met to return a result
 * @param {Intersection} [intersection] Optional {@link Intersection} object to contain information about the result
 * @returns {boolean} Whether there was an intersection or not */
export const castRayAtCircle = (
  rayStart: Vector2,
  direction: Vector2,
  { radius, position, position: { x: x0, y: y0 } }: Circle,
  target?: number,
  intersection?: Intersection
): boolean => {
  const { x: x1, y: y1 } = rayStart;
  const { x: x2, y: y2 } = add(rayStart, normalize(direction));
  const A = y2 - y1;
  const B = x1 - x2;
  const C = x2 * y1 - x1 * y2;

  const isVertical = !B || Math.abs(B) < epsilon;

  const A_2 = A ** 2;
  const B_2 = B ** 2;
  const C_2 = C ** 2;

  const _2AB = 2 * A * B;
  const _2C = 2 * C;
  const _2AC = A * _2C;
  const _2BC = B * _2C;
  const _circle = radius ** 2 - x0 ** 2 - y0 ** 2;

  const a = A_2 + B_2;
  const vertices: Vector2[] = [];
  let roots: number[];
  if (isVertical) {
    roots = solveQuadratic(a, _2BC + _2AB * x0 - 2 * A_2 * y0, C_2 + _2AC * x0 - A_2 * _circle);
  } else {
    roots = solveQuadratic(a, _2AC + _2AB * y0 - 2 * B_2 * x0, C_2 + _2BC * y0 - B_2 * _circle);
  }
  if (!roots.length) {
    return false;
  }
  if (isVertical) {
    let y: number;
    for (y of roots) {
      vertices.push(vector2(-((B * y + C) / A), y));
    }
  } else {
    let x: number;
    for (x of roots) {
      vertices.push(vector2(x, -((A * x + C) / B)));
    }
  }
  let vector = vertices[0];
  let dist = distance(rayStart, vector);
  if (vertices.length === 2) {
    const otherVec = vertices[1];
    const otherDist = distance(rayStart, otherVec);
    if (otherDist < dist) {
      dist = otherDist;
      vector = otherVec;
    }
  }
  if (typeof target === 'number' && dist >= target) {
    return false;
  }
  if (!intersection) {
    return true;
  }

  const normal = subtract(vector, position);
  normalize(normal, normal);
  intersection.angle = Math.atan2(normal.x, normal.y);
  intersection.distance = dist;
  intersection.normal = normal;
  intersection.vector = vector;

  return true;
};

/**
 * Casts a ray at a line and determines if there is an intersection
 *
 * @param {Vector2} rayStart Origin of the ray
 * @param {Vector2} direction Direction of the ray
 * @param {Vector2} p1 First point of the line
 * @param {Vector2} p2 Second point of the line
 * @param {number} [target] Minimum distance that must be met to return a result
 * @param {Intersection} [intersection] Optional {@link Intersection} object to contain information about the result
 * @returns {boolean} Whether there was an intersection or not */
export const castRayAtLine = (
  rayStart: Vector2,
  { x: dirX, y: dirY }: Vector2,
  { x: p1x, y: p1y }: Vector2,
  { x: p2x, y: p2y }: Vector2,
  target?: number,
  intersection?: Intersection
): boolean => {
  const { x: rayX, y: rayY } = rayStart;
  const deltaX = p2x - p1x;
  const deltaY = p2y - p1y;
  const denom = (dirX - rayX) * deltaY - deltaX * (dirY - rayY);
  if (!denom || Math.abs(denom) === Infinity) {
    return false;
  }
  const dist = (deltaX * (rayY - p1y) - (rayX - p1x) * deltaY) / denom;
  if (dist + epsilon < 0 || (typeof target === 'number' && target < dist)) {
    return false;
  }
  const pctAlongLine = ((p1x - rayX) * (dirY - rayY) - (dirX - rayX) * (p1y - rayY)) / denom;
  // TODO: how brutal can we be here? how small does this ever get where this value of epsilon matters
  if (pctAlongLine + epsilon < 0 || pctAlongLine - epsilon > 1) {
    return false;
  }
  if (!intersection) {
    return true;
  }
  const vector = vector2(pctAlongLine * deltaX + p1x, pctAlongLine * deltaY + p1y);
  const normal = normalize(vector2(deltaY, -deltaX));
  intersection.angle = Math.atan2(normal.x, normal.y);
  intersection.distance = distance(rayStart, vector);
  intersection.normal = normal;
  intersection.vector = vector;
  return true;
};

/**
 * Calculate whether two circles overlap or not
 *
 * @param {Circle} A The first circle
 * @param {Circle} B The second circle
 * @param {Overlap} [overlap] Optional {@link Overlap} object to contain information about the results
 * @returns {boolean} Whether there was an overlap or not */
export const circlesOverlap = (A: Circle, B: Circle, overlap?: Overlap, tmpVec: Vector2 = vector2()): boolean => {
  add(B.position, B.offset, tmpVec);
  subtract(tmpVec, A.position, tmpVec);
  subtract(tmpVec, A.offset, tmpVec);
  const totalRadius = A.radius + B.radius;
  const totalRadiusSq = totalRadius * totalRadius;
  const distanceSq = lengthSq(tmpVec);
  if (distanceSq > totalRadiusSq) {
    return false;
  }
  if (!overlap) {
    return true;
  }
  const { radius: radiusA } = A;
  const { radius: radiusB } = B;
  const dist = Math.sqrt(distanceSq);
  overlap.A = A;
  overlap.B = B;
  overlap.distance = totalRadius - dist;
  overlap.normal = normalize(tmpVec);
  overlap.vector = scale(overlap.normal, overlap.distance);
  overlap.aInB = radiusA <= radiusB && dist <= radiusB - radiusA;
  overlap.bInA = radiusB <= radiusA && dist <= radiusA - radiusB;
  return true;
};

/**
 * Whether a circle overlaps with a polygon
 *
 * @param {Circle} circle The circle
 * @param {Polygon} polygon The polygon
 * @param {Overlap} [overlap] Optional {@link Overlap} object to contain information about the results
 * @returns {boolean} Whether there was an overlap or not */
export const circlePolygonOverlap = (circle: Circle, polygon: Polygon, overlap?: Overlap): boolean => {
  const result = polygonCircleOverlap(polygon, circle, overlap);
  if (result && overlap) {
    reverse(overlap.normal, overlap.normal);
    reverse(overlap.vector, overlap.vector);
    [overlap.A, overlap.B] = [overlap.B, overlap.A];
    [overlap.aInB, overlap.bInA] = [overlap.bInA, overlap.aInB];
  }
  return result;
};

/**
 * Whether a point exists within a circle
 *
 * @param {Vector2} point Point in question
 * @param {Circle} circle Circle in question
 * @param {Vector2} [tmpVec] Vector used for temporary calculations
 * @returns {boolean} Whether the point was inside the circle or not */
export const pointInCircle = (point: Vector2, circle: Circle, tmpVec: Vector2 = vector2()): boolean => {
  subtract(point, circle.position, tmpVec);
  subtract(tmpVec, circle.offset, tmpVec);
  return lengthSq(tmpVec) <= circle.radius ** 2;
};

// NOTE: this is from the OG SAT lib but.. making a tiny box and doing a full poly/poly check seems worse than the ray cast check by up to 4 checks
// const _point = new Box(vector2(), epsilon, epsilon).toQuad();
// const _point = new Polygon(vector2(), vector2(), vector2(epsilon, epsilon));
// export const pointInPolygon_old = (point: Vector2, polygon: Polygon, overlap?: Overlap): boolean => {
//   _point.position = vector2(point);
//   return polygonsOverlap(_point, polygon, overlap);
// };

/**
 * Whether a point exists within a polygon
 *
 * @param {Vector2} point Point in question
 * @param {Polygon} polygon Polygon in question
 * @param {Vector2} [start] Vector used for temporary calculations
 * @param {Vector2} [end] Vector used for temporary calculations
 * @returns {boolean} Whether the point was inside the circle or not */
export const pointInPolygon = (point: Vector2, polygon: Polygon, start: Vector2 = vector2(), end: Vector2 = vector2()): boolean => {
  const {
    position,
    vertices,
    vertices: { length },
  } = polygon;
  let idx: number;
  const rayEnd = vector2(point);
  rayEnd[0] += 100_000;
  let hits = 0;
  for (idx = 0; idx < length; idx++) {
    add(position, vertices[idx], start);
    add(position, vertices[(idx + 1) % length], end);
    if (castRayAtLine(point, rayEnd, start, end)) {
      hits++;
    }
  }
  return hits % 2 !== 0;
};

/**
 * Whether a point exists on a line
 *
 * @param {Vector2} point Point in question
 * @param {Vector2} linePoint1 First point on the line
 * @param {Vector2} linePoint2 Second point on the line
 * @returns {boolean} Whether the point was on the line or not */
export const pointOnLine = ({ x, y }: Vector2, { x: x0, y: y0 }: Vector2, { x: x1, y: y1 }: Vector2): boolean =>
  Math.abs((y1 - y0) * x + (x0 - x1) * y + (x1 * y0 - x0 * y1)) <= epsilon;

/**
 * Whether a polygon overlaps with a circle
 *
 * @param {Polygon} polygon The polygon
 * @param {Circle} circle The circle
 * @param {Overlap} [overlap] Optional {@link Overlap} object to contain information about the results
 * @returns {boolean} Whether there was an overlap or not */
export const polygonCircleOverlap = (polygon: Polygon, circle: Circle, overlap?: Overlap): boolean => {
  const circlePos = add(circle.offset, circle.position);
  subtract(circlePos, polygon.position, circlePos);
  const radius = circle.radius;
  const radius2 = radius ** 2;
  const vertices = polygon.calculatedVertices;
  const len = vertices.length;
  const edge: Vector2 = vector2();
  const point: Vector2 = vector2();
  let idx: number;
  for (idx = 0; idx < len; idx++) {
    edge[0] = edge[1] = point[0] = point[1] = 0;
    const next = (idx + 1) % len;
    const prev = (idx + len - 1) % len;
    let distance = 0;
    let overlapNormal = null;
    add(edge, polygon.edges[idx], edge);
    subtract(circlePos, vertices[idx], point);
    if (overlap && lengthSq(point) > radius2) {
      overlap.aInB = false;
    }
    let region = voronoiRegion(edge, point);
    if (region === LEFT_VORONOI_REGION) {
      [edge[0], edge[1]] = polygon.edges[prev];
      const point2 = subtract(circlePos, vertices[prev]);
      region = voronoiRegion(edge, point2);
      if (region === RIGHT_VORONOI_REGION) {
        const dist = length(point);
        if (dist > radius) {
          return false;
        }
        if (overlap) {
          overlap.bInA = false;
          overlapNormal = normalize(point);
          distance = radius - dist;
        }
      }
    } else if (region === RIGHT_VORONOI_REGION) {
      [edge[0], edge[1]] = polygon.edges[next];
      subtract(circlePos, vertices[next], point);
      region = voronoiRegion(edge, point);
      if (region === LEFT_VORONOI_REGION) {
        const dist = length(point);
        if (dist > radius) {
          return false;
        }
        if (overlap) {
          overlap.bInA = false;
          overlapNormal = normalize(point);
          distance = radius - dist;
        }
      }
    } else {
      const normalized = perpendicular(edge);
      normalize(normalized, normalized);
      const dist = dot(point, normalized);
      const distAbs = Math.abs(dist);
      if (dist > 0 && distAbs > radius) {
        return false;
      }
      if (overlap) {
        overlapNormal = normalized;
        distance = radius - dist;
        if (dist >= 0 || distance < 2 * radius) {
          overlap.bInA = false;
        }
      }
    }
    if (overlapNormal && overlap && Math.abs(distance) < Math.abs(overlap.distance)) {
      overlap.distance = distance;
      overlap.normal = vector2(overlapNormal);
    }
  }
  if (!overlap) {
    return true;
  }
  overlap.A = polygon;
  overlap.B = circle;
  overlap.vector = scale(overlap.normal, overlap.distance);
  return true;
};

/**
 * Calculate whether two polygons overlap or not
 *
 * @param {Polygon} A The first polygon
 * @param {Polygon} B The second polygon
 * @param {Overlap} [overlap] Optional {@link Overlap} object to contain information about the results
 * @returns {boolean} Whether there was an overlap or not */
export const polygonsOverlap = (A: Polygon, B: Polygon, overlap?: Overlap): boolean => {
  const { normals: normalsA, position: positionA, vertices: verticesA } = A;
  const { normals: normalsB, position: positionB, vertices: verticesB } = B;
  const parallels = new Set<number>();
  let axis: Vector2;
  let id: number;
  const normals = normalsA.concat(normalsB);
  for (axis of normals) {
    id = hash(axis);
    if (parallels.has(id)) {
      continue;
    }
    parallels.add(id);
    if (findSeparatingAxis(positionA, verticesA, positionB, verticesB, axis, overlap)) {
      return false;
    }
  }
  if (!overlap) {
    return true;
  }
  overlap.A = A;
  overlap.B = B;
  overlap.vector = scale(overlap.normal, overlap.distance);
  return true;
};

/**
 * Identifier values for different voronoi regions used for circle/polygon overlaps
 *
 * @internal */
export type VoronoiRegion = typeof LEFT_VORONOI_REGION | typeof MIDDLE_VORONOI_REGION | typeof RIGHT_VORONOI_REGION;

// TODO: missing coverage (Feb 9 2025)
// 587: polygonCircleOverlap -- dist + epsilon < 0 || (typeof target === 'number' && target < dist)

/**
 * Returns axis intercept values from solving equations of the form `ax^2 + bx + c = 0`
 *
 * @param {number} a Coefficient of the first term
 * @param {number} b Coefficient of the second term
 * @param {number} c Coefficient of the third time
 * @returns {[] | [number] | [number, number]} Any roots that were calculated from the equation */
const solveQuadratic = (a: number, b: number, c: number): [] | [number] | [number, number] => {
  const intercepts = [] as number[];
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant < 0) {
    return intercepts as [];
  }
  const root = Math.sqrt(discriminant);
  const oneOver2a = 1 / (2 * a);
  intercepts.push((-b + root) * oneOver2a);
  if (discriminant) {
    intercepts.push((-b - root) * oneOver2a);
  }
  return intercepts as [];
};
