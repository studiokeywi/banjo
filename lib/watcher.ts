/**
 * Configurable object that can manage executing functions under a variety of logical and/or timing constraints
 *
 * @module watcher
 * @author studioKeywi */

import type { Chrono } from '#🪕/chrono';
import type { CheckFunction, NoOp, RunFunction } from '#🪕/types';

/**
 * Create a new {@link Watcher}
 *
 * @param {WatcherConfig} [cfg = {}]
 * @returns {Watcher} */
export const createWatcher = (cfg: WatcherConfig = {}): Watcher => {
  // SUBSECTION: Internal State
  let $becauseThis: CheckFunction | undefined;
  let $doEveryMS: number = 100;
  let $doForMS: number = 5000;
  let $doIntervalID = -1;
  let $doThis: RunFunction | undefined;
  let $doTimeoutID: number;
  let $onBegin: NoOp | undefined;
  let $onEnd: NoOp | undefined;
  let $unlessThis: CheckFunction | undefined;
  let $untilThis: CheckFunction | undefined;
  let $whileThis: CheckFunction | undefined;

  // SUBSECTION: Internal API
  const $config = (cfg: WatcherConfig = {}): Watcher => {
    for (const key in cfg) {
      watcher[key as keyof WatcherConfig](cfg[key as keyof WatcherConfig] as never);
    }
    return watcher;
  };
  const $postCheck = () => {
    let out = false;
    if ($untilThis) {
      out ||= $terminate($untilThis());
    }
    if ($becauseThis) {
      out ||= $terminate(!$becauseThis());
    }
    return out;
  };
  const $preCheck = () => {
    let out = false;
    if ($unlessThis) out ||= $terminate($unlessThis());
    if ($whileThis) out ||= $terminate(!$whileThis());
    return out;
  };
  const $step: NoOp = () => {
    if ($preCheck()) {
      return;
    }
    let possiblePromise: unknown = null;
    if ($doThis) {
      possiblePromise = $doThis();
    }
    if (possiblePromise instanceof Promise) {
      void possiblePromise.then($postCheck);
    } else {
      $postCheck();
    }
  };
  const $terminate = (condition?: boolean) => {
    if (condition) {
      watcher.stop();
    }
    return !!condition;
  };

  const watcher: Watcher = {
    get running() {
      return $doIntervalID !== -1;
    },
    because: (becauseThis, cfg) => {
      $becauseThis = becauseThis;
      return $config(cfg);
    },
    begin: (onBegin, cfg) => {
      $onBegin = onBegin;
      return $config(cfg);
    },
    configure: cfg => {
      return $config(cfg);
    },
    do: (toRun, cfg) => {
      $doThis = toRun;
      return $config(cfg);
    },
    end: (onEnd, cfg) => {
      $onEnd = onEnd;
      return $config(cfg);
    },
    every: (doEvery, cfg) => {
      $doEveryMS = doEvery.milliseconds;
      return $config(cfg);
    },
    for: (doFor, cfg) => {
      $doForMS = doFor.milliseconds;
      return $config(cfg);
    },
    start: () => {
      if ($doIntervalID !== -1) {
        return;
      }
      if ($onBegin) {
        $onBegin();
      }
      $doIntervalID = setInterval($step as Exclude<TimerHandler, string>, $doEveryMS);
      $doTimeoutID = setTimeout(watcher.stop as Exclude<TimerHandler, string>, $doForMS); // eslint-disable-line @typescript-eslint/unbound-method
      $step();
      return true;
    },
    stop: () => {
      if ($doIntervalID === -1) {
        return;
      }
      clearInterval($doIntervalID);
      clearTimeout($doTimeoutID);
      $doIntervalID = -1;
      if ($onEnd) {
        $onEnd();
      }
      return true;
    },
    unless: (unlessThis, cfg) => {
      $unlessThis = unlessThis;
      return $config(cfg);
    },
    until: (untilThis, cfg) => {
      $untilThis = untilThis;
      return $config(cfg);
    },
    while: (whileThis, cfg) => {
      $whileThis = whileThis;
      return $config(cfg);
    },
  };

  return $config(cfg);
};

/**
 * Configuration that can be applied when using {@link Watcher.because}
 */
export type BecauseConfig = Omit<WatcherConfig, 'because'>;

/**
 * Configuration that can be applied when using {@link Watcher.begin}
 */
export type BeginConfig = Omit<WatcherConfig, 'begin'>;

/**
 * Configuration that can be applied when using {@link Watcher.do}
 */
export type DoConfig = Omit<WatcherConfig, 'do'>;

/**
 * Configuration that can be applied when using {@link Watcher.end}
 */
export type EndConfig = Omit<WatcherConfig, 'end'>;

/**
 * Configuration that can be applied when using {@link Watcher.every}
 */
export type EveryConfig = Omit<WatcherConfig, 'every'>;

/**
 * Configuration that can be applied when using {@link Watcher.for}
 */
export type ForConfig = Omit<WatcherConfig, 'for'>;

/**
 * A Watcher is a configurable system to run callback functions. They are primarily designed to work with intermittent
 * or otherwise limited duration activities.
 *
 * Watchers use a combination of `setInterval` and `setTimeout` to control the frequency and time span in which they
 * operate. Watchers provide a chainable syntax as well as the ability to pass optional configuration objects to allow
 * adjustments to be made over time.
 *
 * Timeline of Watcher behaviors:
 * - `.start()`
 * - `.begin()`
 * - Loop: Every `.every()` ms for `.for()` ms, or until `.stop()`:
 *     - `.unless()`, `.while()`
 *     - `.do()`
 *     - `.until()`, `.because()`
 * - `.end()` */
