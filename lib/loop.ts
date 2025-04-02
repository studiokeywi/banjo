/**
 * A rate-limited loop pattern. Designed to execute an "update" function at a provided tick rate, and a "render" function at the user's monitor's refresh rate
 *
 * @module loop
 * @author studioKeywi */

import type { Chrono } from '#🪕/chrono';
import type { GenericFunction } from '#🪕/types';

/**
 * Build a new rate limited loop. A rate limited loop will attempt to run a callback at a consistent interval (known as a tick)
 * and a separate callback at a consistent interval based on the user's monitor refresh rate
 *
 * @param {RLLConfig} config
 * @returns {RateLimitedLoop} */
export const createRLL = ({ onFrame, onSkip, onTick, tickRate }: RLLConfig): RateLimitedLoop => {
  /** ID of the last requested animation frame */
  let requestedFrame = -1;
  /** Last time (in ms) as reported from `performance.now()` */
  let lastStamp: number;
  /** Portion of time accumulated beyond the expected target time per tick */
  let accumulated = 0;

  let paused = false;

  /** Converted target time per tick from input Chrono (as milliseconds) */
  const timePerTick = tickRate.milliseconds;

  /** Core of the loop (run as individual steps controlled by `requestAnimationFrame()`) */
  const step = (now: number) => {
    requestedFrame = requestAnimationFrame(step);
    if (!lastStamp || paused) {
      lastStamp = now;
      return;
    }
    let delta = now - lastStamp;
    // Stryker disable next-line EqualityOperator: We don't care about the mutant `delta >= 1_000`
    if (delta > 1_000) {
      onSkip(delta);
      delta = timePerTick;
    }
    accumulated += delta;
    // Stryker disable next-line BlockStatement, EqualityOperator: If mutant `accumulated < timePerTick` or `{}` happened, it would infinite loop
    while (accumulated >= timePerTick) {
      onTick(timePerTick);
      accumulated -= timePerTick;
    }
    onFrame(accumulated);
    lastStamp = now;
  };

  /** Rate Limited Loop */
  const rll: RateLimitedLoop = {
    get paused() {
      return paused;
    },
    get running() {
      return requestedFrame !== -1;
    },
    pause() {
      return (paused = !paused);
    },
    start() {
      if (requestedFrame === -1) {
        requestedFrame = requestAnimationFrame(step);
        return true;
      }
      return false;
    },
    stop() {
      if (requestedFrame !== -1) {
        cancelAnimationFrame(requestedFrame);
        requestedFrame = -1;
        return true;
      }
      return false;
    },
  };

  return rll;
};

/**
 * A rate limited loop attempts to run an update function on a consistent interval, and a render function as fast as the
 * monitor's refresh rate
 */
export interface RateLimitedLoop {
  /**
   * Whether the rate limited loop is currently paused
   */
  get paused(): boolean;

  /**
   * Whether the rate limited loop is currently running
   */
  get running(): boolean;

  /**
   * Pause or unpause the loop. Unlike stopping, this persists the internal `requestAnimationFrame` calls
   */
  pause: () => boolean;

  /**
   * Start the rate limited loop
   */
  start: () => boolean;

  /**
   * Stop the rate limited loop
   */
  stop: () => boolean;
}

/**
 * Configuration for a rate limited loop
 */
export interface RLLConfig {
  /**
   * Callback to run on every frame (limited by `requestAnimationFrame`)
   *
   * @param {number} delta */
  onFrame: DeltaCallback;

  /**
   * Callback to run when ticks/frames are skipped (limited by `requestAnimationFrame`)
   *
   * @param {number} delta */
  onSkip: DeltaCallback;

  /**
   * Callback to run on every tick (limited by `rate`)
   *
   * @param {number} delta */
  onTick: DeltaCallback;

  /**
   * Target time per tick
   */
  tickRate: Chrono;
}

// type DeltaAsyncCallback = GenericAsyncFunction<void, [delta: number]>;
/**
 * TODO: JSDocs
 *
 * @internal */
export type DeltaCallback = GenericFunction<void, [delta: number]>;
