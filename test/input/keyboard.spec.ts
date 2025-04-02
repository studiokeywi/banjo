// @vitest-environment happy-dom
import { milliseconds } from '#🪕/chrono';
import { createEmitter } from '#🪕/emitter';
import type { Engine } from '#🪕/engine';
import { createKeyHandler } from '#🪕/input/keyboard';
import { $aA, $bB, $down, $enter, $left, $right, $up } from '#🪕/input/keys';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { delay } from '../utils.js';

const _nullEngine = {} as Engine;
const _10ms = milliseconds(10);
const keydownUpArrowEvent = Object.assign(new Event('keydown'), $up);
const konami = [$up, $up, $down, $down, $left, $right, $left, $right, $bB, $aA, $enter];
const [releaseUp, releaseDown, releaseLeft, releaseRight, releaseB, releaseA, releaseEnter] = [$up, $down, $left, $right, $bB, $aA, $enter].map(key =>
  Object.assign(new Event('keyup'), key)
);

const add = vi.spyOn(globalThis, 'addEventListener');
const remove = vi.spyOn(globalThis, 'removeEventListener');

describe('createInputHandler - (export)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('setup', () => {
    const emitter = createEmitter();
    const emit = vi.spyOn(emitter, 'emit');
    const handler = createKeyHandler(emitter, _nullEngine);
    handler
      .bind('up', $up)
      .bind('down', $enter, $bB, $down)
      .bind('down', $enter)
      .bind('crouch', $down)
      .bind('nonsense', $right)
      .register('konami', _10ms, ...konami)
      .register('konami', _10ms, ...konami)
      .register('dummy', _10ms, $bB)
      .start()
      .start()
      .stop()
      .stop();

    expect(add.mock.calls).toEqual([expect.arrayContaining(['keydown']), expect.arrayContaining(['keyup'])]);
    expect(remove.mock.calls).toEqual([expect.arrayContaining(['keydown']), expect.arrayContaining(['keyup'])]);
    expect(emit.mock.calls).toEqual([
      [expect.objectContaining({ type: 'bind', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'bind', detail: { action: 'down', key: $enter } })],
      [expect.objectContaining({ type: 'bind', detail: { action: 'down', key: $bB } })],
      [expect.objectContaining({ type: 'bind', detail: { action: 'down', key: $down } })],
      [expect.objectContaining({ type: 'unbind', detail: { action: 'down', key: $down } })],
      [expect.objectContaining({ type: 'bind', detail: { action: 'crouch', key: $down } })],
      [expect.objectContaining({ type: 'bind', detail: { action: 'nonsense', key: $right } })],
      [expect.objectContaining({ type: 'register', detail: { keys: konami, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'register', detail: { keys: [$bB], sequence: 'dummy' } })],
    ]);
    expect(handler.actionKeys('crumpets')).toBe(undefined);
    expect(handler.actionKeys('up')).toEqual([$up]);
    expect(handler.sequenceProgress('konami')).toBe(0);
    expect(handler.sequenceProgress('kilroy')).toBe(0);
    expect(handler.engine).toBe(_nullEngine);
  });

  it('valid usage', async () => {
    const emitter = createEmitter();
    const emit = vi.spyOn(emitter, 'emit');
    const handler = createKeyHandler(emitter, _nullEngine)
      .bind('up', $up)
      .bind('down', $enter, $bB, $down)
      .bind('down', $enter)
      .bind('crouch', $down)
      .bind('nonsense', $right)
      .register('konami', _10ms, ...konami)
      .register('konami', _10ms, ...konami)
      .register('dummy', _10ms, $bB)
      .start();
    // We check other events elsewhere, so clear mock now
    emit.mockClear();

    dispatchEvent(keydownUpArrowEvent);
    await vi.waitFor(() => {
      expect(handler.actionState('up')).toBe(1);
      expect(handler.keyState($up)).toBe(1);
    });
    dispatchEvent(keydownUpArrowEvent);
    await vi.waitFor(() => {
      expect(handler.actionState('up')).toBe(2);
      expect(handler.keyState($up)).toBe(2);
    });
    dispatchEvent(releaseUp);
    await vi.waitFor(() => {
      expect(handler.actionState('up')).toBe(0);
      expect(handler.keyState($up)).toBe(0);
      expect(handler.sequenceProgress('konami')).toBe((1 / 11) * 100);
    });
    dispatchEvent(releaseUp);
    dispatchEvent(releaseDown);
    dispatchEvent(releaseDown);
    dispatchEvent(releaseLeft);
    dispatchEvent(releaseRight);
    dispatchEvent(releaseLeft);
    dispatchEvent(releaseRight);
    dispatchEvent(releaseB);
    dispatchEvent(releaseA);
    dispatchEvent(releaseEnter);

    expect(emit.mock.calls).toEqual([
      [expect.objectContaining({ type: 'actionPressed', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'actionHeld', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $up, progress: (1 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $up, progress: (2 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'crouch', key: $down } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $down, progress: (3 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'crouch', key: $down } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $down, progress: (4 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $left, progress: (5 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'nonsense', key: $right } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $right, progress: (6 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $left, progress: (7 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'nonsense', key: $right } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $right, progress: (8 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'down', key: $bB } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $bB, progress: (9 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'sequenceComplete', detail: { key: $bB, sequence: 'dummy' } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $aA, progress: (10 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'down', key: $enter } })],
      [expect.objectContaining({ type: 'sequenceComplete', detail: { key: $enter, sequence: 'konami' } })],
    ]);
  });

  it('invalid usage', async () => {
    const emitter = createEmitter();
    const emit = vi.spyOn(emitter, 'emit');
    createKeyHandler(emitter, _nullEngine)
      .bind('up', $up)
      .bind('down', $enter, $bB, $down)
      .bind('down', $enter)
      .bind('crouch', $down)
      .bind('nonsense', $right)
      .register('konami', _10ms, ...konami)
      .register('konami', _10ms, ...konami)
      .register('dummy', _10ms, $bB)
      .start();
    // We check other events elsewhere, so clear mock now
    emit.mockClear();

    dispatchEvent(keydownUpArrowEvent);
    dispatchEvent(releaseUp);
    dispatchEvent(releaseEnter);
    dispatchEvent(releaseUp);
    await delay(_10ms);
    await delay(_10ms);
    dispatchEvent(releaseUp);
    dispatchEvent(new Event('keyup'));
    dispatchEvent(new Event('keyup'));

    expect(emit.mock.calls).toEqual([
      [expect.objectContaining({ type: 'actionPressed', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $up, progress: (1 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'down', key: $enter } })],
      [expect.objectContaining({ type: 'sequenceDropped', detail: { progress: (1 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $up, progress: (1 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'sequenceDropped', detail: { progress: (1 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'actionReleased', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'sequenceProgress', detail: { key: $up, progress: (1 / 11) * 100, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'sequenceDropped', detail: { progress: (1 / 11) * 100, sequence: 'konami' } })],
    ]);
  });

  it('cleanup', () => {
    const emitter = createEmitter();
    const emit = vi.spyOn(emitter, 'emit');
    const handler = createKeyHandler(emitter, _nullEngine)
      .bind('up', $up)
      .bind('down', $enter, $bB, $down)
      .bind('down', $enter)
      .bind('crouch', $down)
      .bind('nonsense', $right)
      .register('konami', _10ms, ...konami)
      .register('konami', _10ms, ...konami)
      .register('dummy', _10ms, $bB);
    emit.mockClear();
    handler.unregister('konami').unregister('konami').unbind($up, $down, $left).clear('down').clear('down').reset();

    dispatchEvent(keydownUpArrowEvent);
    dispatchEvent(releaseUp);
    dispatchEvent(releaseEnter);

    expect(emit.mock.calls).toEqual([
      [expect.objectContaining({ type: 'unregister', detail: { keys: konami, sequence: 'konami' } })],
      [expect.objectContaining({ type: 'unbind', detail: { action: 'up', key: $up } })],
      [expect.objectContaining({ type: 'unbind', detail: { action: 'crouch', key: $down } })],
      [expect.objectContaining({ type: 'unbind', detail: { action: 'down', key: $enter } })],
      [expect.objectContaining({ type: 'unbind', detail: { action: 'down', key: $bB } })],
      [expect.objectContaining({ type: 'clear', detail: { action: 'down', keys: [$enter, $bB] } })],
      [expect.objectContaining({ type: 'unbind', detail: { action: 'nonsense', key: $right } })],
      [expect.objectContaining({ type: 'clear', detail: { action: 'nonsense', keys: [$right] } })],
      [expect.objectContaining({ type: 'unregister', detail: { keys: [$bB], sequence: 'dummy' } })],
    ]);
  });
});
