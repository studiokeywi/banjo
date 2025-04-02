/**
 * General purpose higher-order functions such as `debounce` and `throttle`
 *
 * @module hof
 * @author studioKeywi */

// TODO: other HOF?
import type { Chrono } from '#🪕/chrono';
import type { GenericAsyncFunction, GenericFunction } from '#🪕/types';

/**
 * TODO: JSDocs
 */
const bothProvided = new Error('Only one of "onRise" and "onFall" may be specified at a time');

/**
 * TODO: JSDocs
 */
const invalidDebounceTime = new Error('A non-zero positive value must be provided to "debounce"');

/**
 * TODO: JSDocs
 */
const neitherSelected = new Error('One of "onRise" or "onFall" must be provided with a truthy value');

/**
 * TODO: JSDocs
 */
const nothingToDebounce = new Error('A function must be provided to "debounce"');

/**
 * Debounces repeated requests for a function call and its actual one-time execution. While debouncing, a function can only
 * execute once, either before or after a given period of time. Once the debounce period ends, another function execution can
 * occur.
 *
 * @template {GenericAsyncFunction | GenericFunction} Fn
 * @param {Fn} fn
 * @param {Chrono} period
 * @param {{}} [cfg = { onFall: true }]
 * @returns {(...args: Parameters<Fn>) => void} */
export const debounce = <Out, In extends never[], Fn extends GenericAsyncFunction<Out, In> | GenericFunction<Out, In>>(
  fn: Fn,
  period: Chrono,
  { onRise, onFall }: { onRise?: boolean; onFall?: boolean } = { onFall: true }
): ((...args: Parameters<Fn>) => void) => {
  if (typeof fn !== 'function') {
    throw nothingToDebounce;
  }
  if (!!onRise === !!onFall) {
    throw onRise ? bothProvided : neitherSelected;
  }

  /** Converted time period for debouncing from input Chrono */
  const timePeriod = period.milliseconds;
  if (timePeriod <= 0) {
    throw invalidDebounceTime;
  }

  /** ID for the debounce period */
  let debouncing: number;

  const $execute = (toRun: boolean | undefined, args: Parameters<Fn>) => {
    if (debouncing) {
      clearInterval(debouncing);
      debouncing = 0;
    }
    if (toRun) {
      void fn(...args);
    }
  };

  /** Debounced function */
  return (...args: Parameters<Fn>) => {
    $execute(onRise, args);
    debouncing = +setTimeout($execute, timePeriod, onFall, args);
  };
};

/**
 * TODO: JSDocs
 */
const nothingToThrottle = new Error('A function must be provided to "throttle"');

/**
 * Throttle repeated attempts at execution by caching return values from the function. When under the throttle duration, the last
 * cached value is returned. Once the throttle duration ends, the original function is executed and its return value cached again
 *
 * @template {GenericAsyncFunction | GenericFunction} Fn
 * @param {Fn} fn
 * @param {Chrono} rate
 * @returns {Fn} */
export const throttle = <Out, In extends never[], Fn extends GenericAsyncFunction<Out, In> | GenericFunction<Out, In>>(fn: Fn, rate: Chrono): Fn => {
  if (typeof fn !== 'function') {
    throw nothingToThrottle;
  }
  const throttleRate = rate.milliseconds;
  /** Resets the throttle duration */
  const reset: TimerHandler = () => {
    throttling = 0;
  };

  /** ID for the throttle duration */
  let throttling: number;
  /** Cached return value */
  let retValue: Out | Promise<Out>;

  /** Throttled function */
  return ((...args: Parameters<Fn>) => {
    if (!throttling) {
      retValue = fn(...args);
      throttling = setTimeout(reset, throttleRate);
    }
    return retValue;
  }) as never;
};
