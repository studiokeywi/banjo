import { from } from '#🪕/chrono';
import { withinLastSecond } from '#🪕/timing';
import { describe, expect, it, vi } from 'vitest';
import { delay } from './utils.js';

describe('withinLastPeriod (export)', () => {
  it('withinLastSecond (wrapper)', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    let marking = setInterval(() => {
      performance.mark('foo');
    }, 200);
    vi.advanceTimersByTime(1_000);
    clearInterval(marking);
    vi.setSystemTime(1_000);
    expect(withinLastSecond('foo')).toEqual(5);

    marking = setInterval(() => {
      performance.mark('foo');
    }, 1);
    vi.advanceTimersByTime(1_000);
    performance.measure('foo', 'foo');
    clearInterval(marking);
    expect(withinLastSecond('foo')).toEqual(300);

    marking = setInterval(() => {
      performance.mark('foo');
    }, 200);
    vi.advanceTimersByTime(1_000);
    clearInterval(marking);
    expect(withinLastSecond('foo', 10)).toEqual(10);

    vi.useRealTimers();

    performance.mark('start');
    await delay(from('1 seconds'));
    performance.measure('start', 'start');
    expect(withinLastSecond('start')).toEqual(0);
  });
});
