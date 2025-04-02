/**
 * Event handling for keyboards
 *
 * @module input/keyboard
 * @author studioKeywi */

// TODO: hard parts note etc (JSDocs)
import type { Chrono } from '#🪕/chrono';
import type { Emitter, EventsMap } from '#🪕/emitter';
import type { Engine } from '#🪕/engine';
import type { KeyData } from '#🪕/input/keys';

/**
 * Handles key presses and updates action state as appropriate
 *
 * @param {ActionBundle} actionBundle
 * @internal */
const actionHandler = <Events extends EventsMap = NonNullable<unknown>>({ action, allActions, emitter, key, pressed, type }: ActionBundle<Events>) => {
  if (!matchesData(pressed, key)) {
    return;
  }
  // NOTE: can we be guaranteed that this exists due to binding mechanics? So far, it's fine but [unknown, unknown] errors exist
  const actionData = allActions.get(action)!;
  if (type === 'keydown') {
    if (actionData.state === 0) {
      actionData.state = 1;
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new ActionPressed({ action, key }) as never);
    } else {
      actionData.state = 2;
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new ActionHeld({ action, key }) as never);
    }
  }
  if (type === 'keyup') {
    actionData.state = 0;
    // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
    emitter.emit(new ActionReleased({ action, key }) as never);
  }
};
/**
 * {@link KeyboardEvent} handler that in turn calls key press and sequence press logic
 *
 * @param {KeyboardEvent} event
 * @internal */
const createListener = <Events extends EventsMap = NonNullable<unknown>>({ allActions, allBinds, allSequences, emitter }: ListenerConfig<Events>) => {
  // TODO: there should be better logic for if/when to preventDefault/stopImmediate instead of always/never doing it -- maybe return result from action/sequence handler and reduce over it
  return (event: KeyboardEvent) => {
    // event.preventDefault();
    // event.stopImmediatePropagation();
    const pressed = { altKey: event.altKey, code: event.code, ctrlKey: event.ctrlKey, key: event.key, metaKey: event.metaKey, shiftKey: event.shiftKey };
    for (const [key, action] of allBinds) {
      actionHandler({ action, allActions, emitter, key, pressed, type: event.type });
    }
    if (event.type !== 'keyup') {
      return;
    }
    for (const [sequence, data] of allSequences) {
      sequenceHandler({ data, emitter, pressed, sequence });
    }
  };
};
/**
 * Returns a float representing sequence completion progress from [0-100]
 *
 * @param {number} cur
 * @param {number} max
 * @returns {number}
 * @internal */
const currentProgress = (cur: number, max: number): number => (cur / max) * 100;
/**
 * Ends a sequence's progress, including event dispatch
 *
 * @param {SequenceData} data
 * @param {Sequence} sequence
 * @internal */
const dropSequence = <Events extends EventsMap = NonNullable<unknown>>(data: SequenceData, sequence: unknown, emitter: Emitter<Events>) => {
  // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
  emitter.emit(new SequenceDropped({ progress: currentProgress(data.progress.length, data.keys.length), sequence }) as never);
  resetSequence(data);
};
/**
 * Equality guard for JS objects that only use non-object/non-array primitive values. As long as the value provided for `match` contains equivalent values
 * to the source `obj`, this returns true
 *
 * @param {object} source Object whose properties are the source of truth
 * @param {object} target Object whose properties are to be checked against the source
 * @returns {boolean}
 * @internal */
const matchesData = (source: object, target: object): boolean => {
  for (const key in target) {
    if (target[key as never] !== source[key as never]) {
      return false;
    }
  }
  return true;
};
/**
 * Resets a {@link SequenceData} progress for reuse
 *
 * @param {SequenceData} data
 * @internal */
const resetSequence = (data: SequenceData) => {
  data.progress.splice(0, data.progress.length);
  clearTimeout(data.decaying!);
  data.decaying = null;
};
/**
 * Handles key presses and updates sequence state as appropriate
 *
 * @param {SequenceBundle} sequenceBundle
 * @internal */
const sequenceHandler = <Events extends EventsMap = NonNullable<unknown>>({ data, emitter, pressed, sequence }: SequenceBundle<Events>) => {
  // let inSequence = false;
  // for (const key of data.keys)
  const {
    keys,
    keys: { length: keysLength },
    progress,
    progress: { length: progLength },
  } = data;

  // NOTE: key not in sequence
  if (!keys.some(key => matchesData(pressed, key))) {
    if (progLength) {
      dropSequence(data, sequence, emitter);
    }
    return;
  }
  const nextKey = keys[progLength];
  // NOTE: key not next in sequence
  if (!matchesData(pressed, nextKey)) {
    dropSequence(data, sequence, emitter);
    return;
  }
  progress.push(pressed);
  // NOTE: key was last in sequence
  if (progress.length === keysLength) {
    // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
    emitter.emit(new SequenceComplete({ key: pressed, sequence }) as never);
    resetSequence(data);
    return;
  }
  // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
  emitter.emit(new SequenceProgress({ key: pressed, progress: currentProgress(progress.length, keysLength), sequence }) as never);
  clearTimeout(data.decaying!);
  data.decaying = setTimeout(dropSequence, data.decay, data, sequence, emitter) as never;
};

