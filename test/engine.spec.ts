// @vitest-environment happy-dom
import { seconds } from '#🪕/chrono';
import { createEngine } from '#🪕/engine';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { delay } from './utils.js';

const ogCAF = cancelAnimationFrame;
const ogCI = clearInterval;
const ogRAF = requestAnimationFrame;
const ogSI = setInterval;

describe('createEngine (export)', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    // NOTE: this seems to be required to properly restore mock state when using JSDom as an environment for Vitest
    Object.assign(globalThis, { cancelAnimationFrame: ogCAF, clearInterval: ogCI, requestAnimationFrame: ogRAF, setInterval: ogSI });
  });

  const dummyEvent = new CustomEvent('dummy');
  const onDummy = vi.fn(() => void 0).mockName('onDummy');
  const onRender = vi.fn(() => void 0).mockName('onRender');
  // TODO: add testing for skipped frames (should clear coverage on 79-80, 176-177)
  const onSkip = vi.fn(() => void 0).mockName('onSkip');
  const onStart = vi.fn(() => void 0).mockName('onStart');
  const onStop = vi.fn(() => void 0).mockName('onSop');
  const onUpdate = vi.fn(() => void 0).mockName('onUpdate');
  const render = vi.fn(() => void 0).mockName('render');
  const TPS = 60;
  const update = vi.fn(() => void 0).mockName('update');

  it('builds correctly', () => {
    const engine = createEngine<{ dummy: CustomEvent }>({ TPS, render, update }).on('engineStarted', onStart).on('engineStopped', onStop).on('dummy', onDummy);

    expect(onStart).toHaveBeenCalledTimes(0);
    expect(onStop).toHaveBeenCalledTimes(0);
    expect(engine.keyboardHandler).toBeDefined();
    expect(engine.paused).toBe(false);
    expect(engine.running).toBe(false);
    expect(engine.FPS).toBe(0);
    expect(engine.TPS).toBe(0);
    engine.emit(dummyEvent);
    expect(onDummy).toHaveBeenCalledTimes(1);
    expect(onDummy).toHaveBeenLastCalledWith(dummyEvent);
    engine.off('dummy', onDummy).emit(dummyEvent);
    expect(onDummy).toHaveBeenCalledTimes(1);
    expect(onDummy).toHaveBeenLastCalledWith(dummyEvent);
  });

  it('only runs when it is supposed to', () => {
    vi.useFakeTimers({
      toFake: ['cancelAnimationFrame', 'clearInterval', 'clearTimeout', 'performance', 'requestAnimationFrame', 'setInterval', 'setTimeout'],
    });
    const engine = createEngine({ TPS, render, update }).on('engineStarted', onStart).on('engineStopped', onStop);

    const setInt = vi.spyOn(globalThis, 'setInterval');
    const clearInt = vi.spyOn(globalThis, 'clearInterval');

    expect(setInt).toHaveBeenCalledTimes(0);
    expect(clearInt).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(0);
    expect(onStop).toHaveBeenCalledTimes(0);

    expect(engine.start()).toBe(engine);
    expect(setInt).toHaveBeenCalledTimes(1);
    expect(clearInt).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenLastCalledWith(expect.objectContaining({ detail: 0 }));
    expect(onStop).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);
    expect(setInt).toHaveBeenCalledTimes(1);
    expect(clearInt).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledTimes(0);

    engine.emit(new CustomEvent('engineStarted', { detail: NaN }));
    vi.advanceTimersByTime(100);
    expect(setInt).toHaveBeenCalledTimes(1);
    expect(clearInt).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(2);
    expect(onStop).toHaveBeenCalledTimes(0);

    expect(engine.stop()).toBe(engine);
    vi.advanceTimersByTime(100);
    expect(setInt).toHaveBeenCalledTimes(1);
    expect(clearInt).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledTimes(2);
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenLastCalledWith(expect.objectContaining({ detail: 300 }));

    engine.emit(new CustomEvent('engineStopped', { detail: NaN }));
    vi.advanceTimersByTime(100);
    expect(setInt).toHaveBeenCalledTimes(1);
    expect(clearInt).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledTimes(2);
    expect(onStop).toHaveBeenCalledTimes(2);
  });

  it('updates and renders while running', async () => {
    vi.useFakeTimers({
      toFake: ['cancelAnimationFrame', 'clearInterval', 'clearTimeout', 'performance', 'requestAnimationFrame', 'setInterval', 'setTimeout'],
    });
    const engine = createEngine({ TPS, render, update })
      .on('engineStarted', onStart)
      .on('engineStopped', onStop)
      .on('rendered', onRender)
      .on('skippedFrames', onSkip)
      .on('updated', onUpdate);

    engine.start();
    vi.advanceTimersByTime(100);
    expect(engine.FPS).toBe(0);
    expect(engine.TPS).toBe(0);
    expect(engine.running).toBe(true);
    expect(onRender).toHaveBeenCalledTimes(5);
    expect(onSkip).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledTimes(0);
    expect(onUpdate).toHaveBeenCalledTimes(4);
    expect(render).toHaveBeenCalledTimes(5);
    expect(update).toHaveBeenCalledTimes(4);

    vi.advanceTimersByTime(1000);
    expect(engine.FPS).toBe(0);
    expect(engine.TPS).toBe(0);
    expect(engine.running).toBe(true);
    expect(onRender).toHaveBeenCalledTimes(67);
    expect(onSkip).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledTimes(0);
    expect(onUpdate).toHaveBeenCalledTimes(64);
    expect(render).toHaveBeenCalledTimes(67);
    expect(update).toHaveBeenCalledTimes(64);

    engine.pause();
    vi.advanceTimersByTime(1000);
    expect(engine.FPS).toBe(0);
    expect(engine.TPS).toBe(0);
    expect(engine.running).toBe(true);
    expect(onRender).toHaveBeenCalledTimes(67);
    expect(onSkip).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledTimes(0);
    expect(onUpdate).toHaveBeenCalledTimes(64);
    expect(render).toHaveBeenCalledTimes(67);
    expect(update).toHaveBeenCalledTimes(64);

    // DEBUG: i know i need to simulate onskip but not sure how between JSDOM and vi timers cos... prolly need to overhaul the entire test
    // vi.advanceTimersByTime(1000);
    vi.useRealTimers();
    Object.assign(globalThis, { cancelAnimationFrame: ogCAF, clearInterval: ogCI, requestAnimationFrame: ogRAF, setInterval: ogSI });
    engine.pause();
    await delay(seconds(1));
    // vi.useFakeTimers({
    //   toFake: ['cancelAnimationFrame', 'clearInterval', 'clearTimeout', 'performance', 'requestAnimationFrame', 'setInterval', 'setTimeout'],
    // });

    engine.stop();
    expect(engine.FPS).toBe(0);
    expect(engine.TPS).toBe(0);
    expect(engine.running).toBe(false);
    expect(onRender).toHaveBeenCalledTimes(67);
    expect(onSkip).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledTimes(64);
    expect(render).toHaveBeenCalledTimes(67);
    expect(update).toHaveBeenCalledTimes(64);

    // vi.useRealTimers();
  });

  it('clears old marks to display FPS/TPS', async () => {
    vi.useFakeTimers({
      toFake: ['cancelAnimationFrame', 'clearInterval', 'requestAnimationFrame', 'setInterval'],
    });
    const clear = vi.spyOn(performance, 'clearMarks');

    const engine = createEngine({ TPS, render, update }).on('skippedFrames', onSkip).start();
    vi.advanceTimersByTime(250_000);
    expect(engine.FPS).toBeCloseTo(300, -1);
    expect(engine.TPS).toBeCloseTo(300, -1);

    vi.clearAllTimers();
    vi.useRealTimers();
    engine.stop();
    await delay(seconds(1));
    vi.useFakeTimers({
      toFake: ['cancelAnimationFrame', 'clearInterval', 'requestAnimationFrame', 'setInterval'],
    });
    engine.start();
    expect(clear).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(1000);
    expect(clear).toHaveBeenCalledTimes(2);
    expect(clear).toHaveBeenCalledWith('rendered');
    expect(clear).toHaveBeenCalledWith('updated');
    expect(engine.FPS).toBeCloseTo(60, -1);
    expect(engine.TPS).toBe(0);
    engine.stop();
  });
});