export interface Watcher {
  /**
   * Whether the Watcher is currently active
   */
  get running(): boolean;
  /**
   * Defines a new condition check function that will terminate a running {@link Watcher} after its next step, if the
   * check function returns false
   *
   * @param {CheckFunction} becauseThis
   * @param {BecauseConfig} [cfg]
   * @returns {this} */
  because(becauseThis: CheckFunction, cfg?: BecauseConfig): Watcher;
  /**
   * Defines a new callback function that runs when a {@link Watcher} is {@link Watcher.start|started}
   *
   * @param {NoOp} onBegin
   * @param {BeginConfig} [cfg]
   * @returns {this} */
  begin(onBegin: NoOp, cfg?: BeginConfig): Watcher;
  /**
   * Directly adjust all of the internal state of a {@link Watcher}
   *
   * @param {WatcherConfig} [cfg]
   * @returns {this} */
  configure(cfg?: WatcherConfig): Watcher;
  /**
   * Defines a callback function that runs on every step the {@link Watcher} takes
   *
   * @param {RunFunction} doThis
   * @param {DoConfig} [cfg]
   * @returns {this} */
  do(doThis: RunFunction, cfg?: DoConfig): Watcher;
  /**
   * Defines a new callback function that runs when a {@link Watcher} is {@link Watcher.stop|stopped}
   *
   * @param {NoOp} onEnd
   * @param {EndConfig} [cfg]
   * @returns {this} */
  end(onEnd: NoOp, cfg?: EndConfig): Watcher;
  /**
   * Defines how often the {@link Watcher} should run its associated callbacks
   *
   * @param {Chrono} doEvery
   * @param {EveryConfig} [cfg]
   * @returns {this} */
  every(doEvery: Chrono, cfg?: EveryConfig): Watcher;
  /**
   * Defines how long the {@link Watcher} should run its associated callbacks
   *
   * @param {Chrono} doFor
   * @param {ForConfig} [cfg]
   * @returns {this} */
  for(doFor: Chrono, cfg?: ForConfig): Watcher;
  /**
   * Starts the current set of configured behaviors
   *
   * @returns {true|undefined} True if the Watcher was started */
  start(): true | undefined;
  /**
   * Stops the current set of configured behaviors
   *
   * @returns {true|undefined} True if the Watcher was stopped */
  stop(): true | undefined;
  /**
   * Defines a new condition check function that will terminate a running {@link Watcher} before its next step, if the
   * check function returns true
   *
   * @param {CheckFunction} unlessThis
   * @param {UnlessConfig} [cfg]
   * @returns {this} */
  unless(unlessThis: CheckFunction, cfg?: UnlessConfig): Watcher;
  /**
   * Defines a new condition check function that will terminate a running {@link Watcher} after its next step, if the
   * check function returns true
   *
   * @param {CheckFunction} untilThis
   * @param {UntilConfig} [cfg]
   * @returns {this} */
  until(untilThis: CheckFunction, cfg?: UntilConfig): Watcher;
  /**
   * Defines a new condition check function that will terminate a running {@link Watcher} before its next step, if the
   * check function returns false
   *
   * @param {CheckFunction} whileThis
   * @param {WhileConfig} [cfg]
   * @returns {this} */
  while(whileThis: CheckFunction, cfg?: WhileConfig): Watcher;
}

/**
 * Configuration that can be applied when building a new {@link Watcher}
 */
export interface WatcherConfig {
  /**
   * An optional check function that can be used to stop a {@link Watcher} after its last step, if the check function returns false
   */
  because?: CheckFunction;
  /**
   * An optional function that can be run when {@link Watcher.start|starting} a {@link Watcher}
   */
  begin?: NoOp;
  /**
   * An optional function that will be run per step the {@link Watcher} takes
   */
  do?: RunFunction;
  /**
   * An optional function that can be run when {@link Watcher.stop|stopping} a {@link Watcher}
   */
  end?: NoOp;
  /**
   * An optional amount of time to define how often a {@link Watcher} steps. Defaults to `Chrono.milliseconds(100)`
   */
  every?: Chrono;
  /**
   * An optional amount of time to define how long a {@link Watcher} runs. Defaults to `Chrono.seconds(5)`
   */
  for?: Chrono;
  /**
   * An optional check function that can be used to stop a {@link Watcher} before its step, if the check function returns true
   */
  unless?: CheckFunction;
  /**
   * An optional check function that can be used to stop a {@link Watcher} after its last step, if the check function returns true
   */
  until?: CheckFunction;
  /**
   * An optional check function that can be used to stop a {@link Watcher} before its step, if the check function returns false
   */
  while?: CheckFunction;
}

/**
 * Configuration that can be applied when using {@link Watcher.unless}
 */
export type UnlessConfig = Omit<WatcherConfig, 'unless'>;

/**
 * Configuration that can be applied when using {@link Watcher.until}
 */
export type UntilConfig = Omit<WatcherConfig, 'until'>;

/**
 * Configuration that can be applied when using {@link Watcher.while}
 */
export type WhileConfig = Omit<WatcherConfig, 'while'>;
