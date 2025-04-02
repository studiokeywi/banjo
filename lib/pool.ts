/**
 * A utility for creating object pool that utilize the proposed [explicit resource management](https://github.com/tc39/proposal-explicit-resource-management) API to clear and restore objects to the pool when unused
 *
 * @module pool
 * @author studioKeywi */

/**
 * Create a new fixed-size object pool for a given type. Intended to be used with the `using` keyword for automatic disposal of pooled objects.
 *
 * Objects can be manually disposed of by running `member[Symbol.dispose]()` if needed.
 *
 * @template {object} Type The type of objects contained within the pool
 * @template {unknown[]} InitArgs Arguments provided when initializing a pool object
 * @param  {PoolConfig<Type, InitArgs>} config Configuration for the pool
 * @returns {ObjectPool<Type, InitArgs>} The object pool */
export const createPool = <Type extends object, InitArgs extends unknown[]>(config: PoolConfig<Type, InitArgs>): ObjectPool<Type, InitArgs> => {
  const { init, reset, spawn } = config;
  let { size } = config;
  // TODO: perf check growing array vs .from
  const pool: Pooled<Type>[] = [];
  // const pool = Array.from<Pooled<Type>>({ length: size });

  const dispose = function (this: Pooled<Type>) {
    size++;
    reset.call(this);
    this.next = available;
    available = this; // eslint-disable-line @typescript-eslint/no-this-alias
  };
  let idx: number;
  for (idx = 0; idx < size; idx++) {
    const instance = spawn();
    const member: Pooled<Type> = Object.assign(instance, { [Symbol.dispose]: dispose });
    pool[idx] = member;
    if (idx) {
      pool[idx - 1].next = member;
    }
  }

  let available = pool.at(0);
  const next = (...args: InitArgs) => {
    if (!available) {
      throw new Error(' TODO: better empty pool error message');
    }
    size--;
    const member = available;
    available = available.next;
    // TODO: do i need this at all?
    member.next = undefined;
    init.call(member, ...args);
    return member;
  };

  return Object.defineProperty({ next }, 'size', { get: () => size }) as ObjectPool<Type, InitArgs>;
};

/**
 * An object pool consists of a containing array using a (pseudo-)free list to provide reusable objects of a given type
 *
 * @template {object} Type The type of objects contained within the pool
 * @template InitArgs Arguments provided when initializing a pool object */
export interface ObjectPool<Type extends object, InitArgs extends unknown[]> {
  /** The amount of objects currently available in the pool */
  get size(): number;
  /** Get the next available object from the pool
   * @param {InitArgs} args Arguments to initialize the pooled object
   * @returns {Pooled<Type>} The pooled object */
  next(...args: InitArgs): Pooled<Type>;
}

/**
 * Configuration to provide a new object pool
 *
 * @template {object} Type The type of objects contained within the pool
 * @template InitArgs Arguments provided when initializing a pool object */
export interface PoolConfig<Type extends object, InitArgs extends unknown[]> {
  /** Initializer logic when reusing a pooled object
   * @param {InitArgs} args Arguments to initialize the pooled objected */
  init: (this: Pooled<Type>, ...args: InitArgs) => void;
  /** Reset logic when returning a pooled object */
  reset: (this: Type) => void;
  /** The total size of the object pool */
  size: number;
  /** Spawning logic when creating the object pool */
  spawn: () => Type;
}

/**
 * Wrapper type for the {@link Disposable} interface an a linked list node
 *
 * @template {object} Type The type of object being wrapped for an object pool */
export interface PoolNode<Type extends object> extends Disposable {
  /** Next node within the pool (if available) */
  next?: Type & Disposable;
}

/**
 * Wrapper type for a given object as a {@link PoolNode} for lifecycle management
 *
 * @template {object} Type The type of object being wrapped for an object pool */
export type Pooled<Type extends object> = Type & PoolNode<Type>;
