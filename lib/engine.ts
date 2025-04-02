/**
 * The core "game engine" in terms of responsibility. Features an `emitter` that can be used across game concerns, a `loop` that executes provided code, and an `input/keyboard` handler
 *
 * @module engine
 * @author studioKeywi */

// TODO: Probably should have an injectable system for input handler(s) instead of one hardcoded keyboard handler
// TODO: cleanup coverage on the skipped handler/event/etc
import { milliseconds } from '#🪕/chrono';
import type { AvailableEvents, Emitter, EventsMap } from '#🪕/emitter';
import { createEmitter } from '#🪕/emitter';
import { throttle } from '#🪕/hof';
import type { InputEvents, KeyboardHandler } from '#🪕/input/keyboard';
import { createKeyHandler } from '#🪕/input/keyboard';
import { createRLL } from '#🪕/loop';
import { withinLastSecond } from '#🪕/timing';

/**
 * Create a new {@link Engine} for use. The provided config will determine the TPS rate for the engine, and the FPS rate will
 * attempt to match the user's monitor refresh rate
 *
 * @template {EventsMap} Events
 * @template Action
 * @template Sequence
 * @param {EngineConfig} cfg
 * @returns {Engine<EngineEvents & GameEvents & InputEvents<Action, Sequence>, Action, Sequence>} */
export const createEngine = <const GameEvents extends EventsMap = NonNullable<unknown>, const Action = string, const Sequence = string>(
  cfg: EngineConfig<GameEvents, Action, Sequence>
): Engine<EngineEvents & GameEvents & InputEvents<Action, Sequence>, Action, Sequence> => {
  /** Internal throttle rate for displaying estimated FPS/TPS */
  const tickAndFrameUpdateRate = milliseconds(250);

  /** Timer identifier for the mark cleaning callback */
  let cleanMarks: number;

  /** Cleans up the performance timeline of "rendered" and "updated" marks over time (prevents slowdown in tracking FPS/TPS) */
  const resetMarks: TimerHandler = () => {
    // Stryker disable next-line EqualityOperator: We don't care about the mutant `performance.getEntries().length <= 25_000`
    if (performance.getEntries().length < 25_000) return;
    const rendered = performance.getEntriesByName('rendered', 'mark').slice(-150);
    const updated = performance.getEntriesByName('updated', 'mark').slice(-150);
    performance.clearMarks('rendered');
    performance.clearMarks('updated');
    rendered.concat(updated).forEach(({ name, startTime }) => performance.mark(name, { startTime }));
  };

  /** Wrapper for {@link EventTarget} */
  const emitter = createEmitter<EngineEvents & GameEvents & InputEvents<Action, Sequence>>()
    .on('rendered', () => {
      performance.mark('rendered');
    })
    .on('updated', () => {
      performance.mark('updated');
    })
    .on('enginePaused', evt => {
      if (evt.detail.state) {
        clearInterval(cleanMarks);
        cleanMarks = 0;
      } else {
        cleanMarks = setInterval(resetMarks);
      }
    })
    .on('engineStarted', () => {
      if (cleanMarks) return;
      cleanMarks = setInterval(resetMarks);
    })
    .on('engineStopped', () => {
      if (!cleanMarks) return;
      clearInterval(cleanMarks);
      cleanMarks = 0;
    });
  /** FPS checker that is rate limited to every quarter second */
  const FPS = throttle(() => withinLastSecond('rendered'), tickAndFrameUpdateRate);
  /** Actual expected time between logic updates */
  const timePerTick = 1_000 / cfg.TPS;
  /** TPS checker that is rate limited to every quarter second */
  const TPS = throttle(() => withinLastSecond('updated'), tickAndFrameUpdateRate);

  /** Game loop data */
  const gameLoop = createRLL({
    onFrame(delta) {
      cfg.render(delta / timePerTick);
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new RenderRan() as never);
    },
    onSkip(delta) {
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new SkippedFrames((delta - 1_000) / timePerTick) as never);
    },
    onTick(delta) {
      cfg.update(delta);
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new UpdateRan() as never);
    },
    tickRate: milliseconds(timePerTick),
  });

  /** Engine */
  const engine: Engine<GameEvents & EngineEvents & InputEvents<Action, Sequence>, Action, Sequence> = {
    get FPS() {
      return FPS();
    },
    get paused() {
      return gameLoop.paused;
    },
    get running() {
      return gameLoop.running;
    },
    get TPS() {
      return TPS();
    },
    get keyboardHandler() {
      return keyboard;
    },
    emit(event) {
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(event);
      return this;
    },
    off(type, handler) {
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.off(type as never, handler as (evt: Event) => void);
      return this;
    },
    on(type, handler) {
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.on(type as never, handler as (evt: Event) => void);
      return this;
    },
    once(type, handler) {
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.once(type as never, handler as (evt: Event) => void);
      return this;
    },
    pause() {
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new EnginePaused({ time: performance.now(), state: gameLoop.pause() }) as never);
      return this;
    },
    set(handlers) {
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.set(handlers as never);
      return this;
    },
    start() {
      if (gameLoop.start()) {
        // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
        emitter.emit(new EngineStarted(performance.now()) as never);
      }
      return this;
    },
    stop() {
      if (gameLoop.stop()) {
        // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
        emitter.emit(new EngineStopped(performance.now()) as never);
      }
      return this;
    },
  };
  /** Input handler */
  // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
  const keyboard = createKeyHandler(emitter as never, engine);

  return engine;
};

