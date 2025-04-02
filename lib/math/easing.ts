/**
 * Easing or shaping functions that modify values between [0-1] in predictable ways
 *
 * @module math/easing
 * @author studioKeywi */

// TODO: test validity of all easing functions
import { halfTau, quarterTau, thirdTau } from '#🪕/math/constants';
import { clamp } from '#🪕/math/conversions';

/**
 * Magic value used for ease-*-back
 */
const c1 = 1.70158;
/**
 * Magic value used for ease-*-back (c1 * 1.525)
 */
const c2 = 2.5949095;
/**
 * Magic value used for ease-*-back (c1 + 1)
 */
const c3 = 2.70158;
/**
 * Magic value used for ease-*-elastic
 */
const c4 = thirdTau;
/**
 * Magic value used for ease-*-elastic (tau / 4.5)
 */
const c5 = 1.3962634015954636;
/**
 * Magic value used for ease-*-bounce
 */
const d1 = 2.75;
/**
 * Magic value used for ease-*-bounce
 */
const n1 = 7.5625;

/**
 * Eases a linear value [0, 1] by blending the beginning with a backwards facing curve
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInBack = (x: number): number => {
  return c3 * x ** 3 - c1 * x ** 2;
};
/**
 * Eases a linear value [0, 1] by blending the beginning and ending with a backwards facing curve
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutBack = (x: number): number => {
  if (x < 0.5) {
    return ((2 * x) ** 2 * ((c2 + 1) * 2 * x - c2)) / 2;
  }
  return ((2 * x - 2) ** 2 * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with a backwards facing curve
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutBack = (x: number): number => {
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
};

/**
 * Eases a linear value [0, 1] by blending the beginning with increasing parabolic curves
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInBounce = (x: number): number => {
  return 1 - easeOutBounce(1 - x);
};
/**
 * Eases a linear value [0, 1] by blending the beginning with increasing parabolic curves and the ending with decreasing parabolic curves
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutBounce = (x: number): number => {
  if (x < 0.5) {
    return (1 - easeOutBounce(1 - 2 * x)) / 2;
  }
  return (1 + easeOutBounce(2 * x - 1)) / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with decreasing parabolic curves
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutBounce = (x: number): number => {
  if (x < 1 / d1) {
    return n1 * x ** 2;
  }
  if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  }
  if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  }
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

/**
 * Eases a linear value [0, 1] by blending the beginning with a circle
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInCircular = (x: number): number => {
  return 1 - Math.sqrt(1 - x ** 2);
};
/**
 * Eases a linear value [0, 1] by blending the beginning and ending with a circle
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutCircular = (x: number): number => {
  if (x < 0.5) {
    return (1 - Math.sqrt(1 - (2 * x) ** 2)) / 2;
  }
  return (Math.sqrt(1 - (-2 * x + 2) ** 2) + 1) / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with a circle
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutCircular = (x: number): number => {
  return Math.sqrt(1 - (x - 1) ** 2);
};

/**
 * Eases a linear value [0, 1] by blending the beginning with a 3rd degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInCubic = (x: number): number => {
  return x ** 3;
};
/**
 * Eases a linear value [0, 1] by blending the beginning and ending with a 3rd degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutCubic = (x: number): number => {
  if (x < 0.5) {
    return 4 * x ** 3;
  }
  return 1 - (-2 * x + 2) ** 3 / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with a 3rd degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutCubic = (x: number): number => {
  return 1 - (1 - x) ** 3;
};

/**
 * Eases a linear value [0, 1] by blending the beginning with increasing jerking motions and the ending with decreasing jerking motions
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInElastic = (x: number): number => {
  if (!x) {
    return 0;
  }
  if (x === 1) {
    return 1;
  }
  return -(2 ** (10 * x - 10)) * Math.sin((x * 10 - 10.75) * c4);
};
/**
 * Eases a linear value [0, 1] by blending the ending with increasing jerking motions
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutElastic = (x: number): number => {
  if (!x) {
    return 0;
  }
  if (x === 1) {
    return 1;
  }
  if (x < 0.5) {
    return -(2 ** (20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2;
  }
  return (2 ** (-20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
};
/**
 * Eases a linear value [0, 1] by blending the ending with decreasing jerking motions
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutElastic = (x: number): number => {
  if (!x) {
    return 0;
  }
  if (x === 1) {
    return 1;
  }
  return 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

/**
 * Eases a linear value [0, 1] by blending the beginning with an exponential curve
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInExponential = (x: number): number => {
  if (!x) {
    return 0;
  }
  return 2 ** (10 * x - 10);
};
/**
 * Eases a linear value [0, 1] by blending the beginning and ending with an exponential curve
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutExponential = (x: number): number => {
  if (!x) {
    return 0;
  }
  if (x === 1) {
    return 1;
  }
  if (x < 0.5) {
    return 2 ** (20 * x - 10) / 2;
  }
  return (2 - 2 ** (-20 * x + 10)) / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with an exponential curve
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutExponential = (x: number): number => {
  if (x === 1) {
    return 1;
  }
  return 1 - 2 ** (-10 * x);
};

// TODO: validate that each of these works as equivalent to quad/cub/quart/quint
/**
 * Creates an ease-in function based on an n-th degree polynomial
 *
 * @param {number} n Degree of the polynomial
 * @returns {(x: number) => number} The easing function */
