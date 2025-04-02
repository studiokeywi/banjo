import { epsilon, halfTau, quarterTau } from '#🪕/math/constants';
import type { Vector2 } from '#🪕/math/v2';
import * as v2 from '#🪕/math/v2';
import { describe, expect, it } from 'vitest';

describe('v2 (module)', () => {
  it('instanceof', () => {
    expect(v2.zero()).instanceOf(v2.vector2);
  });

  it('.add', () => {
    expect(v2.add(v2.right(), v2.down())).toEqual<Vector2>(v2.one());
    const outVec = v2.vector2();
    expect(outVec).toEqual<Vector2>(v2.zero());
    v2.add(v2.right(), v2.down(), outVec);
    expect(outVec).toEqual<Vector2>(v2.one());
    expect(v2.add(v2.zero(), 1)).toEqual<Vector2>(v2.one());
    outVec[0] = outVec[1] = 0;
    v2.add(v2.zero(), 1, outVec);
    expect(outVec).toEqual<Vector2>(v2.one());
  });

  it('.angleBetween', () => {
    expect(v2.angleBetween(v2.up(), v2.right())).toEqual<number>(quarterTau);
    expect(v2.angleBetween(v2.up(), v2.left())).toEqual<number>(quarterTau);
    expect(v2.angleBetween(v2.up(), v2.up())).toEqual<number>(0);
    expect(v2.angleBetween(v2.up(), v2.down())).toEqual<number>(halfTau);
  });

  it('.distance', () => {
    expect(v2.distance(v2.vector2(1, 2), v2.vector2(4, 6))).toEqual<number>(5);
  });

  it('.distanceSq', () => {
    expect(v2.distanceSq(v2.vector2(1, 2), v2.vector2(4, 6))).toEqual<number>(25);
  });

  it('.dot', () => {
    expect(v2.dot(v2.vector2(1, 2), v2.vector2(4, 6))).toEqual<number>(16);
  });

  it('.hash', () => {
    expect(v2.hash(v2.origin())).toEqual<number>(0);
    expect(v2.hash(v2.up())).toEqual<number>(1);
    expect(v2.hash(v2.left())).toEqual<number>(2);
    expect(v2.hash(v2.upLeft())).toEqual<number>(3);
    expect(v2.hash(v2.down())).toEqual<number>(4);
    expect(v2.hash(v2.downLeft())).toEqual<number>(5);
    expect(v2.hash(v2.right())).toEqual<number>(6);
    expect(v2.hash(v2.upRight())).toEqual<number>(7);
    expect(v2.hash(v2.downRight())).toEqual<number>(8);
  });

  it('.length', () => {
    expect(v2.length(v2.vector2(0, 2))).toEqual<number>(2);
  });

  it('.lengthSq', () => {
    expect(v2.lengthSq(v2.vector2(0, 2))).toEqual<number>(4);
  });

  it('.lerpVectors', () => {
    expect(v2.lerpVectors(v2.zero(), v2.one(), -1)).toEqual<Vector2>(v2.zero());
    expect(v2.lerpVectors(v2.zero(), v2.one(), 0)).toEqual<Vector2>(v2.zero());
    expect(v2.lerpVectors(v2.zero(), v2.one(), 0.5)).toEqual<Vector2>(v2.vector2(0.5, 0.5));
    expect(v2.lerpVectors(v2.zero(), v2.one(), 1)).toEqual<Vector2>(v2.one());
    expect(v2.lerpVectors(v2.zero(), v2.one(), 2)).toEqual<Vector2>(v2.one());
  });

  it('.lerpVectorsUnclamped', () => {
    expect(v2.lerpVectorsUnclamped(v2.zero(), v2.one(), -1)).toEqual<Vector2>(v2.vector2(-1, -1));
    expect(v2.lerpVectorsUnclamped(v2.zero(), v2.one(), 0)).toEqual<Vector2>(v2.zero());
    expect(v2.lerpVectorsUnclamped(v2.zero(), v2.one(), 0.5)).toEqual<Vector2>(v2.vector2(0.5, 0.5));
    expect(v2.lerpVectorsUnclamped(v2.zero(), v2.one(), 1)).toEqual<Vector2>(v2.one());
    expect(v2.lerpVectorsUnclamped(v2.zero(), v2.one(), 2)).toEqual<Vector2>(v2.vector2(2, 2));
  });

  it('.normProject', () => {
    expect(v2.normProject(v2.up(), v2.right())).toEqual<Vector2>(v2.zero());
  });

  it('.normReflect', () => {
    expect(v2.normReflect(v2.up(), v2.right())).toEqual<Vector2>(v2.down());
  });

  it('.normalize', () => {
    const vec = v2.vector2(69, 420);
    expect(v2.normalize(vec)).toEqual<Vector2>(v2.vector2(0.162112586908358, 0.9867722681378314));
    v2.normalize(vec, vec);
    expect(vec).toEqual<Vector2>(v2.vector2(0.162112586908358, 0.9867722681378314));

    expect(v2.normalize(v2.vector2(0, epsilon))).toEqual<Vector2>(v2.zero());
  });

  it('.perpendicular', () => {
    expect(v2.perpendicular(v2.up())).toEqual<Vector2>(v2.vector2(-1, -0));
    const outVec = v2.vector2();
    v2.perpendicular(v2.up(), outVec);
    expect(outVec).toEqual<Vector2>(v2.vector2(-1, -0));
  });

  it('.project', () => {
    expect(v2.project(v2.up(), v2.right())).toEqual<Vector2>(v2.zero());
  });

  it('.reflect', () => {
    expect(v2.reflect(v2.vector2(1, 2), v2.right())).toEqual<Vector2>(v2.vector2(1, -2));
  });

  it('.reverse', () => {
    expect(v2.reverse(v2.left())).toEqual<Vector2>(v2.vector2(1, -0));
    const outVec = v2.vector2();
    v2.reverse(v2.left(), outVec);
    expect(outVec).toEqual<Vector2>(v2.vector2(1, -0));
  });

  it('.rotate', () => {
    expect(v2.rotate(v2.right(), quarterTau)).toEqual<Vector2>(v2.up());
    expect(v2.rotate(v2.right(), -quarterTau)).toEqual<Vector2>(v2.down());
    const vec = v2.vector2();
    v2.rotate(v2.right(), halfTau, vec);
    expect(vec).toEqual<Vector2>(v2.left());
  });

  it('.scale', () => {
    expect(v2.scale(v2.one(), 2)).toEqual<Vector2>(v2.vector2(2, 2));
    expect(v2.scale(v2.one(), 2, 3)).toEqual<Vector2>(v2.vector2(2, 3));
    const vec = v2.vector2();
    v2.scale(v2.one(), 3, vec);
    expect(vec).toEqual<Vector2>(v2.vector2(3, 3));
    v2.scale(v2.one(), 3, 4, vec);
    expect(vec).toEqual<Vector2>(v2.vector2(3, 4));
  });

  it('.subtract', () => {
    expect(v2.subtract(v2.one(), v2.down())).toEqual<Vector2>(v2.right());
    const outVec = v2.vector2();
    expect(outVec).toEqual<Vector2>(v2.zero());
    v2.subtract(v2.one(), v2.down(), outVec);
    expect(outVec).toEqual<Vector2>(v2.right());
    expect(v2.subtract(v2.one(), 1)).toEqual<Vector2>(v2.zero());
    outVec[0] = outVec[1] = 0;
    v2.subtract(v2.vector2(2, 2), 1, outVec);
    expect(outVec).toEqual<Vector2>(v2.one());
  });

  describe('.vector2', () => {
    const expected = "Invalid arguments passed to 'vector2'";

    it('throws', () => {
      expect(() => v2.vector2({} as never)).toThrowError(expected);
      expect(() => v2.vector2(null as never)).toThrowError(expected);
      expect(() => v2.vector2(false as never)).toThrowError(expected);
      expect(() => v2.vector2(42, false as never)).toThrowError(expected);
      expect(() => v2.vector2(42, 'false' as never)).toThrowError(expected);
      expect(() => v2.vector2(false as never, 42)).toThrowError(expected);
      expect(() => v2.vector2('false' as never, 42)).toThrowError(expected);
      expect(() => v2.vector2('42' as never, '42' as never)).toThrowError(expected);
    });

    it("> doesn't throw", () => {
      expect(() => v2.vector2()).not.toThrowError(expected);
      expect(() => v2.vector2(v2.vector2(1, 2))).not.toThrowError(expected);
      expect(() => v2.vector2(3, 4)).not.toThrowError(expected);
    });
  });

  describe('misc', () => {
    it('unit vectors', () => {
      expect(v2.upLeft()).toEqual<Vector2>(v2.vector2(-1, -1));
      expect(v2.up()).toEqual<Vector2>(v2.vector2(0, -1));
      expect(v2.upRight()).toEqual<Vector2>(v2.vector2(1, -1));
      expect(v2.left()).toEqual<Vector2>(v2.vector2(-1, 0));
      expect(v2.origin()).toEqual<Vector2>(v2.vector2());
      expect(v2.right()).toEqual<Vector2>(v2.vector2(1, 0));
      expect(v2.downLeft()).toEqual<Vector2>(v2.vector2(-1, 1));
      expect(v2.down()).toEqual<Vector2>(v2.vector2(0, 1));
      expect(v2.downRight()).toEqual<Vector2>(v2.vector2(1, 1));
      expect(v2.zero()).toEqual<Vector2>(v2.vector2(0, 0));
      expect(v2.one()).toEqual<Vector2>(v2.vector2(1, 1));
    });

    it('value manipulation', () => {
      const vector: Vector2 = v2.vector2();
      expect(vector.x).toEqual<number>(vector[0]);
      expect(vector[0]).toEqual<number>(vector.x);
      expect(vector.y).toEqual<number>(vector[1]);
      expect(vector[1]).toEqual<number>(vector.y);
      [vector.x, vector.y] = [vector[1], vector[0]];
      [vector[0], vector[1]] = [vector.y, vector.x];
      expect(vector.x).toEqual<number>(vector[0]);
      expect(vector[0]).toEqual<number>(vector.x);
      expect(vector.y).toEqual<number>(vector[1]);
      expect(vector[1]).toEqual<number>(vector.y);
    });
  });
});