/**
 * Utility wrapper around `CustomEvent<{ state: boolean; time: number }>` for used for `instanceof` level of Event matching if needed
 */
export class EnginePaused extends CustomEvent<{ state: boolean; time: number }> {
  constructor(detail: { state: boolean; time: number }) {
    super('enginePaused', { detail });
  }
}

/**
 * Utility wrapper around `CustomEvent<number>` for used for `instanceof` level of Event matching if needed
 */
export class EngineStarted extends CustomEvent<number> {
  constructor(detail: number) {
    super('engineStarted', { detail });
  }
}

/**
 * Utility wrapper around `CustomEvent<number>` for used for `instanceof` level of Event matching if needed
 */
export class EngineStopped extends CustomEvent<number> {
  constructor(detail: number) {
    super('engineStopped', { detail });
  }
}

/**
 * Utility wrapper around `CustomEvent<void>` for used for `instanceof` level of Event matching if needed
 */
export class RenderRan extends CustomEvent<void> {
  constructor() {
    super('rendered');
  }
}

/**
 * Utility wrapper around `CustomEvent<number>` for used for `instanceof` level of Event matching if needed
 */
export class SkippedFrames extends CustomEvent<number> {
  constructor(detail: number) {
    super('skippedFrames', { detail });
  }
}

/**
 * Utility wrapper around `CustomEvent<void>` for used for `instanceof` level of Event matching if needed
 */
export class UpdateRan extends CustomEvent<void> {
  constructor() {
    super('updated');
  }
}

/**
 * Game engine providing only the basics of a game loop and event dispatching system
 */
export interface Engine<GameEvents extends EventsMap = NonNullable<unknown>, Action = string, Sequence = string> {
  /**
   * The current (approximate) frames per second
   */
  readonly FPS: number;

  /**
   * Reference to the input handler object for key binding
   */
  readonly keyboardHandler: KeyboardHandler<Action, Sequence, GameEvents>;

  /**
   * Whether the engine is currently paused
   */
  readonly paused: boolean;

  /**
   * Whether the engine is currently running
   */
  readonly running: boolean;

  /**
   * The current (approximate) ticks per second
   */
  readonly TPS: number;

  /**
   * Emits a new event through the engine
   *
   * @param {(GameEvents & EngineEvents & InputEvents<Action, Sequence>)[keyof (GameEvents & EngineEvents & InputEvents<Action, Sequence>)]} event
   * @returns {this} */
  emit(event: Parameters<Emitter<GameEvents & CombinedEvents<Action, Sequence>>['emit']>[0]): this;

  /**
   * Remove an event listener from the engine
   *
   * @template {keyof (GameEvents & EngineEvents & InputEvents<Action, Sequence>) & string} Type
   * @template {(GameEvents & EngineEvents & InputEvents<Action, Sequence>)[Type] & Event} EventType
   * @param {Type} type
   * @param {Handler<EventType>} handler
   * @returns {this} */
  off<Events extends AvailableEvents<GameEvents & CombinedEvents<Action, Sequence>>, const Type extends keyof Events>(
    type: Type,
    handler: (event: Events[Type]) => void
  ): this;

