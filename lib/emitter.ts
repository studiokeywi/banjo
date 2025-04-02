/**
 * A wrapper around the native `EventTarget` that provides the more modern `emit/off/on/once` API over `addEventListener/dispatchEvent/removeEventListener` as well as improved IntelliSense
 *
 * @module emitter
 * @author studioKeywi */

import type { Expand, RemoveIndexSignature } from '#🪕/types';

/**
 * Create a new {@link Emitter} for use
 *
 * @template {EventsMap} Events
 * @returns {Emitter<Events>} */
export const createEmitter = <Events extends EventsMap>(): Emitter<Events> => {
  type Available = AvailableEvents<Events>;

  /** Internal {@link EventTarget} to manage the {@link Emitter} */
  const target = new EventTarget();

  /** Event emitter */
  const emitter: Emitter<Events, Available> = {
    emit(event) {
      target.dispatchEvent(event);
      return this;
    },
    off(type, handler) {
      target.removeEventListener(type, handler as never);
      return this;
    },
    on(type, handler) {
      target.addEventListener(type, handler as never);
      return this;
    },
    once(type, handler) {
      target.addEventListener(type, handler as never, { once: true });
      return this;
    },
    set(handlers) {
      let key: string;
      for (key in handlers) {
        target.addEventListener(key, handlers[key as keyof typeof handlers] as never);
      }
      return this;
    },
  };

  return emitter;
};

/**
 * Utility type that extracts non-index signature entries from an {@link EventsMap}
 */
export type AvailableEvents<Events extends EventsMap> = RemoveIndexSignature<Expand<Events>, string>;

/**
 * A wrapper for the {@link EventTarget} interface that provides the ability to provide known event name/types
 */
export interface Emitter<Events extends EventsMap, Available extends AvailableEvents<Events> = AvailableEvents<Events>> {
  /**
   * Emits a new event of the given type to all attached listeners
   *
   * @param {(Available)[keyof (Available)]} event
   * @returns {this} */
  emit(event: Available[keyof Available]): this;

  /**
   * Add a new event listener for the given event type
   *
   * @template {keyof (Available) & string} Type
   * @template {(Available)[Type] & Event} EventType
   * @param {Type} type
   * @param {Handler<EventType>} handler
   * @returns {this} */
  off<const Type extends keyof Available & string>(type: Type, handler: (event: Available[Type]) => void | Promise<void>): this;

  /**
   * Add a new event listener for the given event type
   *
   * @template {keyof Available & string} Type
   * @param {Type} type
   * @param {(event: Available[Type]) => void | Promise<void>} handler
   * @returns {this} */
  on<const Type extends keyof Available & string>(type: Type, handler: (event: Available[Type]) => void | Promise<void>): this;

  /**
   * Add a new event listener for the given event type that only executes once
   *
   * @template {keyof Available & string} Type
   * @param {Type} type
   * @param {(event: Available[Type]) => void | Promise<void>} handler
   * @returns {this} */
  once<const Type extends keyof Available & string>(type: Type, handler: (event: Available[Type]) => void | Promise<void>): this;

  /**
   * Set multiple event listeners at once through a single object
   *
   * @param {Partial<{ [Key in keyof Available]: (event: Available[Key]) => void | Promise<void> }>} handlers
   * @returns {this} */
  set(handlers: Partial<{ [Key in keyof Available]: (event: Available[Key]) => void | Promise<void> }>): this;
}

/**
 * Utility type for mapping event names and event types
 */
export type EventsMap = Record<string, Event>;

/**
 * Utility type for extracting the union of named events from an {@link EventsMap}
 */
export type ExtractEvents<Events extends EventsMap> = AvailableEvents<Events>[keyof AvailableEvents<Events>];
