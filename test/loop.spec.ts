// @vitest-environment happy-dom
import { milliseconds } from '#🪕/chrono';
import type { RLLConfig } from '#🪕/loop';
import { createRLL } from '#🪕/loop';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

describe('createRLL (export)', () => {
  const onFrame = vi.fn<RLLConfig['onFrame']>(() => void 0).mockName('onFrame');
  const onTick = vi.fn<RLLConfig['onTick']>(() => void 0).mockName('onTick');
  const onSkip = vi.fn<RLLConfig['onSkip']>(() => void 0).mockName('onSkip');
  const rate = milliseconds(1000 / 60);
  const rll = createRLL({ onFrame, onTick, onSkip, tickRate: rate });

  beforeAll(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });
  afterEach(() => {
    rll.stop();
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  it('RLL runs on the expected intervals', () => {
    const raf = vi.spyOn(globalThis, 'requestAnimationFrame');
    const caf = vi.spyOn(globalThis, 'cancelAnimationFrame');

    // NOTE: check that it only stops when started
    expect(rll.stop(), 'Initial state').toBe(false);
    expect(rll.paused, 'Initial state').toBe(false);
    expect(rll.running, 'Initial state').toBe(false);
    expect(caf, 'Initial state').toHaveBeenCalledTimes(0);
    expect(raf, 'Initial state').toHaveBeenCalledTimes(0);

    expect(rll.start(), 'Starting').toBe(true);
    expect(rll.paused, 'After start').toBe(false);
    expect(rll.running, 'After start').toBe(true);
    expect(caf, 'After start').toHaveBeenCalledTimes(0);
    expect(raf, 'After start').toHaveBeenCalledTimes(1);
    expect(onFrame, 'After start').toHaveBeenCalledTimes(0);
    // expect(onFrame, 'After start').toHaveBeenLastCalledWith(0);
    expect(onTick, 'After start').toHaveBeenCalledTimes(0);
    expect(onSkip, 'After start').toHaveBeenCalledTimes(0);

    // NOTE: check that it only starts when stopped
    expect(rll.start(), 'Double starting').toBe(false);
    expect(rll.paused, 'After double start').toBe(false);
    expect(rll.running, 'After double start').toBe(true);
    expect(caf, 'After double start').toHaveBeenCalledTimes(0);
    expect(raf, 'After double start').toHaveBeenCalledTimes(1);
    expect(onFrame, 'After double start').toHaveBeenCalledTimes(0);
    // expect(onFrame, 'After double start').toHaveBeenLastCalledWith(0);
    expect(onTick, 'After double start').toHaveBeenCalledTimes(0);
    expect(onSkip, 'After double start').toHaveBeenCalledTimes(0);

    // NOTE: check after one iteration
    vi.advanceTimersToNextTimer();
    expect(caf, 'After one iteration').toHaveBeenCalledTimes(0);
    expect(raf, 'After one iteration').toHaveBeenCalledTimes(2);
    expect(onFrame, 'After one iteration').toHaveBeenCalledTimes(0);
    // expect(onFrame, 'After one iteration').toHaveBeenLastCalledWith(0);
    expect(onTick, 'After one iteration').toHaveBeenCalledTimes(0);
    expect(onSkip, 'After one iteration').toHaveBeenCalledTimes(0);

    // NOTE: simulate huge delay
    vi.clearAllTimers();
    vi.advanceTimersByTime(2_000);
    // NOTE: faked RAF timer is already cancelled, so we can safely cancel it via `.stop` to reset loop
    expect(rll.stop(), 'Stopping').toBe(true);
    rll.start();
    vi.advanceTimersToNextTimer();
    expect(caf, 'After simulated delay').toHaveBeenCalledTimes(1);
    expect(raf, 'After simulated delay').toHaveBeenCalledTimes(4);
    expect(onFrame, 'After simulated delay').toHaveBeenCalledTimes(1);
    expect(onFrame, 'After simulated delay').toHaveBeenLastCalledWith(0);
    expect(onTick, 'After simulated delay').toHaveBeenCalledTimes(1);
    expect(onTick, 'After simulated delay').toHaveBeenLastCalledWith(+rate);
    expect(onSkip, 'After simulated delay').toHaveBeenCalledTimes(1);
    expect(onSkip, 'After simulated delay').toHaveBeenLastCalledWith(2000);

    // NOTE: pause tests
    expect(rll.pause()).toBe(true);
    expect(rll.paused).toBe(true);
    vi.advanceTimersToNextTimer();
    expect(caf, 'After pausing engine').toHaveBeenCalledTimes(1);
    expect(raf, 'After pausing engine').toHaveBeenCalledTimes(5);
    expect(onFrame, 'After pausing engine').toHaveBeenCalledTimes(1);
    expect(onFrame, 'After pausing engine').toHaveBeenLastCalledWith(0);
    expect(onTick, 'After pausing engine').toHaveBeenCalledTimes(1);
    expect(onTick, 'After pausing engine').toHaveBeenLastCalledWith(+rate);
    expect(onSkip, 'After pausing engine').toHaveBeenCalledTimes(1);
    expect(onSkip, 'After pausing engine').toHaveBeenLastCalledWith(2000);

    vi.advanceTimersByTime(2_000);
    expect(rll.pause()).toBe(false);
    expect(rll.paused).toBe(false);
    vi.advanceTimersToNextTimer();
    expect(caf, 'After pausing engine').toHaveBeenCalledTimes(1);
    expect(raf, 'After pausing engine').toHaveBeenCalledTimes(131);
    expect(onFrame, 'After pausing engine').toHaveBeenCalledTimes(2);
    expect(onFrame, 'After pausing engine').toHaveBeenLastCalledWith(16);
    expect(onTick, 'After pausing engine').toHaveBeenCalledTimes(1);
    expect(onTick, 'After pausing engine').toHaveBeenLastCalledWith(+rate);
    expect(onSkip, 'After pausing engine').toHaveBeenCalledTimes(1);
    expect(onSkip, 'After pausing engine').toHaveBeenLastCalledWith(2000);
  });
});
