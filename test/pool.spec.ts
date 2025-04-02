// @vitest-environment happy-dom
import type { Vector2 } from '#🪕/math/v2';
import { vector2 } from '#🪕/math/v2';
import { createPool } from '#🪕/pool';
import { describe, expect, it, vi } from 'vitest';

const init = vi.fn(function init(this: Vector2, x: number = 0, y: number = 0) {
  this.x = x;
  this.y = y;
});
const reset = vi.fn(function reset(this: Vector2) {
  this.x = this.y = 0;
});

describe('createPool (export)', () => {
  it('pooled objects API', () => {
    const vectorPool = createPool<Vector2, [x?: number, y?: number]>({ size: 10, init, reset, spawn: vector2 });
    expect(vectorPool.size).toBe(10);
    {
      using tmp = vectorPool.next();
      expect(tmp).instanceOf(vector2);
      expect(vectorPool.size).toBe(9);
    }
    expect(reset).toBeCalledTimes(1);
    expect(vectorPool.size).toBe(10);
    const pooled = Array.from({ length: 10 }, () => vectorPool.next());
    expect(vectorPool.size).toBe(0);
    expect(() => vectorPool.next()).toThrow(new Error(' TODO: better empty pool error message'));
    pooled.forEach(member => {
      member[Symbol.dispose]();
    });
  });
});