export const easeInNthPolynomial =
  (n: number): ((x: number) => number) =>
  /** Eases a linear value [0, 1] by blending the beginning with an n-th degree polynomial
   * @param {number} x Linear value
   * @returns {number} The eased value */
  (x: number): number => {
    return x ** n;
  };
/**
 * Creates an ease-in-out  function based on an n-th degree polynomial
 *
 * @param {number} n Degree of the polynomial
 * @returns {(x: number) => number} The easing function */
export const easeInOutNthPolynomial = (n: number): ((x: number) => number) => {
  const k = 2 ** (n - 1);
  return (
    /** Eases a linear value [0, 1] by blending the beginning and ending with an n-th degree polynomial
     * @param {number} x Linear value
     * @returns {number} The eased value */
    (x: number): number => {
      if (x < 0.5) {
        return k * x ** n;
      }
      return 1 - (-2 * x + 2) ** n / 2;
    }
  );
};
/**
 * Creates an ease-out function based on an n-th degree polynomial
 *
 * @param {number} n Degree of the polynomial
 * @returns {(x: number) => number} The easing function */
export const easeOutNthPolynomial =
  (n: number): ((x: number) => number) =>
  /** Eases a linear value [0, 1] by blending the ending with an n-th degree polynomial
   * @param {number} x Linear value
   * @returns {number} The eased value */
  (x: number): number => {
    return 1 - (1 - x) ** n;
  };

/**
 * Eases a linear value [0, 1] by blending the beginning with a 2nd degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInQuad = (x: number): number => {
  return x ** 2;
};
/**
 * Eases a linear value [0, 1] by blending the beginning and ending with a 2nd degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutQuad = (x: number): number => {
  if (x < 0.5) {
    return 2 * x ** 2;
  }
  return 1 - (-2 * x + 2) ** 2 / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with a 2nd degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutQuad = (x: number): number => {
  return 1 - (1 - x) ** 2;
};

/**
 * Eases a linear value [0, 1] by blending the beginning with a 4th degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInQuart = (x: number): number => {
  return x ** 4;
};
/**
 * Eases a linear value [0, 1] by blending the beginning and ending with a 4th degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutQuart = (x: number): number => {
  if (x < 0.5) {
    return 8 * x ** 4;
  }
  return 1 - (-2 * x + 2) ** 4 / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with a 4th degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutQuart = (x: number): number => {
  return 1 - (1 - x) ** 4;
};

/**
 * Eases a linear value [0, 1] by blending the beginning with a 5th degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInQuint = (x: number): number => {
  return x ** 5;
};
/**
 * Eases a linear value [0, 1] by blending the beginning and ending with a 5th degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutQuint = (x: number): number => {
  if (x < 0.5) {
    return 16 * x ** 5;
  }
  return 1 - (-2 * x + 2) ** 5 / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with a 5th degree polynomial
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutQuint = (x: number): number => {
  return 1 - (1 - x) ** 5;
};

/**
 * Eases a linear value [0, 1] by blending the beginning with a sine wave
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInSine = (x: number): number => {
  return 1 - Math.cos(x * quarterTau);
};
/**
 * Eases a linear value [0, 1] by blending the beginning and ending with a sine wave
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeInOutSine = (x: number): number => {
  return -(Math.cos(x * halfTau) - 1) / 2;
};
/**
 * Eases a linear value [0, 1] by blending the ending with a sine wave
 *
 * @param {number} x Linear value
 * @returns {number} The eased value */
