import * as easing from '#🪕/math/easing';
import { describe, expect, it } from 'vitest';

describe('easing (module)', () => {
  describe('easeIn', () => {
    it('back', () => {
      expect(easing.easeInBack(0)).toBeCloseTo(0, 8);
      expect(easing.easeInBack(0.1)).toBeCloseTo(-0.01431422, 8);
      expect(easing.easeInBack(0.2)).toBeCloseTo(-0.04645056, 8);
      expect(easing.easeInBack(0.3)).toBeCloseTo(-0.08019954, 8);
      expect(easing.easeInBack(0.4)).toBeCloseTo(-0.09935168, 8);
      expect(easing.easeInBack(0.5)).toBeCloseTo(-0.0876975, 8);
      expect(easing.easeInBack(0.6)).toBeCloseTo(-0.02902752, 8);
      expect(easing.easeInBack(0.7)).toBeCloseTo(0.09286774, 8);
      expect(easing.easeInBack(0.8)).toBeCloseTo(0.29419776, 8);
      expect(easing.easeInBack(0.9)).toBeCloseTo(0.59117202, 8);
      expect(easing.easeInBack(1)).toBeCloseTo(1, 8);
    });

    it('bounce', () => {
      expect(easing.easeInBounce(0)).toBeCloseTo(0, 8);
      expect(easing.easeInBounce(0.1)).toBeCloseTo(0.011875, 8);
      expect(easing.easeInBounce(0.2)).toBeCloseTo(0.06, 8);
      expect(easing.easeInBounce(0.3)).toBeCloseTo(0.069375, 8);
      expect(easing.easeInBounce(0.4)).toBeCloseTo(0.2275, 8);
      expect(easing.easeInBounce(0.5)).toBeCloseTo(0.234375, 8);
      expect(easing.easeInBounce(0.6)).toBeCloseTo(0.09, 8);
      expect(easing.easeInBounce(0.7)).toBeCloseTo(0.319375, 8);
      expect(easing.easeInBounce(0.8)).toBeCloseTo(0.6975, 8);
      expect(easing.easeInBounce(0.9)).toBeCloseTo(0.924375, 8);
      expect(easing.easeInBounce(1)).toBeCloseTo(1, 8);
    });

    it('circular', () => {
      expect(easing.easeInCircular(0)).toBeCloseTo(0, 8);
      expect(easing.easeInCircular(0.1)).toBeCloseTo(0.00501256, 8);
      expect(easing.easeInCircular(0.2)).toBeCloseTo(0.0202041, 8);
      expect(easing.easeInCircular(0.3)).toBeCloseTo(0.0460608, 8);
      expect(easing.easeInCircular(0.4)).toBeCloseTo(0.08348486, 8);
      expect(easing.easeInCircular(0.5)).toBeCloseTo(0.1339746, 8);
      expect(easing.easeInCircular(0.6)).toBeCloseTo(0.2, 8);
      expect(easing.easeInCircular(0.7)).toBeCloseTo(0.28585716, 8);
      expect(easing.easeInCircular(0.8)).toBeCloseTo(0.4, 8);
      expect(easing.easeInCircular(0.9)).toBeCloseTo(0.56411011, 8);
      expect(easing.easeInCircular(1)).toBeCloseTo(1, 8);
    });

    it('cubic', () => {
      expect(easing.easeInCubic(0)).toBeCloseTo(0, 8);
      expect(easing.easeInCubic(0.1)).toBeCloseTo(0.001, 8);
      expect(easing.easeInCubic(0.2)).toBeCloseTo(0.008, 8);
      expect(easing.easeInCubic(0.3)).toBeCloseTo(0.027, 8);
      expect(easing.easeInCubic(0.4)).toBeCloseTo(0.064, 8);
      expect(easing.easeInCubic(0.5)).toBeCloseTo(0.125, 8);
      expect(easing.easeInCubic(0.6)).toBeCloseTo(0.216, 8);
      expect(easing.easeInCubic(0.7)).toBeCloseTo(0.343, 8);
      expect(easing.easeInCubic(0.8)).toBeCloseTo(0.512, 8);
      expect(easing.easeInCubic(0.9)).toBeCloseTo(0.729, 8);
      expect(easing.easeInCubic(1)).toBeCloseTo(1, 8);
    });

    it('elastic', () => {
      expect(easing.easeInElastic(0)).toBeCloseTo(0, 8);
      expect(easing.easeInElastic(0.1)).toBeCloseTo(0.00195313, 8);
      expect(easing.easeInElastic(0.2)).toBeCloseTo(-0.00195313, 8);
      expect(easing.easeInElastic(0.3)).toBeCloseTo(-0.00390625, 8);
      expect(easing.easeInElastic(0.4)).toBeCloseTo(0.015625, 8);
      expect(easing.easeInElastic(0.5)).toBeCloseTo(-0.015625, 8);
      expect(easing.easeInElastic(0.6)).toBeCloseTo(-0.03125, 8);
      expect(easing.easeInElastic(0.7)).toBeCloseTo(0.125, 8);
      expect(easing.easeInElastic(0.8)).toBeCloseTo(-0.125, 8);
      expect(easing.easeInElastic(0.9)).toBeCloseTo(-0.25, 8);
      expect(easing.easeInElastic(1)).toBeCloseTo(1, 8);
    });

    it('exponential', () => {
      expect(easing.easeInExponential(0)).toBeCloseTo(0, 8);
      expect(easing.easeInExponential(0.1)).toBeCloseTo(0.00195313, 8);
      expect(easing.easeInExponential(0.2)).toBeCloseTo(0.00390625, 8);
      expect(easing.easeInExponential(0.3)).toBeCloseTo(0.0078125, 8);
      expect(easing.easeInExponential(0.4)).toBeCloseTo(0.015625, 8);
      expect(easing.easeInExponential(0.5)).toBeCloseTo(0.03125, 8);
      expect(easing.easeInExponential(0.6)).toBeCloseTo(0.0625, 8);
      expect(easing.easeInExponential(0.7)).toBeCloseTo(0.125, 8);
      expect(easing.easeInExponential(0.8)).toBeCloseTo(0.25, 8);
      expect(easing.easeInExponential(0.9)).toBeCloseTo(0.5, 8);
      expect(easing.easeInExponential(1)).toBeCloseTo(1, 8);
    });

    it('nthPolynomial', () => {
      const randValue = Math.random();
      const randLow = randValue / 2;
      expect(easing.easeInQuad(randLow)).toBe(easing.easeInNthPolynomial(2)(randLow));
      expect(easing.easeInCubic(randLow)).toBe(easing.easeInNthPolynomial(3)(randLow));
      expect(easing.easeInQuart(randLow)).toBe(easing.easeInNthPolynomial(4)(randLow));
      expect(easing.easeInQuint(randLow)).toBe(easing.easeInNthPolynomial(5)(randLow));
      const randHigh = randLow + 0.5;
      expect(easing.easeInQuad(randHigh)).toBe(easing.easeInNthPolynomial(2)(randHigh));
      expect(easing.easeInCubic(randHigh)).toBe(easing.easeInNthPolynomial(3)(randHigh));
      expect(easing.easeInQuart(randHigh)).toBe(easing.easeInNthPolynomial(4)(randHigh));
      expect(easing.easeInQuint(randHigh)).toBe(easing.easeInNthPolynomial(5)(randHigh));
    });

    it('quad', () => {
      expect(easing.easeInQuad(0)).toBeCloseTo(0, 8);
      expect(easing.easeInQuad(0.1)).toBeCloseTo(0.01, 8);
      expect(easing.easeInQuad(0.2)).toBeCloseTo(0.04, 8);
      expect(easing.easeInQuad(0.3)).toBeCloseTo(0.09, 8);
      expect(easing.easeInQuad(0.4)).toBeCloseTo(0.16, 8);
      expect(easing.easeInQuad(0.5)).toBeCloseTo(0.25, 8);
      expect(easing.easeInQuad(0.6)).toBeCloseTo(0.36, 8);
      expect(easing.easeInQuad(0.7)).toBeCloseTo(0.49, 8);
      expect(easing.easeInQuad(0.8)).toBeCloseTo(0.64, 8);
      expect(easing.easeInQuad(0.9)).toBeCloseTo(0.81, 8);
      expect(easing.easeInQuad(1)).toBeCloseTo(1, 8);
    });

    it('quart', () => {
      expect(easing.easeInQuart(0)).toBeCloseTo(0, 8);
      expect(easing.easeInQuart(0.1)).toBeCloseTo(0.0001, 8);
      expect(easing.easeInQuart(0.2)).toBeCloseTo(0.0016, 8);
      expect(easing.easeInQuart(0.3)).toBeCloseTo(0.0081, 8);
      expect(easing.easeInQuart(0.4)).toBeCloseTo(0.0256, 8);
      expect(easing.easeInQuart(0.5)).toBeCloseTo(0.0625, 8);
      expect(easing.easeInQuart(0.6)).toBeCloseTo(0.1296, 8);
      expect(easing.easeInQuart(0.7)).toBeCloseTo(0.2401, 8);
      expect(easing.easeInQuart(0.8)).toBeCloseTo(0.4096, 8);
      expect(easing.easeInQuart(0.9)).toBeCloseTo(0.6561, 8);
      expect(easing.easeInQuart(1)).toBeCloseTo(1, 8);
    });

    it('quint', () => {
      expect(easing.easeInQuint(0)).toBeCloseTo(0, 8);
      expect(easing.easeInQuint(0.1)).toBeCloseTo(0.00001, 8);
      expect(easing.easeInQuint(0.2)).toBeCloseTo(0.00032, 8);
      expect(easing.easeInQuint(0.3)).toBeCloseTo(0.00243, 8);
      expect(easing.easeInQuint(0.4)).toBeCloseTo(0.01024, 8);
      expect(easing.easeInQuint(0.5)).toBeCloseTo(0.03125, 8);
      expect(easing.easeInQuint(0.6)).toBeCloseTo(0.07776, 8);
      expect(easing.easeInQuint(0.7)).toBeCloseTo(0.16807, 8);
      expect(easing.easeInQuint(0.8)).toBeCloseTo(0.32768, 8);
      expect(easing.easeInQuint(0.9)).toBeCloseTo(0.59049, 8);
      expect(easing.easeInQuint(1)).toBeCloseTo(1, 8);
    });

    it('sine', () => {
      expect(easing.easeInSine(0)).toBeCloseTo(0, 8);
      expect(easing.easeInSine(0.1)).toBeCloseTo(0.01231166, 8);
      expect(easing.easeInSine(0.2)).toBeCloseTo(0.04894348, 8);
      expect(easing.easeInSine(0.3)).toBeCloseTo(0.10899348, 8);
      expect(easing.easeInSine(0.4)).toBeCloseTo(0.19098301, 8);
      expect(easing.easeInSine(0.5)).toBeCloseTo(0.29289322, 8);
      expect(easing.easeInSine(0.6)).toBeCloseTo(0.41221475, 8);
      expect(easing.easeInSine(0.7)).toBeCloseTo(0.5460095, 8);
      expect(easing.easeInSine(0.8)).toBeCloseTo(0.69098301, 8);
      expect(easing.easeInSine(0.9)).toBeCloseTo(0.84356553, 8);
      expect(easing.easeInSine(1)).toBeCloseTo(1, 8);
    });
  });

  describe('easeInOut', () => {
    it('back', () => {
      expect(easing.easeInOutBack(0)).toBeCloseTo(-0, 8);
      expect(easing.easeInOutBack(0.1)).toBeCloseTo(-0.03751855, 8);
      expect(easing.easeInOutBack(0.2)).toBeCloseTo(-0.09255566, 8);
      expect(easing.easeInOutBack(0.3)).toBeCloseTo(-0.07883348, 8);
      expect(easing.easeInOutBack(0.4)).toBeCloseTo(0.08992579, 8);
      expect(easing.easeInOutBack(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutBack(0.6)).toBeCloseTo(0.91007421, 8);
      expect(easing.easeInOutBack(0.7)).toBeCloseTo(1.07883348, 8);
      expect(easing.easeInOutBack(0.8)).toBeCloseTo(1.09255566, 8);
      expect(easing.easeInOutBack(0.9)).toBeCloseTo(1.03751855, 8);
      expect(easing.easeInOutBack(1)).toBeCloseTo(1, 8);
    });

    it('bounce', () => {
      expect(easing.easeInOutBounce(0)).toBeCloseTo(0, 8);
      expect(easing.easeInOutBounce(0.1)).toBeCloseTo(0.03, 8);
      expect(easing.easeInOutBounce(0.2)).toBeCloseTo(0.11375, 8);
      expect(easing.easeInOutBounce(0.3)).toBeCloseTo(0.045, 8);
      expect(easing.easeInOutBounce(0.4)).toBeCloseTo(0.34875, 8);
      expect(easing.easeInOutBounce(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutBounce(0.6)).toBeCloseTo(0.65125, 8);
      expect(easing.easeInOutBounce(0.7)).toBeCloseTo(0.955, 8);
      expect(easing.easeInOutBounce(0.8)).toBeCloseTo(0.88625, 8);
      expect(easing.easeInOutBounce(0.9)).toBeCloseTo(0.97, 8);
      expect(easing.easeInOutBounce(1)).toBeCloseTo(1, 8);
    });

    it('circular', () => {
      expect(easing.easeInOutCircular(0)).toBeCloseTo(0, 8);
      expect(easing.easeInOutCircular(0.1)).toBeCloseTo(0.01010205, 8);
      expect(easing.easeInOutCircular(0.2)).toBeCloseTo(0.04174243, 8);
      expect(easing.easeInOutCircular(0.3)).toBeCloseTo(0.1, 8);
      expect(easing.easeInOutCircular(0.4)).toBeCloseTo(0.2, 8);
      expect(easing.easeInOutCircular(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutCircular(0.6)).toBeCloseTo(0.8, 8);
      expect(easing.easeInOutCircular(0.7)).toBeCloseTo(0.9, 8);
      expect(easing.easeInOutCircular(0.8)).toBeCloseTo(0.95825757, 8);
      expect(easing.easeInOutCircular(0.9)).toBeCloseTo(0.98989795, 8);
      expect(easing.easeInOutCircular(1)).toBeCloseTo(1, 8);
    });

    it('cubic', () => {
      expect(easing.easeInOutCubic(0)).toBeCloseTo(0, 8);
      expect(easing.easeInOutCubic(0.1)).toBeCloseTo(0.004, 8);
      expect(easing.easeInOutCubic(0.2)).toBeCloseTo(0.032, 8);
      expect(easing.easeInOutCubic(0.3)).toBeCloseTo(0.108, 8);
      expect(easing.easeInOutCubic(0.4)).toBeCloseTo(0.256, 8);
      expect(easing.easeInOutCubic(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutCubic(0.6)).toBeCloseTo(0.744, 8);
      expect(easing.easeInOutCubic(0.7)).toBeCloseTo(0.892, 8);
      expect(easing.easeInOutCubic(0.8)).toBeCloseTo(0.968, 8);
      expect(easing.easeInOutCubic(0.9)).toBeCloseTo(0.996, 8);
      expect(easing.easeInOutCubic(1)).toBeCloseTo(1, 8);
    });

    it('elastic', () => {
      expect(easing.easeInOutElastic(0)).toBeCloseTo(0, 8);
      expect(easing.easeInOutElastic(0.1)).toBeCloseTo(0.00033916, 8);
      expect(easing.easeInOutElastic(0.2)).toBeCloseTo(-0.00390625, 8);
      expect(easing.easeInOutElastic(0.3)).toBeCloseTo(0.02393889, 8);
      expect(easing.easeInOutElastic(0.4)).toBeCloseTo(-0.11746158, 8);
      expect(easing.easeInOutElastic(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutElastic(0.6)).toBeCloseTo(1.11746158, 8);
      expect(easing.easeInOutElastic(0.7)).toBeCloseTo(0.97606111, 8);
      expect(easing.easeInOutElastic(0.8)).toBeCloseTo(1.00390625, 8);
      expect(easing.easeInOutElastic(0.9)).toBeCloseTo(0.99966084, 8);
      expect(easing.easeInOutElastic(1)).toBeCloseTo(1, 8);
    });

    it('exponential', () => {
      expect(easing.easeInOutExponential(0)).toBeCloseTo(0, 8);
      expect(easing.easeInOutExponential(0.1)).toBeCloseTo(0.00195313, 8);
      expect(easing.easeInOutExponential(0.2)).toBeCloseTo(0.0078125, 8);
      expect(easing.easeInOutExponential(0.3)).toBeCloseTo(0.03125, 8);
      expect(easing.easeInOutExponential(0.4)).toBeCloseTo(0.125, 8);
      expect(easing.easeInOutExponential(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutExponential(0.6)).toBeCloseTo(0.875, 8);
      expect(easing.easeInOutExponential(0.7)).toBeCloseTo(0.96875, 8);
      expect(easing.easeInOutExponential(0.8)).toBeCloseTo(0.9921875, 8);
      expect(easing.easeInOutExponential(0.9)).toBeCloseTo(0.99804688, 8);
      expect(easing.easeInOutExponential(1)).toBeCloseTo(1, 8);
    });

    it('nthPolynomial', () => {
      const randValue = Math.random();
      const randLow = randValue / 2;
      expect(easing.easeInOutQuad(randLow)).toBe(easing.easeInOutNthPolynomial(2)(randLow));
      expect(easing.easeInOutCubic(randLow)).toBe(easing.easeInOutNthPolynomial(3)(randLow));
      expect(easing.easeInOutQuart(randLow)).toBe(easing.easeInOutNthPolynomial(4)(randLow));
      expect(easing.easeInOutQuint(randLow)).toBe(easing.easeInOutNthPolynomial(5)(randLow));
      const randHigh = randLow + 0.5;
      expect(easing.easeInOutQuad(randHigh)).toBe(easing.easeInOutNthPolynomial(2)(randHigh));
      expect(easing.easeInOutCubic(randHigh)).toBe(easing.easeInOutNthPolynomial(3)(randHigh));
      expect(easing.easeInOutQuart(randHigh)).toBe(easing.easeInOutNthPolynomial(4)(randHigh));
      expect(easing.easeInOutQuint(randHigh)).toBe(easing.easeInOutNthPolynomial(5)(randHigh));
    });

    it('quad', () => {
      expect(easing.easeInOutQuad(0)).toBeCloseTo(0, 8);
      expect(easing.easeInOutQuad(0.1)).toBeCloseTo(0.02, 8);
      expect(easing.easeInOutQuad(0.2)).toBeCloseTo(0.08, 8);
      expect(easing.easeInOutQuad(0.3)).toBeCloseTo(0.18, 8);
      expect(easing.easeInOutQuad(0.4)).toBeCloseTo(0.32, 8);
      expect(easing.easeInOutQuad(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutQuad(0.6)).toBeCloseTo(0.68, 8);
      expect(easing.easeInOutQuad(0.7)).toBeCloseTo(0.82, 8);
      expect(easing.easeInOutQuad(0.8)).toBeCloseTo(0.92, 8);
      expect(easing.easeInOutQuad(0.9)).toBeCloseTo(0.98, 8);
      expect(easing.easeInOutQuad(1)).toBeCloseTo(1, 8);
    });

    it('quart', () => {
      expect(easing.easeInOutQuart(0)).toBeCloseTo(0, 8);
      expect(easing.easeInOutQuart(0.1)).toBeCloseTo(0.0008, 8);
      expect(easing.easeInOutQuart(0.2)).toBeCloseTo(0.0128, 8);
      expect(easing.easeInOutQuart(0.3)).toBeCloseTo(0.0648, 8);
      expect(easing.easeInOutQuart(0.4)).toBeCloseTo(0.2048, 8);
      expect(easing.easeInOutQuart(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutQuart(0.6)).toBeCloseTo(0.7952, 8);
      expect(easing.easeInOutQuart(0.7)).toBeCloseTo(0.9352, 8);
      expect(easing.easeInOutQuart(0.8)).toBeCloseTo(0.9872, 8);
      expect(easing.easeInOutQuart(0.9)).toBeCloseTo(0.9992, 8);
      expect(easing.easeInOutQuart(1)).toBeCloseTo(1, 8);
    });

    it('quint', () => {
      expect(easing.easeInOutQuint(0)).toBeCloseTo(0, 8);
      expect(easing.easeInOutQuint(0.1)).toBeCloseTo(0.00016, 8);
      expect(easing.easeInOutQuint(0.2)).toBeCloseTo(0.00512, 8);
      expect(easing.easeInOutQuint(0.3)).toBeCloseTo(0.03888, 8);
      expect(easing.easeInOutQuint(0.4)).toBeCloseTo(0.16384, 8);
      expect(easing.easeInOutQuint(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutQuint(0.6)).toBeCloseTo(0.83616, 8);
      expect(easing.easeInOutQuint(0.7)).toBeCloseTo(0.96112, 8);
      expect(easing.easeInOutQuint(0.8)).toBeCloseTo(0.99488, 8);
      expect(easing.easeInOutQuint(0.9)).toBeCloseTo(0.99984, 8);
      expect(easing.easeInOutQuint(1)).toBeCloseTo(1, 8);
    });

    it('sine', () => {
      expect(easing.easeInOutSine(0)).toBeCloseTo(-0, 8);
      expect(easing.easeInOutSine(0.1)).toBeCloseTo(0.02447174, 8);
      expect(easing.easeInOutSine(0.2)).toBeCloseTo(0.0954915, 8);
      expect(easing.easeInOutSine(0.3)).toBeCloseTo(0.20610737, 8);
      expect(easing.easeInOutSine(0.4)).toBeCloseTo(0.3454915, 8);
      expect(easing.easeInOutSine(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.easeInOutSine(0.6)).toBeCloseTo(0.6545085, 8);
      expect(easing.easeInOutSine(0.7)).toBeCloseTo(0.79389263, 8);
      expect(easing.easeInOutSine(0.8)).toBeCloseTo(0.9045085, 8);
      expect(easing.easeInOutSine(0.9)).toBeCloseTo(0.97552826, 8);
      expect(easing.easeInOutSine(1)).toBeCloseTo(1, 8);
    });
  });

  describe('easeOut', () => {
    it('back', () => {
      expect(easing.easeOutBack(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutBack(0.1)).toBeCloseTo(0.40882798, 8);
      expect(easing.easeOutBack(0.2)).toBeCloseTo(0.70580224, 8);
      expect(easing.easeOutBack(0.3)).toBeCloseTo(0.90713226, 8);
      expect(easing.easeOutBack(0.4)).toBeCloseTo(1.02902752, 8);
      expect(easing.easeOutBack(0.5)).toBeCloseTo(1.0876975, 8);
      expect(easing.easeOutBack(0.6)).toBeCloseTo(1.09935168, 8);
      expect(easing.easeOutBack(0.7)).toBeCloseTo(1.08019954, 8);
      expect(easing.easeOutBack(0.8)).toBeCloseTo(1.04645056, 8);
      expect(easing.easeOutBack(0.9)).toBeCloseTo(1.01431422, 8);
      expect(easing.easeOutBack(1)).toBeCloseTo(1, 8);
    });

    it('bounce', () => {
      expect(easing.easeOutBounce(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutBounce(0.1)).toBeCloseTo(0.075625, 8);
      expect(easing.easeOutBounce(0.2)).toBeCloseTo(0.3025, 8);
      expect(easing.easeOutBounce(0.3)).toBeCloseTo(0.680625, 8);
      expect(easing.easeOutBounce(0.4)).toBeCloseTo(0.91, 8);
      expect(easing.easeOutBounce(0.5)).toBeCloseTo(0.765625, 8);
      expect(easing.easeOutBounce(0.6)).toBeCloseTo(0.7725, 8);
      expect(easing.easeOutBounce(0.7)).toBeCloseTo(0.930625, 8);
      expect(easing.easeOutBounce(0.8)).toBeCloseTo(0.94, 8);
      expect(easing.easeOutBounce(0.9)).toBeCloseTo(0.988125, 8);
      expect(easing.easeOutBounce(1)).toBeCloseTo(1, 8);
    });

    it('circular', () => {
      expect(easing.easeOutCircular(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutCircular(0.1)).toBeCloseTo(0.43588989, 8);
      expect(easing.easeOutCircular(0.2)).toBeCloseTo(0.6, 8);
      expect(easing.easeOutCircular(0.3)).toBeCloseTo(0.71414284, 8);
      expect(easing.easeOutCircular(0.4)).toBeCloseTo(0.8, 8);
      expect(easing.easeOutCircular(0.5)).toBeCloseTo(0.8660254, 8);
      expect(easing.easeOutCircular(0.6)).toBeCloseTo(0.91651514, 8);
      expect(easing.easeOutCircular(0.7)).toBeCloseTo(0.9539392, 8);
      expect(easing.easeOutCircular(0.8)).toBeCloseTo(0.9797959, 8);
      expect(easing.easeOutCircular(0.9)).toBeCloseTo(0.99498744, 8);
      expect(easing.easeOutCircular(1)).toBeCloseTo(1, 8);
    });

    it('cubic', () => {
      expect(easing.easeOutCubic(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutCubic(0.1)).toBeCloseTo(0.271, 8);
      expect(easing.easeOutCubic(0.2)).toBeCloseTo(0.488, 8);
      expect(easing.easeOutCubic(0.3)).toBeCloseTo(0.657, 8);
      expect(easing.easeOutCubic(0.4)).toBeCloseTo(0.784, 8);
      expect(easing.easeOutCubic(0.5)).toBeCloseTo(0.875, 8);
      expect(easing.easeOutCubic(0.6)).toBeCloseTo(0.936, 8);
      expect(easing.easeOutCubic(0.7)).toBeCloseTo(0.973, 8);
      expect(easing.easeOutCubic(0.8)).toBeCloseTo(0.992, 8);
      expect(easing.easeOutCubic(0.9)).toBeCloseTo(0.999, 8);
      expect(easing.easeOutCubic(1)).toBeCloseTo(1, 8);
    });

    it('elastic', () => {
      expect(easing.easeOutElastic(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutElastic(0.1)).toBeCloseTo(1.25, 8);
      expect(easing.easeOutElastic(0.2)).toBeCloseTo(1.125, 8);
      expect(easing.easeOutElastic(0.3)).toBeCloseTo(0.875, 8);
      expect(easing.easeOutElastic(0.4)).toBeCloseTo(1.03125, 8);
      expect(easing.easeOutElastic(0.5)).toBeCloseTo(1.015625, 8);
      expect(easing.easeOutElastic(0.6)).toBeCloseTo(0.984375, 8);
      expect(easing.easeOutElastic(0.7)).toBeCloseTo(1.00390625, 8);
      expect(easing.easeOutElastic(0.8)).toBeCloseTo(1.00195313, 8);
      expect(easing.easeOutElastic(0.9)).toBeCloseTo(0.99804688, 8);
      expect(easing.easeOutElastic(1)).toBeCloseTo(1, 8);
    });

    it('exponential', () => {
      expect(easing.easeOutExponential(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutExponential(0.1)).toBeCloseTo(0.5, 8);
      expect(easing.easeOutExponential(0.2)).toBeCloseTo(0.75, 8);
      expect(easing.easeOutExponential(0.3)).toBeCloseTo(0.875, 8);
      expect(easing.easeOutExponential(0.4)).toBeCloseTo(0.9375, 8);
      expect(easing.easeOutExponential(0.5)).toBeCloseTo(0.96875, 8);
      expect(easing.easeOutExponential(0.6)).toBeCloseTo(0.984375, 8);
      expect(easing.easeOutExponential(0.7)).toBeCloseTo(0.9921875, 8);
      expect(easing.easeOutExponential(0.8)).toBeCloseTo(0.99609375, 8);
      expect(easing.easeOutExponential(0.9)).toBeCloseTo(0.99804688, 8);
      expect(easing.easeOutExponential(1)).toBeCloseTo(1, 8);
    });

    it('nthPolynomial', () => {
      const randValue = Math.random();
      const randLow = randValue / 2;
      expect(easing.easeOutQuad(randLow)).toBe(easing.easeOutNthPolynomial(2)(randLow));
      expect(easing.easeOutCubic(randLow)).toBe(easing.easeOutNthPolynomial(3)(randLow));
      expect(easing.easeOutQuart(randLow)).toBe(easing.easeOutNthPolynomial(4)(randLow));
      expect(easing.easeOutQuint(randLow)).toBe(easing.easeOutNthPolynomial(5)(randLow));
      const randHigh = randLow + 0.5;
      expect(easing.easeOutQuad(randHigh)).toBe(easing.easeOutNthPolynomial(2)(randHigh));
      expect(easing.easeOutCubic(randHigh)).toBe(easing.easeOutNthPolynomial(3)(randHigh));
      expect(easing.easeOutQuart(randHigh)).toBe(easing.easeOutNthPolynomial(4)(randHigh));
      expect(easing.easeOutQuint(randHigh)).toBe(easing.easeOutNthPolynomial(5)(randHigh));
    });

    it('quad', () => {
      expect(easing.easeOutQuad(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutQuad(0.1)).toBeCloseTo(0.19, 8);
      expect(easing.easeOutQuad(0.2)).toBeCloseTo(0.36, 8);
      expect(easing.easeOutQuad(0.3)).toBeCloseTo(0.51, 8);
      expect(easing.easeOutQuad(0.4)).toBeCloseTo(0.64, 8);
      expect(easing.easeOutQuad(0.5)).toBeCloseTo(0.75, 8);
      expect(easing.easeOutQuad(0.6)).toBeCloseTo(0.84, 8);
      expect(easing.easeOutQuad(0.7)).toBeCloseTo(0.91, 8);
      expect(easing.easeOutQuad(0.8)).toBeCloseTo(0.96, 8);
      expect(easing.easeOutQuad(0.9)).toBeCloseTo(0.99, 8);
      expect(easing.easeOutQuad(1)).toBeCloseTo(1, 8);
    });

    it('quart', () => {
      expect(easing.easeOutQuart(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutQuart(0.1)).toBeCloseTo(0.3439, 8);
      expect(easing.easeOutQuart(0.2)).toBeCloseTo(0.5904, 8);
      expect(easing.easeOutQuart(0.3)).toBeCloseTo(0.7599, 8);
      expect(easing.easeOutQuart(0.4)).toBeCloseTo(0.8704, 8);
      expect(easing.easeOutQuart(0.5)).toBeCloseTo(0.9375, 8);
      expect(easing.easeOutQuart(0.6)).toBeCloseTo(0.9744, 8);
      expect(easing.easeOutQuart(0.7)).toBeCloseTo(0.9919, 8);
      expect(easing.easeOutQuart(0.8)).toBeCloseTo(0.9984, 8);
      expect(easing.easeOutQuart(0.9)).toBeCloseTo(0.9999, 8);
      expect(easing.easeOutQuart(1)).toBeCloseTo(1, 8);
    });

    it('quint', () => {
      expect(easing.easeOutQuint(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutQuint(0.1)).toBeCloseTo(0.40951, 8);
      expect(easing.easeOutQuint(0.2)).toBeCloseTo(0.67232, 8);
      expect(easing.easeOutQuint(0.3)).toBeCloseTo(0.83193, 8);
      expect(easing.easeOutQuint(0.4)).toBeCloseTo(0.92224, 8);
      expect(easing.easeOutQuint(0.5)).toBeCloseTo(0.96875, 8);
      expect(easing.easeOutQuint(0.6)).toBeCloseTo(0.98976, 8);
      expect(easing.easeOutQuint(0.7)).toBeCloseTo(0.99757, 8);
      expect(easing.easeOutQuint(0.8)).toBeCloseTo(0.99968, 8);
      expect(easing.easeOutQuint(0.9)).toBeCloseTo(0.99999, 8);
      expect(easing.easeOutQuint(1)).toBeCloseTo(1, 8);
    });

    it('sine', () => {
      expect(easing.easeOutSine(0)).toBeCloseTo(0, 8);
      expect(easing.easeOutSine(0.1)).toBeCloseTo(0.15643447, 8);
      expect(easing.easeOutSine(0.2)).toBeCloseTo(0.30901699, 8);
      expect(easing.easeOutSine(0.3)).toBeCloseTo(0.4539905, 8);
      expect(easing.easeOutSine(0.4)).toBeCloseTo(0.58778525, 8);
      expect(easing.easeOutSine(0.5)).toBeCloseTo(0.70710678, 8);
      expect(easing.easeOutSine(0.6)).toBeCloseTo(0.80901699, 8);
      expect(easing.easeOutSine(0.7)).toBeCloseTo(0.89100652, 8);
      expect(easing.easeOutSine(0.8)).toBeCloseTo(0.95105652, 8);
      expect(easing.easeOutSine(0.9)).toBeCloseTo(0.98768834, 8);
      expect(easing.easeOutSine(1)).toBeCloseTo(1, 8);
    });
  });

  describe('misc', () => {
    it('.inverseLerp', () => {
      expect(easing.inverseLerp(0, 1, 0)).toEqual(0);
      expect(easing.inverseLerp(0, 1, 0.5)).toEqual(0.5);
      expect(easing.inverseLerp(0, 1, 1)).toEqual(1);
    });

    it('.inverseSmoothstep', () => {
      expect(easing.inverseSmoothstep(0)).toBeCloseTo(0, 8);
      expect(easing.inverseSmoothstep(0.1)).toBeCloseTo(0.19580011, 8);
      expect(easing.inverseSmoothstep(0.2)).toBeCloseTo(0.28714073, 8);
      expect(easing.inverseSmoothstep(0.3)).toBeCloseTo(0.36325749, 8);
      expect(easing.inverseSmoothstep(0.4)).toBeCloseTo(0.43293108, 8);
      expect(easing.inverseSmoothstep(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.inverseSmoothstep(0.6)).toBeCloseTo(0.56706892, 8);
      expect(easing.inverseSmoothstep(0.7)).toBeCloseTo(0.63674251, 8);
      expect(easing.inverseSmoothstep(0.8)).toBeCloseTo(0.71285927, 8);
      expect(easing.inverseSmoothstep(0.9)).toBeCloseTo(0.80419989, 8);
      expect(easing.inverseSmoothstep(1)).toBeCloseTo(1, 8);
    });

    it('.lerp', () => {
      expect(easing.lerp(0, 1, -1)).toEqual(0);
      expect(easing.lerp(0, 1, 0)).toEqual(0);
      expect(easing.lerp(0, 1, 0.5)).toEqual(0.5);
      expect(easing.lerp(0, 1, 1)).toEqual(1);
      expect(easing.lerp(0, 1, 2)).toEqual(1);
    });

    it('. lerpUnclamped', () => {
      expect(easing.lerpUnclamped(0, 1, -1)).toEqual(-1);
      expect(easing.lerpUnclamped(0, 1, 0)).toEqual(0);
      expect(easing.lerpUnclamped(0, 1, 0.5)).toEqual(0.5);
      expect(easing.lerpUnclamped(0, 1, 1)).toEqual(1);
      expect(easing.lerpUnclamped(0, 1, 2)).toEqual(2);
    });

    it('.smoothstep', () => {
      expect(easing.smoothstep(-1)).toBeCloseTo(0, 8);
      expect(easing.smoothstep(0)).toBeCloseTo(0, 8);
      expect(easing.smoothstep(0.1)).toBeCloseTo(0.028, 8);
      expect(easing.smoothstep(0.2)).toBeCloseTo(0.104, 8);
      expect(easing.smoothstep(0.3)).toBeCloseTo(0.216, 8);
      expect(easing.smoothstep(0.4)).toBeCloseTo(0.352, 8);
      expect(easing.smoothstep(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.smoothstep(0.6)).toBeCloseTo(0.648, 8);
      expect(easing.smoothstep(0.7)).toBeCloseTo(0.784, 8);
      expect(easing.smoothstep(0.8)).toBeCloseTo(0.896, 8);
      expect(easing.smoothstep(0.9)).toBeCloseTo(0.972, 8);
      expect(easing.smoothstep(1)).toBeCloseTo(1, 8);
      expect(easing.smoothstep(2)).toBeCloseTo(1, 8);
    });

    it('.smootherstep', () => {
      expect(easing.smootherstep(-1)).toBeCloseTo(0, 8);
      expect(easing.smootherstep(0)).toBeCloseTo(0, 8);
      expect(easing.smootherstep(0.1)).toBeCloseTo(0.00856, 8);
      expect(easing.smootherstep(0.2)).toBeCloseTo(0.05792, 8);
      expect(easing.smootherstep(0.3)).toBeCloseTo(0.16308, 8);
      expect(easing.smootherstep(0.4)).toBeCloseTo(0.31744, 8);
      expect(easing.smootherstep(0.5)).toBeCloseTo(0.5, 8);
      expect(easing.smootherstep(0.6)).toBeCloseTo(0.68256, 8);
      expect(easing.smootherstep(0.7)).toBeCloseTo(0.83692, 8);
      expect(easing.smootherstep(0.8)).toBeCloseTo(0.94208, 8);
      expect(easing.smootherstep(0.9)).toBeCloseTo(0.99144, 8);
      expect(easing.smootherstep(1)).toBeCloseTo(1, 8);
      expect(easing.smootherstep(2)).toBeCloseTo(1, 8);
    });
  });
});
