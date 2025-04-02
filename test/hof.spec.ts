import { from } from '#🪕/chrono';
import * as controls from '#🪕/hof';
import { describe, expect, it, vi } from 'vitest';

describe('controls (module)', () => {
  const period = from('500 milliseconds');
  describe('.debounce', () => {
    it('invalid usage', () => {
      const testFn = vi.fn(() => void 0);
      expect(() => controls.debounce(void 0 as never, period)).toThrow('A function must be provided to "debounce"');
      expect(() => controls.debounce(testFn, from('0 milliseconds'))).toThrow('A non-zero positive value must be provided to "debounce"');
      expect(() => controls.debounce(testFn, period, { onFall: true, onRise: true })).toThrow('Only one of "onRise" and "onFall" may be specified at a time');
      expect(() => controls.debounce(testFn, period, { onFall: false, onRise: false })).toThrow(
        'One of "onRise" or "onFall" must be provided with a truthy value'
      );
      expect(() => controls.debounce(testFn, period)).not.toThrow();
    });

    it('.debounce (on fall)', () => {
      const testFn = vi.fn(() => void 0).mockName('onFall');
      vi.useFakeTimers();
      const debouncedFall = controls.debounce(testFn, period, { onFall: true });
      debouncedFall();
      expect(testFn).toHaveBeenCalledTimes(0);
      vi.advanceTimersByTime(2);
      debouncedFall();
      expect(testFn).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(500);
      expect(testFn).toHaveBeenCalledOnce();
      debouncedFall();
      vi.advanceTimersByTime(2);
      expect(testFn).toHaveBeenCalledOnce();

      testFn.mockClear();
      vi.useRealTimers();
    });

    it('.debounce (on rise)', () => {
      const testFn = vi.fn(() => void 0).mockName('onRise');
      vi.useFakeTimers();
      const debouncedRise = controls.debounce(testFn, period, { onRise: true });
      debouncedRise();
      expect(testFn).toHaveBeenCalledOnce();

      vi.advanceTimersByTime(499);
      expect(testFn).toHaveBeenCalledOnce();

      vi.advanceTimersByTime(2);
      debouncedRise();
      expect(testFn).toHaveBeenCalledTimes(2);

      testFn.mockClear();
      vi.useRealTimers();
    });
  });

  it('.throttle', () => {
    expect(() => controls.throttle(void 0 as never, period)).toThrow('A function must be provided to "throttle"');
    const testFn = vi.fn((a: number, b: number): number => a + b);
    const throttled = controls.throttle(testFn, from('50 milliseconds'));

    vi.useFakeTimers();

    let results: number = throttled(1, 2);
    results = throttled(2, 3);
    results = throttled(3, 4);
    results = throttled(4, 5);
    expect(results).toEqual(3);

    vi.advanceTimersByTime(1);
    results = throttled(2, 3);
    results = throttled(3, 4);
    results = throttled(4, 5);
    expect(results).toEqual(3);

    vi.advanceTimersByTime(49);
    results = throttled(5, 6);
    expect(results).toEqual(11);

    vi.useRealTimers();
  });
});
