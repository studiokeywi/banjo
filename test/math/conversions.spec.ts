import { eighthTau, tau } from '#🪕/math/constants';
import * as conversions from '#🪕/math/conversions';
import { describe, expect, it } from 'vitest';

describe('conversions (module)', () => {
  it('.clamp', () => {
    expect(conversions.clamp(-1)).toBe(0);
    expect(conversions.clamp(2)).toBe(1);
    expect(conversions.clamp(eighthTau)).toBe(eighthTau);
    expect(conversions.clamp(-2, -1, 1)).toBe(-1);
    expect(conversions.clamp(2, -1, 1)).toBe(1);
  });

  it('.degToRad', () => {
    expect(conversions.degToRad(-360)).toEqual(-tau);
    expect(conversions.degToRad(0)).toEqual(0);
    expect(conversions.degToRad(90)).toEqual(Math.PI / 2);
    expect(conversions.degToRad(180)).toEqual(Math.PI);
    expect(conversions.degToRad(270)).toEqual(3 * (Math.PI / 2));
    expect(conversions.degToRad(360)).toEqual(tau);
    expect(conversions.degToRad(720)).toEqual(tau * 2);
  });

  it('.radToDeg', () => {
    expect(conversions.radToDeg(-tau)).toEqual(-360);
    expect(conversions.radToDeg(0)).toEqual(0);
    expect(conversions.radToDeg(Math.PI / 2)).toEqual(90);
    expect(conversions.radToDeg(Math.PI)).toEqual(180);
    expect(conversions.radToDeg(3 * (Math.PI / 2))).toEqual(270);
    expect(conversions.radToDeg(tau)).toEqual(360);
    expect(conversions.radToDeg(tau * 2)).toEqual(720);
  });
});
