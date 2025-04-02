import { from, milliseconds } from '#🪕/chrono';
import type { Watcher } from '#🪕/watcher';
import { createWatcher } from '#🪕/watcher';
import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { delay } from './utils.js';

const _asyncNoOp = (): Promise<void> => Promise.resolve();
const _false = (): false => false;
const _noOp = (): void => void 0;
const _true = (): true => true;

let watcher: Watcher;

describe('createWatcher (export)', () => {
  it('creates a Watcher object', () => {
    watcher = createWatcher();
    expect(Object.keys(watcher)).toMatchObject([
      'running',
      'because',
      'begin',
      'configure',
      'do',
      'end',
      'every',
      'for',
      'start',
      'stop',
      'unless',
      'until',
      'while',
    ]);
  });

  it('only starts when stopped', () => {
    watcher = createWatcher();
    expect(watcher.start()).toEqual(true);
    expect(watcher.running).toEqual(true);
    expect(watcher.start()).toBeUndefined();
    watcher.stop();
    expect(watcher.running).toEqual(false);
  });

  it('only stops when started', () => {
    watcher = createWatcher();
    expect(watcher.stop()).toBeUndefined();
    watcher.start();
    expect(watcher.stop()).toEqual(true);
  });

  it('handles arbitrary config', () => {
    watcher = createWatcher();
    expect(watcher.configure()).toBe(watcher);
  });

  describe('execution order', () => {
    const $because = vi.fn(_false).mockName('because');
    const $begin = vi.fn(_noOp).mockName('begin');
    const $do = vi.fn(_noOp).mockName('do');
    const $end = vi.fn(_noOp).mockName('end');
    const $unless = vi.fn(_false).mockName('unless') as Mock<() => boolean>;
    const $until = vi.fn(_false).mockName('until');
    const $while = vi.fn(_true).mockName('while');

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('sync `.do` function', () => {
      const _every = from('20 milliseconds');
      const _for = from('1 seconds');
      watcher = createWatcher({
        because: $because,
        begin: $begin,
        do: $do,
        end: $end,
        every: _every,
        for: _for,
        unless: $unless,
        until: $until,
        while: $while,
      });
      watcher.start();
      expect($begin.mock.invocationCallOrder).toEqual([1]);
      expect($begin).toHaveBeenCalledTimes(1);
      expect($unless.mock.invocationCallOrder).toEqual([2]);
      expect($unless).toHaveBeenCalledTimes(1);
      expect($while.mock.invocationCallOrder).toEqual([3]);
      expect($while).toHaveBeenCalledTimes(1);
      expect($do.mock.invocationCallOrder).toEqual([4]);
      expect($do).toHaveBeenCalledTimes(1);
      expect($until.mock.invocationCallOrder).toEqual([5]);
      expect($until).toHaveBeenCalledTimes(1);
      expect($because.mock.invocationCallOrder).toEqual([6]);
      expect($because).toHaveBeenCalledTimes(1);
      expect($end.mock.invocationCallOrder).toEqual([7]);
      expect($end).toHaveBeenCalledTimes(1);
    });

    it('sync `.do` function (alt bailout condition)', () => {
      const $unless = vi.fn(_true).mockName('unless');
      watcher = createWatcher({ because: $because, do: $do, unless: $unless });
      watcher.start();
      expect($because).toHaveBeenCalledTimes(0);
      expect($do).toHaveBeenCalledTimes(0);
      expect($unless).toHaveBeenCalledTimes(1);
      expect($unless.mock.invocationCallOrder).toEqual([8]);
    });

    it('async `.do` function', async () => {
      const $do = vi.fn(_asyncNoOp).mockName('do');
      watcher = createWatcher({ because: $because, do: $do });
      watcher.start();
      expect(watcher.running).toEqual(true);
      await delay(milliseconds(1));
      expect(watcher.running).toEqual(false);
      expect($do).toHaveBeenCalledTimes(1);
      expect($do.mock.invocationCallOrder).toEqual([9]);
      expect($because).toHaveBeenCalledTimes(1);
      expect($because.mock.invocationCallOrder).toEqual([10]);
    });
  });
});