  /**
   * Add a new event listener to the engine
   *
   * @template {keyof (GameEvents & EngineEvents & InputEvents<Action, Sequence>) & string} Type
   * @template {(GameEvents & EngineEvents & InputEvents<Action, Sequence>)[Type] & Event} EventType
   * @param {Type} type
   * @param {Handler<EventType>} handler
   * @returns {this} */
  on<Events extends AvailableEvents<GameEvents & CombinedEvents<Action, Sequence>>, const Type extends keyof Events>(
    type: Type,
    handler: (event: Events[Type]) => void
  ): this;

  /**
   * Add a new event listener to the engine that only executes once
   *
   * @template {keyof (GameEvents & EngineEvents & InputEvents<Action, Sequence>) & string} Type
   * @template {(GameEvents & EngineEvents & InputEvents<Action, Sequence>)[Type] & Event} EventType
   * @param {Type} type
   * @param {Handler<EventType>} handler
   * @returns {this} */
  once<Events extends AvailableEvents<GameEvents & CombinedEvents<Action, Sequence>>, const Type extends keyof Events>(
    type: Type,
    handler: (event: Events[Type]) => void
  ): this;

  /**
   * Set multiple event listeners to the engine at once through a single object
   *
   * @param {Partial<{ [Key in keyof Available]: (event: Available[Key]) => void | Promise<void> }>} handlers
   * @returns {this} */
  set<Events extends AvailableEvents<GameEvents & CombinedEvents<Action, Sequence>>>(
    handlers: Partial<{
      [Key in keyof Events]: (event: Events[Key]) => void | Promise<void>;
    }>
  ): this;

  /**
   * Pause or unpause the engine
   */
  pause(): this;

  /**
   * Start the engine (if it is not running)
   */
  start(): this;

  /**
   * Stop the engine (if it is running)
   */
  stop(): this;
}

/**
 * TODO: JSDocs
 */
export type CombinedEvents<Action, Sequence> = EngineEvents & InputEvents<Action, Sequence>;

/**
 * Information for the engine to utilize
 */
export interface EngineConfig<GameEvents extends EventsMap = NonNullable<unknown>, Action = string, Sequence = string> {
  /**
   * TODO: JSDocs
   */
  actions?: Action[] | readonly Action[];

  /**
   * TODO: JSDocs
   */
  events?: GameEvents;

  /**
   * Target ticks per second for logic updates
   */
  TPS: number;

  /**
   * Rendering function for the engine to execute
   *
   * @param {number} [delta] Fraction of a full game tick that occurred before this frame */
  render(delta: number): void;

  /**
   * TODO: JSDocs
   */
  sequences?: Sequence[] | readonly Sequence[];

  /**
   * Logic updating function for the engine to execute
   *
   * @param {number} [delta] The portion of a second elapsed representing one tick of the engine. Equal to 1_000 / TPS */
  update(delta: number): void;
}

/**
 * Events emitted by the engine
 */
export interface EngineEvents extends EventsMap {
  /**
   * Emitted when {@link Engine.pause} pauses or unpauses the engine. Contains the current pause state and the time as provided by `performance.now()`
   */
  enginePaused: EnginePaused;

  /**
   * Emitted when {@link Engine.start} begins the loop. Contains the time as provided by `performance.now()`
   */
  engineStarted: EngineStarted;

  /**
   * Emitted when {@link Engine.stop} ends the loop. Contains the time as provided by `performance.now()`
   */
  engineStopped: EngineStopped;

  /**
   * Emitted every game tick when the {@link EngineConfig.update} function is called
   */
  updated: UpdateRan;

  /**
   * Emitted every display tick when the {@link EngineConfig.render} function is called
   */
  rendered: RenderRan;

  /**
   * Emitted if the elapsed time from the previous display tick is greater than 1 second. Contains the amount of time that
   * elapsed beyond 1 second as provided by the difference of two `performance.now()` calls
   */
  skippedFrames: SkippedFrames;
}