/**
 * The KeyboardHandler provides utilities around binding keyboard input to "actions" (single key presses of significance) and "sequences" (series of key
 * presses in exact order within a set rate of input)
 *
 * @template Action
 * @template Sequence
 * @param {Emitter<Events>} emitter
 * @returns {KeyboardHandler<Action, Sequence>} */
export const createKeyHandler = <const Action = string, const Sequence = string, const Events extends EventsMap = NonNullable<unknown>>(
  emitter: Emitter<Events>,
  engine: Engine<Events, Action, Sequence>
): KeyboardHandler<Action, Sequence, Events> => {
  /** Map of "actions" bound to keys that are associated with the action and the action's {@link HeldState} */
  const allActions = new Map<Action, ActionData>();
  /** Map of keys bound to the actions they trigger */
  const allBinds = new Map<KeyData, Action>();
  /** Map of "sequences" bound to  */
  const allSequences = new Map<Sequence, SequenceData>();
  /** Whether the keyboard handling listener has been attached */
  let attached = false;
  /** Event listener that translates DOM events into game events */
  const listener = createListener({ allActions, allBinds, allSequences, emitter });

  // SECTION: API
  const actionKeys: KeyboardHandler<Action, Sequence, Events>['actionKeys'] = action => allActions.get(action)?.keys;
  const actionState: KeyboardHandler<Action, Sequence, Events>['actionState'] = action => allActions.get(action)?.state;
  const bind: KeyboardHandler<Action, Sequence, Events>['bind'] = (action, ...keys) => {
    if (!allActions.has(action)) {
      allActions.set(action, { keys: [], state: 0 });
    }
    const actionData = allActions.get(action)!;
    for (const key of keys) {
      // NOTE: key already was bound to this action -- nothing else required
      if (actionData.keys.some(exists => matchesData(exists, key))) {
        continue;
      }
      handler.unbind(key);
      actionData.keys.push(key);
      allBinds.set(key, action);
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new KeyBind({ action, key }) as never);
    }
    allActions.set(action, actionData);
    return handler;
  };
  const clear: KeyboardHandler<Action, Sequence, Events>['clear'] = (...actions) => {
    for (const action of actions) {
      const actionData = allActions.get(action);
      if (actionData) {
        const keys = actionData.keys.slice();
        handler.unbind(...keys);
        // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
        emitter.emit(new ActionCleared({ action, keys }) as never);
        allActions.delete(action);
      }
    }
    return handler;
  };
  const keyState: KeyboardHandler<Action, Sequence, Events>['keyState'] = key => actionState(allBinds.get(key)!);
  const register: KeyboardHandler<Action, Sequence, Events>['register'] = (sequence, decay, ...keys) => {
    const sequenceData = allSequences.get(sequence);
    if (!sequenceData) {
      allSequences.set(sequence, { decay: decay.milliseconds, decaying: null, keys, progress: [] });
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new SequenceRegistered({ sequence, keys }) as never);
    }
    return handler;
  };
  const reset: KeyboardHandler<Action, Sequence, Events>['reset'] = () => {
    allBinds.forEach(action => {
      handler.clear(action);
    });
    allSequences.forEach((...[, sequence]) => {
      handler.unregister(sequence);
    });
    return handler;
  };
  const sequenceProgress: KeyboardHandler<Action, Sequence, Events>['sequenceProgress'] = sequence => {
    const sequenceData = allSequences.get(sequence);
    return sequenceData ? currentProgress(sequenceData.progress.length, sequenceData.keys.length) : 0;
  };
  const start: KeyboardHandler<Action, Sequence, Events>['start'] = () => {
    if (!attached) {
      attached = true;
      addEventListener('keydown', listener);
      addEventListener('keyup', listener);
    }
    return handler;
  };
  const stop: KeyboardHandler<Action, Sequence, Events>['stop'] = () => {
    if (attached) {
      attached = false;
      removeEventListener('keydown', listener);
      removeEventListener('keyup', listener);
    }
    return handler;
  };
  const unbind: KeyboardHandler<Action, Sequence, Events>['unbind'] = (...keys) => {
    for (const key of keys) {
      const action = allBinds.get(key);
      if (!action) {
        continue;
      }
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new KeyUnbind({ action, key }) as never);
      allBinds.delete(key);
      // NOTE: can we be guaranteed that this exists due to binding mechanics? So far, it's fine but [unknown, unknown] errors exist
      const actionData = allActions.get(action)!;
      actionData.keys = actionData.keys.filter(boundKey => !matchesData(boundKey, key));
    }
    return handler;
  };
  const unregister: KeyboardHandler<Action, Sequence, Events>['unregister'] = (...sequences) => {
    for (const sequence of sequences) {
      const sequenceData = allSequences.get(sequence);
      if (!sequenceData) {
        continue;
      }
      // TODO: can we fix this to not be "as never" but also have the correct typing for consumers?
      emitter.emit(new SequenceUnregistered({ sequence, keys: sequenceData.keys }) as never);
      allSequences.delete(sequence);
    }
    return handler;
  };

  const handler = {
    get engine() {
      return engine;
    },
    actionKeys,
    actionState,
    bind,
    clear,
    keyState,
    register,
    reset,
    sequenceProgress,
    start,
    stop,
    unbind,
    unregister,
  };
  return handler;
};

