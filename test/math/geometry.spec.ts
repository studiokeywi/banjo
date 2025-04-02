import { eighthTau, quarterTau } from '#🪕/math/constants';
import * as geometry from '#🪕/math/geometry';
import { vector2, type Vector2 } from '#🪕/math/v2';
import { describe, expect, it } from 'vitest';

describe('geometry (module)', () => {
  describe('.Box', () => {
    it('constructor', () => {
      const box = new geometry.Box(vector2(), 10);
      expect(box.height).toBe(10);
      expect(box.width).toBe(10);
      expect(box.position).toEqual(vector2());
    });

    it('.toQuad()', () => {
      const quad = new geometry.Box(vector2(), 10).toQuad();
      expect(quad).toBeInstanceOf(geometry.Quad);
      expect(quad.vertices).toEqual([vector2(), vector2(10, 0), vector2(10, 10), vector2(0, 10)]);
    });
  });

  describe('.Circle', () => {
    it('constructor', () => {
      const circle = new geometry.Circle(vector2(10, 10), 10);
      expect(circle.offset).toEqual(vector2());
      expect(circle.position).toEqual(vector2(10, 10));
      expect(circle.radius).toBe(10);
    });

    it('.getAABB', () => {
      const circle = new geometry.Circle(vector2(10, 10), 10);
      const box = circle.getAABB();
      expect(box).toBeInstanceOf(geometry.Box);
      expect(box.height).toBe(20);
      expect(box.width).toBe(20);
      expect(box.position).toEqual(vector2(0, 0));
      circle.setOffset(vector2(10, 10));
      expect(circle.getAABB().position).toEqual(vector2(10, 10));
    });

    it('.getAABBAsQuad', () => {
      expect(new geometry.Circle(vector2(10, 10), 10).getAABBAsQuad()).toBeInstanceOf(geometry.Quad);
    });
  });

  describe('.Polygon', () => {
    it('constructor', () => {
      // tiny line segment is technically a poly!
      const poly = new geometry.Polygon(vector2(), vector2(), vector2(1, 0));
      expect(poly.angle).toBe(0);
      expect(poly.calculatedVertices).toEqual([vector2(), vector2(1, 0)]);
      expect(poly.edges).toEqual([vector2(1, 0), vector2(-1, 0)]);
      expect(poly.normals).toEqual([vector2(0, -1), vector2(0, 1)]);
      expect(poly.offset).toEqual(vector2());
      expect(poly.position).toEqual(vector2());
      expect(poly.vertices).toEqual([vector2(), vector2(1, 0)]);
    });

    it('.getAABB', () => {
      const box = new geometry.Polygon(vector2(), vector2(), vector2(1, 0)).getAABB();
      expect(box).toBeInstanceOf(geometry.Box);
    });

    it('.getAABBAsQuad', () => {
      let poly = new geometry.Polygon(
        vector2(),
        vector2(1, 2),
        vector2(0, 2),
        vector2(0, 1),
        vector2(),
        vector2(1, 0),
        vector2(2, 0),
        vector2(2, 1),
        vector2(2, 2)
      );
      let quad = poly.getAABBAsQuad();
      expect(quad).toBeInstanceOf(geometry.Quad);
      expect(quad.vertices.length).toBe(4);
      poly = new geometry.Polygon(
        vector2(),
        vector2(2, 1),
        vector2(2, 2),
        vector2(1, 2),
        vector2(0, 2),
        vector2(0, 1),
        vector2(),
        vector2(1, 0),
        vector2(2, 0)
      );
      quad = poly.getAABBAsQuad();
      expect(quad).toBeInstanceOf(geometry.Quad);
      expect(quad.vertices.length).toBe(4);
    });

    it('.getCentroid', () => {
      let polygon = new geometry.Quad(vector2(0, 0), vector2(0, 0), vector2(40, 0), vector2(40, 40), vector2(0, 40));
      let centroid = polygon.getCentroid();
      expect(centroid.x).toBe(20);
      expect(centroid.y).toBe(20);
      polygon = new geometry.Triangle(vector2(0, 0), vector2(0, 0), vector2(100, 0), vector2(50, 99));
      centroid = polygon.getCentroid();
      expect(centroid.x).toBe(50);
      expect(centroid.y).toBe(33);
    });

    it('.rotate', () => {
      const poly = new geometry.Polygon(vector2(), vector2(), vector2(1, 0)).rotate(quarterTau);
      expect(poly.angle).toBe(0);
      expect(poly.calculatedVertices).toEqual([vector2(), vector2(0, -1)]);
      expect(poly.edges).toEqual([vector2(0, -1), vector2(0, 1)]);
      expect(poly.normals).toEqual([vector2(-1, -0), vector2(1, -0)]);
      expect(poly.offset).toEqual(vector2());
      expect(poly.position).toEqual(vector2());
      expect(poly.vertices).toEqual([vector2(), vector2(0, -1)]);
    });

    it('.setAngle', () => {
      const poly = new geometry.Polygon(vector2(), vector2(), vector2(1, 0)).setAngle(quarterTau);
      expect(poly.angle).toBe(quarterTau);
      expect(poly.calculatedVertices).toEqual([vector2(), vector2(0, -1)]);
      expect(poly.edges).toEqual([vector2(0, -1), vector2(0, 1)]);
      expect(poly.normals).toEqual([vector2(-1, -0), vector2(1, -0)]);
      expect(poly.offset).toEqual(vector2());
      expect(poly.position).toEqual(vector2());
      expect(poly.vertices).toEqual([vector2(), vector2(1, 0)]);
    });

    it('.setOffset', () => {
      const poly = new geometry.Polygon(vector2(), vector2(), vector2(1, 0)).setOffset(vector2(1, 1));
      expect(poly.angle).toBe(0);
      expect(poly.calculatedVertices).toEqual([vector2(1, 1), vector2(2, 1)]);
      expect(poly.edges).toEqual([vector2(1, 0), vector2(-1, 0)]);
      expect(poly.normals).toEqual([vector2(0, -1), vector2(0, 1)]);
      expect(poly.offset).toEqual(vector2(1, 1));
      expect(poly.position).toEqual(vector2());
      expect(poly.vertices).toEqual([vector2(), vector2(1, 0)]);
    });

    it('.setVertices', () => {
      const poly = new geometry.Polygon(vector2(), vector2(), vector2(1, 0)).setVertices(vector2(1, 1), vector2(0, 1));
      expect(poly.angle).toBe(0);
      expect(poly.calculatedVertices).toEqual([vector2(), vector2(1, 0)]);
      expect(poly.edges).toEqual([vector2(1, 0), vector2(-1, 0)]);
      expect(poly.normals).toEqual([vector2(0, -1), vector2(0, 1)]);
      expect(poly.offset).toEqual(vector2());
      expect(poly.position).toEqual(vector2());
      expect(poly.vertices).toEqual([vector2(), vector2(1, 0)]);
    });

    it('.translate', () => {
      const poly = new geometry.Polygon(vector2(), vector2(), vector2(1, 0)).translate(vector2(1, 1));
      expect(poly.angle).toBe(0);
      expect(poly.calculatedVertices).toEqual([vector2(1, 1), vector2(2, 1)]);
      expect(poly.edges).toEqual([vector2(1, 0), vector2(-1, 0)]);
      expect(poly.normals).toEqual([vector2(0, -1), vector2(0, 1)]);
      expect(poly.offset).toEqual(vector2());
      expect(poly.position).toEqual(vector2());
      expect(poly.vertices).toEqual([vector2(1, 1), vector2(2, 1)]);
    });
  });

  it('.castRayAtCircle', () => {
    const rayStart = vector2();
    const direction = vector2(1, 1);
    const circle = new geometry.Circle(vector2(10, 10), 5);
    expect(geometry.castRayAtCircle(rayStart, direction, circle)).toBe(true);
    expect(geometry.castRayAtCircle(rayStart, direction, circle, 1)).toBe(false);
    expect(geometry.castRayAtCircle(rayStart, vector2(-1, 0), circle)).toBe(false);
    const intersection = new geometry.Intersection();
    geometry.castRayAtCircle(rayStart, direction, circle, undefined, intersection);
    expect(intersection.angle).toBe(-3 * eighthTau);
    expect(intersection.distance).toBe(9.142135623730951);
    expect(intersection.normal).toEqual(vector2(-0.7071067811865475, -0.7071067811865475));
    expect(intersection.vector).toEqual(vector2(6.464466094067262, 6.464466094067262));
    intersection.clear();
    geometry.castRayAtCircle(vector2(5, 0), vector2(0, 1), circle, undefined, intersection);
    expect(intersection.angle).toBe(-quarterTau);
    expect(intersection.distance).toBe(10);
    expect(intersection.normal).toEqual(vector2(-1, 0));
    expect(intersection.vector).toEqual(vector2(5, 10));
  });

  it('.castRayAtLine', () => {
    // TODO: fire at a non-right angle
    const rayStart = vector2();
    const dir = vector2(1, 0);
    const p1: Vector2 = vector2(0.5, -1);
    const p2: Vector2 = vector2(0.5, 1);
    expect(geometry.castRayAtLine(rayStart, dir, p1, p2)).toBe(true);
    const intersection = new geometry.Intersection();
    geometry.castRayAtLine(rayStart, dir, p1, p2, undefined, intersection);
    expect(intersection.angle).toBe(quarterTau);
    expect(intersection.distance).toBe(0.5);
    expect(intersection.normal).toEqual(vector2(1, -0));
    expect(intersection.vector).toEqual(vector2(0.5, 0));
  });

  it('.circlePolygonOverlap', () => {
    const circle = new geometry.Circle(vector2(50, 50), 20);
    let polygon = new geometry.Quad(vector2(0, 0), vector2(0, 0), vector2(40, 0), vector2(40, 40), vector2(0, 40));
    const overlap = new geometry.Overlap();
    expect(geometry.circlePolygonOverlap(circle, polygon)).toBe(true);
    let collided = geometry.circlePolygonOverlap(circle, polygon, overlap);
    expect(collided).toBe(true);
    expect(overlap.distance.toFixed(2)).toBe('5.86');
    expect(overlap.vector.x.toFixed(2)).toBe('-4.14');
    expect(overlap.vector.y.toFixed(2)).toBe('-4.14');
    circle.setOffset(vector2(10, 10));
    expect(geometry.circlePolygonOverlap(circle, polygon)).toBe(false);
    overlap.clear();
    collided = geometry.circlePolygonOverlap(circle, polygon, overlap);
    expect(collided).toBe(false);
    polygon = new geometry.Box(vector2(1000, 1000), 100, 0).toQuad();
    circle.setOffset(vector2());
    expect(geometry.circlePolygonOverlap(circle, polygon)).toBe(false);
    overlap.clear();
    collided = geometry.circlePolygonOverlap(circle, polygon, overlap);
    expect(collided).toBe(false);
    polygon = new geometry.Box(vector2(50, 50), 100, 0).toQuad();
    expect(geometry.circlePolygonOverlap(circle, polygon)).toBe(true);
    overlap.clear();
    collided = geometry.circlePolygonOverlap(circle, polygon, overlap);
    expect(collided).toBe(true);
    expect(overlap.distance.toFixed(2)).toBe('20.00');
  });

  it('.circlesOverlap', () => {
    const circle1 = new geometry.Circle(vector2(0, 0), 20);
    const circle2 = new geometry.Circle(vector2(30, 0), 20);
    const overlap = new geometry.Overlap();
    expect(geometry.circlesOverlap(circle1, circle2)).toBe(true);
    let collided = geometry.circlesOverlap(circle1, circle2, overlap);

    expect(collided).toBe(true);
    expect(overlap.distance).toBe(10);
    expect(overlap.vector.x).toBe(10);
    expect(overlap.vector.y).toBe(0);

    overlap.clear();
    circle1.setOffset(vector2(-10, -10));
    expect(geometry.circlesOverlap(circle1, circle2)).toBe(false);
    collided = geometry.circlesOverlap(circle1, circle2, overlap);
    expect(collided).toBe(false);

    const circle3 = new geometry.Circle(vector2(30, 0), 10);
    overlap.clear();
    geometry.circlesOverlap(circle2, circle3, overlap);
    expect(overlap.A).toBe(circle2);
    expect(overlap.B).toBe(circle3);
    expect(overlap.aInB).toBe(false);
    expect(overlap.bInA).toBe(true);
    expect(overlap.distance).toBe(30);
    expect(overlap.normal).toEqual(vector2());
    expect(overlap.vector).toEqual(vector2());
  });

  it('.pointInCircle', () => {
    const circle = new geometry.Circle(vector2(100, 100), 20);

    expect(geometry.pointInCircle(vector2(0, 0), circle)).toBe(false);
    expect(geometry.pointInCircle(vector2(110, 110), circle)).toBe(true);

    circle.setOffset(vector2(-10, -10));
    expect(geometry.pointInCircle(vector2(110, 110), circle)).toBe(false);
  });

  it('.pointInPolygon', () => {
    const triangle = new geometry.Triangle(vector2(30, 0), vector2(0, 0), vector2(30, 0), vector2(0, 30));
    expect(geometry.pointInPolygon(vector2(0, 0), triangle)).toBe(false);
    expect(geometry.pointInPolygon(vector2(35, 5), triangle)).toBe(true);
    const v1 = vector2(1, 1.1);
    const p1 = new geometry.Hex(vector2(0, 0), vector2(2, 1), vector2(2, 2), vector2(1, 3), vector2(0, 2), vector2(0, 1), vector2(1, 0));
    expect(geometry.pointInPolygon(v1, p1)).toBe(true);
  });

  it('.pointOnLine', () => {
    expect(geometry.pointOnLine(vector2(3, 4), vector2(0, 0), vector2(2, 2))).toBe(false);
    expect(geometry.pointOnLine(vector2(1, 1), vector2(0, 0), vector2(2, 2))).toBe(true);
  });

  it('.polygonCircleOverlap', () => {
    const circle1 = new geometry.Circle(vector2(50, 50), 20);
    let polygon = new geometry.Quad(vector2(0, 0), vector2(0, 0), vector2(40, 0), vector2(40, 40), vector2(0, 40));
    const overlap = new geometry.Overlap();
    expect(geometry.polygonCircleOverlap(polygon, circle1)).toBe(true);
    let collided = geometry.polygonCircleOverlap(polygon, circle1, overlap);
    expect(collided).toBe(true);
    expect(overlap.distance.toFixed(2)).toBe('5.86');
    expect(overlap.vector.x.toFixed(2)).toBe('4.14');
    expect(overlap.vector.y.toFixed(2)).toBe('4.14');
    circle1.setOffset(vector2(10, 10));
    expect(geometry.polygonCircleOverlap(polygon, circle1)).toBe(false);
    overlap.clear();
    collided = geometry.polygonCircleOverlap(polygon, circle1, overlap);
    expect(collided).toBe(false);
    polygon = new geometry.Box(vector2(1000, 1000), 100, 0).toQuad();
    circle1.setOffset(vector2());
    expect(geometry.polygonCircleOverlap(polygon, circle1)).toBe(false);
    overlap.clear();
    collided = geometry.polygonCircleOverlap(polygon, circle1, overlap);
    expect(collided).toBe(false);
    polygon = new geometry.Box(vector2(50, 50), 100, 0).toQuad();
    expect(geometry.polygonCircleOverlap(polygon, circle1)).toBe(true);
    overlap.clear();
    collided = geometry.polygonCircleOverlap(polygon, circle1, overlap);
    expect(collided).toBe(true);
    expect(overlap.distance.toFixed(2)).toBe('20.00');

    polygon = new geometry.Box(vector2(0, 0), 100).toQuad();
    const circle2 = new geometry.Circle(vector2(50, 50), 25);
    overlap.clear();
    collided = geometry.polygonCircleOverlap(polygon, circle2, overlap);
    expect(collided).toBe(true);
    expect(overlap.A).toBe(polygon);
    expect(overlap.B).toBe(circle2);
    expect(overlap.aInB).toBe(false);
    expect(overlap.bInA).toBe(true);
    expect(overlap.distance.toFixed(2)).toBe('75.00');
    expect(overlap.normal).toEqual(vector2(0, -1));
    expect(overlap.vector).toEqual(vector2(0, -75));

    // NOTE: middle voronoi distance too far edge case
    polygon = new geometry.Polygon(vector2(), vector2(), vector2(-0.01, 10));
    const circle3 = new geometry.Circle(vector2(10, 10), 1);
    overlap.clear();
    collided = geometry.polygonCircleOverlap(polygon, circle3, overlap);
    expect(collided).toBe(false);
  });

  it('.polygonsOverlap', () => {
    const polygon1 = new geometry.Quad(vector2(0, 0), vector2(0, 0), vector2(40, 0), vector2(40, 40), vector2(0, 40));
    const polygon2 = new geometry.Triangle(vector2(30, 0), vector2(0, 0), vector2(30, 0), vector2(0, 30));
    const overlap = new geometry.Overlap();
    expect(geometry.polygonsOverlap(polygon1, polygon2)).toBe(true);
    expect(geometry.polygonsOverlap(polygon2, polygon1)).toBe(true);

    const collided = geometry.polygonsOverlap(polygon1, polygon2, overlap);
    expect(collided).toBe(true);
    expect(overlap.A).toBe(polygon1);
    expect(overlap.B).toBe(polygon2);
    expect(overlap.aInB).toBe(false);
    expect(overlap.bInA).toBe(false);
    expect(overlap.distance).toBe(10);
    expect(overlap.normal).toEqual(vector2(1, -0));
    expect(overlap.vector.x).toBe(10);
    expect(overlap.vector.y).toBe(-0);

    overlap.clear();
    geometry.polygonsOverlap(polygon2, polygon1, overlap);
    expect(overlap.A).toBe(polygon2);
    expect(overlap.B).toBe(polygon1);
    expect(overlap.aInB).toBe(false);
    expect(overlap.bInA).toBe(false);
    expect(overlap.distance).toBe(10);
    expect(overlap.normal).toEqual(vector2(-1, -0));
    expect(overlap.vector.x).toBe(-10);
    expect(overlap.vector.y).toBe(-0);

    const box1 = new geometry.Box(vector2(0, 0), 20, 20).toQuad();
    const box2 = new geometry.Box(vector2(100, 100), 20, 20).toQuad();
    expect(geometry.polygonsOverlap(box1, box2)).toBe(false);

    const box3 = new geometry.Box(vector2(5, 5), 10).toQuad();

    overlap.clear();
    geometry.polygonsOverlap(box1, box3, overlap);
    expect(overlap.A).toBe(box1);
    expect(overlap.B).toBe(box3);
    expect(overlap.aInB).toBe(false);
    expect(overlap.bInA).toBe(true);
    expect(overlap.distance).toBe(15);
    expect(overlap.normal).toEqual(vector2(-0, 1));
    expect(overlap.vector.x).toBe(-0);
    expect(overlap.vector.y).toBe(15);

    overlap.clear();
    geometry.polygonsOverlap(box3, box1, overlap);
    expect(overlap.A).toBe(box3);
    expect(overlap.B).toBe(box1);
    expect(overlap.aInB).toBe(true);
    expect(overlap.bInA).toBe(false);
    expect(overlap.distance).toBe(15);
    expect(overlap.normal).toEqual(vector2(-0, 1));
    expect(overlap.vector.x).toBe(-0);
    expect(overlap.vector.y).toBe(15);
  });
});