export const easeOutSine = (x: number): number => {
  return Math.sin(x * quarterTau);
};

/**
 * Calculates the transition point (`t`) of a {@link lerp|linearly interpolated} value
 *
 * @param {number} a First value
 * @param {number} b Second value
 * @param {number} val Linearly interpolated value
 * @returns {number} The transition point `t` such that `lerp(a, b, t) === value` */
export const inverseLerp = (a: number, b: number, val: number): number => {
  return (val - a) / (b - a);
};

/**
 * Calculates the {@link https://en.wikipedia.org/wiki/Smoothstep#Inverse_Smoothstep|inverse of a smoothstep} value
 *
 * @param {number} x Value to calculate
 * @returns {number} The inverse smoothstep calculated point */
export const inverseSmoothstep = (x: number): number => {
  return 0.5 - Math.sin(Math.asin(1 - 2 * x) / 3);
};

/**
 * Calculates a linear interpolation between two values based on some "transition point" `t`. Will {@link clamp} the value of `t` to [0, 1]:
 *
 * - When `t = 0`, `lerp(a, b, t) === a`
 * - When `t = 1`, `lerp(a, b, t) === b`
 * - When `t = 0.5`, `lerp(a, b, t) === (a + b) / 2`
 * @param {number} a First value
 * @param {number} b Second value
 * @param {number} t Transition point
 * @returns {number} The linearly interpolated value */
export const lerp = (a: number, b: number, t: number): number => {
  return a + clamp(t) * (b - a);
};

/**
 * Calculates a linear interpolation between two values based on some "transition point" `t`:
 *
 * - When `t = 0`, `lerp(a, b, t) === a`
 * - When `t = 1`, `lerp(a, b, t) === b`
 * - When `t = 0.5`, `lerp(a, b, t) === (a + b) / 2`
 * @param {number} a First value
 * @param {number} b Second value
 * @param {number} t Transition point
 * @returns {number} The linearly interpolated value */
export const lerpUnclamped = (a: number, b: number, t: number): number => {
  return a + t * (b - a);
};

/**
 * Calculates the 3rd-order {@link https://en.wikipedia.org/wiki/Smoothstep#3rd-order_equation|smoothstep} value
 *
 * @param {number} x Value to calculate
 * @returns {number} The smoothstep calculated value */
export const smoothstep = (x: number): number => {
  if (x < 0) {
    return 0;
  }
  if (x > 1) {
    return 1;
  }
  return 3 * x ** 2 - 2 * x ** 3;
};

/**
 * Calculates the 5th-order {@link https://en.wikipedia.org/wiki/Smoothstep#5th-order_equation|smootherstep} value
 *
 * @param {number} x Value to calculate
 * @returns {number} The smoothstep calculated value */
export const smootherstep = (x: number): number => {
  if (x < 0) {
    return 0;
  }
  if (x > 1) {
    return 1;
  }
  return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
};