/**
 * Bundled data used to handle key presses as actions
 *
 * @internal */
interface ActionBundle<Events extends EventsMap = NonNullable<unknown>> {
  /**
   * The action identifier
   */
  action: unknown;
  /**
   * Map of identifiers and relevant metadata
   */
  allActions: Map<unknown, ActionData>;
  /**
   * Event emitter
   */
  emitter: Emitter<Events>;
  /**
   * Key to check
   */
  key: KeyData;
  /**
   * Key that was pressed
   */
  pressed: KeyData;
  /**
   * Keyboard event type
   */
  type: string;
}

/**
 * Metadata around a keyboard action
 */
export interface ActionData {
  /**
   * Keys that can change an action's state
   */
  keys: KeyData[];
  /**
   * The current action state
   */
  state: HeldState;
}

/**
 * Represents the state of a given action registered to the keyboard handler
 *
 * `0` - Not held/Released
 * `1` - Pressed
 * `2` - Held */
export type HeldState = 0 | 1 | 2;

/**
 * TODO: JSDocs
 */
export class ActionCleared<Action = string> extends CustomEvent<{ action: Action; keys: KeyData[] }> {
  constructor(detail: { action: Action; keys: KeyData[] }) {
    super('clear', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class ActionHeld<Action = string> extends CustomEvent<{ action: Action; key: KeyData }> {
  constructor(detail: { action: Action; key: KeyData }) {
    super('actionHeld', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class ActionPressed<Action = string> extends CustomEvent<{ action: Action; key: KeyData }> {
  constructor(detail: { action: Action; key: KeyData }) {
    super('actionPressed', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class ActionReleased<Action = string> extends CustomEvent<{ action: Action; key: KeyData }> {
  constructor(detail: { action: Action; key: KeyData }) {
    super('actionReleased', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class KeyBind<Action = string> extends CustomEvent<{ action: Action; key: KeyData }> {
  constructor(detail: { action: Action; key: KeyData }) {
    super('bind', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class KeyUnbind<Action = string> extends CustomEvent<{ action: Action; key: KeyData }> {
  constructor(detail: { action: Action; key: KeyData }) {
    super('unbind', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class SequenceComplete<Sequence = string> extends CustomEvent<{ key: KeyData; sequence: Sequence }> {
  constructor(detail: { key: KeyData; sequence: Sequence }) {
    super('sequenceComplete', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class SequenceDropped<Sequence = string> extends CustomEvent<{ progress: number; sequence: Sequence }> {
  constructor(detail: { progress: number; sequence: Sequence }) {
    super('sequenceDropped', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class SequenceProgress<Sequence = string> extends CustomEvent<{ key: KeyData; progress: number; sequence: Sequence }> {
  constructor(detail: { key: KeyData; progress: number; sequence: Sequence }) {
    super('sequenceProgress', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class SequenceRegistered<Sequence = string> extends CustomEvent<{ keys: KeyData[]; sequence: Sequence }> {
  constructor(detail: { keys: KeyData[]; sequence: Sequence }) {
    super('register', { detail });
  }
}

/**
 * TODO: JSDocs
 */
export class SequenceUnregistered<Sequence = string> extends CustomEvent<{ keys: KeyData[]; sequence: Sequence }> {
  constructor(detail: { keys: KeyData[]; sequence: Sequence }) {
    super('unregister', { detail });
  }
}

/**
 * Events that can be emitted during keyboard handling
 *
 * @template Action
 * @template Sequence */
export interface InputEvents<Action = string, Sequence = string> {
  /**
   * TODO: JSDocs
   */
  actionHeld: ActionHeld<Action>;
  /**
   * TODO: JSDocs
   */
  actionPressed: ActionPressed<Action>;
  /**
   * TODO: JSDocs
   */
  actionReleased: ActionReleased<Action>;
  /**
   * TODO: JSDocs
   */
  bind: KeyBind<Action>;
  /**
   * TODO: JSDocs
   */
  clear: ActionCleared<Action>;
  /**
   * TODO: JSDocs
   */
  register: SequenceRegistered<Sequence>;
  /**
   * TODO: JSDocs
   */
  sequenceComplete: SequenceComplete<Sequence>;
  /**
   * TODO: JSDocs
   */
  sequenceDropped: SequenceDropped<Sequence>;
  /**
   * TODO: JSDocs
   */
  sequenceProgress: SequenceProgress<Sequence>;
  /**
   * TODO: JSDocs
   */
  unbind: KeyUnbind<Action>;
  /**
   * TODO: JSDocs
   */
  unregister: SequenceUnregistered<Sequence>;
}

/**
 * The KeyboardHandler manages keyboard based events and translates into game events
 *
 * @template Action
 * @template Sequence */
export interface KeyboardHandler<Action = string, Sequence = string, Events extends EventsMap = NonNullable<unknown>> {
  /**
   * TODO: JSDocs
   */
  get engine(): Engine<Events, Action, Sequence>;
  /**
   * Get the list of keys that are bound to a given action
   *
   * @param {Action} action
   * @returns {KeyData[] | undefined} */
  actionKeys(action: Action): KeyData[] | undefined;
  /**
   * Get the hold state of a given action
   *
   * @param {Action} action
   * @returns {HeldState | undefined} */
  actionState(action: Action): HeldState | undefined;
  /**
   * Binds one or more keys to an action
   *
   * @param {Action} action
   * @param {KeyData[]} keys
   * @returns {this} */
  bind(action: Action, ...keys: KeyData[]): this;
  /**
   * Removes one or more actions from the handler, including unbinding any associated bound keys
   *
   * @param {Action[]} actions
   * @returns {this} */
  clear(...actions: Action[]): this;
  /**
   * Get the hold state of an action based on a key that may be bound to it
   *
   * @param {KeyData} key
   * @returns {HeldState | undefined} */
  keyState(key: KeyData): HeldState | undefined;
  /**
   * Register a new sequence
   *
   * @param {Sequence} sequence
   * @param {Chrono} decay
   * @param {KeyData[]} keys
   * @returns {this} */
  register(sequence: Sequence, decay: Chrono, ...keys: KeyData[]): this;
  /**
   * Removes all bound keys and registered sequences
   *
   * @returns {this} */
  reset(): this;
  /**
   * Get the progress of a given sequence (as a decimal value from 0-100)
   *
   * @param {Sequence} sequence
   * @returns {number} */
  sequenceProgress(sequence: Sequence): number;
  /**
   * Attaches the internal event listener to the global scope to begin processing bound keys and registered sequences
   *
   * @returns {this} */
  start(): this;
  /**
   * Removes the internal event listener from the global scope to stop processing bound keys and registered sequences
   *
   * @returns {this} */
  stop(): this;
  /**
   * Removes key binding from one or more keys
   *
   * @param {KeyData[]} keys
   * @returns {this} */
  unbind(...keys: KeyData[]): this;
  /**
   * Unregister one or more sequences
   *
   * @param {Sequence[]} sequences
   * @returns {this} */
  unregister(...sequences: Sequence[]): this;
}

/**
 * Data required to provide an appropriate key handling listener
 *
 * @internal */
interface ListenerConfig<Events extends EventsMap = NonNullable<unknown>> {
  /**
   * Map of identifiers and relevant metadata for actions
   */
  allActions: Map<unknown, ActionData>;
  /**
   * Map of key information and the actions to which they are bound
   */
  allBinds: Map<KeyData, unknown>;
  /**
   * Map of identifiers and relevant metadata for sequences
   */
  allSequences: Map<unknown, SequenceData>;
  /**
   * Event emitter
   */
  emitter: Emitter<Events>;
}

/**
 * Bundled data used to handle key presses during a sequence
 *
 * @internal */
interface SequenceBundle<Events extends EventsMap = NonNullable<unknown>> {
  /**
   * Sequence metadata
   */
  data: SequenceData;
  /**
   * Event emitter
   */
  emitter: Emitter<Events>;
  /**
   * Key that was pressed
   */
  pressed: KeyData;
  /**
   * The sequence identifier
   */
  sequence: unknown;
}

/**
 * Metadata around a keyboard sequence
 */
export interface SequenceData {
  /**
   * Duration allowed between key presses (in ms)
   */
  decay: number;
  /**
   * Identifier used for timeouts that drop sequences after the decay period
   */
  decaying: number | null;
  /**
   * In order sequence of keys to press
   */
  keys: KeyData[];
  /**
   * Keys pressed in the sequence so far
   */
  progress: KeyData[];
}
