/**
 * A generator-wrapped view into an array that allows jumping and infinite stepping through its contents, as well as basic array-like functions such as insertion, removal, and viewing at an index
 *
 * @module ringArray
 * @author studioKeywi */

/**
 * A ring generator is an infinitely-steppable view into an array.
 *
 * @template Type
 * @param {Type[]} source
 * @yields {{ data?: Type; idx: number }}
 * @returns {Ring<Type>}
 * @internal */
const ringGenerator = function* ringGenerator<Type>(source: Type[]): Ring<Type> {
  let idx: number | undefined;
  // Stryker disable next-line BlockStatement: If mutant `{}` happened, it would infinite loop
  while (true as boolean) {
    // NOTE: `yield` syntax is a hybrid "in/out" when using `.next()`. The value passed into `.next` is used as `nextIdx`
    const nextIdx = yield typeof idx === 'undefined' ? { idx: 0 } : { data: source[idx], idx };
    idx ??= -1;
    const { length } = source;
    idx = (nextIdx ?? idx + 1) + length;
    idx %= length;
    /* v8 ignore next --- Disabling coverage due to the fake return only existing for TypeScript, because it is never able to be reached */
  }
  // Stryker disable next-line ConditionalExpression, EqualityOperator, LogicalOperator: Disabling various mutations due to the fake return only existing for TypeScript, because it is never able to be reached
  /* v8 ignore next --- Disabling coverage due to the fake return only existing for TypeScript, because it is never able to be reached */
  return undefined as never;
  /* v8 ignore next --- Disabling coverage due to the fake return only existing for TypeScript, because it is never able to be reached */
};

/**
 * Creates a new {@link RingArray} from a given array
 *
 * @template Type
 * @param {Type[] | readonly Type[]} source
 * @returns {RingArray<Type>} */
export const createRing = <Type>(source: Type[] | readonly Type[]): RingArray<Type> => {
  // NOTE: de-reference input via shallow copy
  /** Shallow de-reference of original source array */
  const truth = source.slice();
  /** Infinitely steppable view into the truth array */
  const ring = ringGenerator(truth);
  // NOTE: prime the ring -- the first call to `.next` cannot utilize any passed arguments, and we need the internal index to be set as 0 on the following call
  /** Value of the index internally tracked in the ring generator */
  let { idx } = ring.next().value;

  return {
    get contents() {
      return truth.slice();
    },
    get index() {
      return idx;
    },
    add(...values) {
      truth.push(...values);
      return this;
    },
    insert(value, index) {
      if (index < 0 || index >= truth.length) {
        throw new Error('Invalid index provided');
      }
      if (idx >= index) {
        this.jump(idx + 1);
      }
      truth.splice(index, 0, value);
      return this;
    },
    get(index) {
      const { value } = ring.next(index);
      ({ idx } = value);
      return value.data;
    },
    jump(index) {
      ring.next(index - 1);
      idx = index;
      return this;
    },
    next() {
      const { value } = ring.next();
      ({ idx } = value);
      return value.data;
    },
    remove(data) {
      try {
        return this.removeAt(truth.indexOf(data));
      } catch (err) {
        throw new Error('Invalid value provided', { cause: err });
      }
    },
    removeAt(index) {
      if (index < 0 || (index > 0 && index >= truth.length)) {
        throw new Error('Invalid index provided');
      }
      if (idx > 0 && idx >= index) {
        this.jump(idx - 1);
      }
      truth.splice(index, 1);
      return this;
    },
  };
};

/**
 * Specific shape of the {@link Generator} used internally by a {@link RingArray}
 *
 * @internal */
type Ring<Type> = Generator<{ data?: Type; idx: number }, never, number | undefined>;

/**
 * Wrapper of the base `array` type in JavaScript to provide cyclic-based interactions
 *
 * @template Type */
export interface RingArray<Type> {
  /**
   * Read-only view of the current contents held in the array. This is a shallow-dereference through spread syntax, so any objects contained in the array are still mutable
   */
  get contents(): Type[];

  /**
   * Index of the most recently returned value from the ring
   */
  get index(): number;

  /**
   * Adds a new value into the RingArray. This is similar to `someArray.push(...values)`, but returns the RingArray for chaining.
   *
   * @param {Type[]} values The new values to append
   * @returns {this} The RingArray for chaining */
  add(...values: Type[]): this;

  /**
   * Inserts a new value into the RingArray at a specified location. This is similar to `someArray.splice(idx, 0, value)`, but returns the RingArray for chaining.
   *
   * @param {Type} value The new value to insert
   * @param {number} idx The position in which to insert the new value
   * @returns {this} The RingArray for chaining */
  insert(value: Type, idx: number): this;

  /**
   * Gets the entry of the source array at the given index. Like a direct index access (eg `someArray[someIndex]`), will return undefined if the index is out of range.
   *
   * @param {number} index Location in the array to return
   * @returns {Type | undefined} An entry from the source array (if the index was in range), otherwise undefined */
  get(index: number): Type | undefined;

  /**
   * Jumps the internal location of the RingArray to a new location and returns the RingArray for chaining.
   *
   * @param {number} index Location in the array to use next
   * @returns {this} The RingArray for chaining */
  jump(index: number): this;

  /**
   * Gets the next entry of the source array, based on previous steps through the source. Initially this returns the first value (as if `someArray[0]`) and continues
   * until reaching the equivalent of `someArray[someArray.length - 1]`. At that point, the internal location wraps back to the start of the array.
   *
   * @returns {Type | undefined} The next entry from the source array */
  next(): Type | undefined;

  /**
   * Removes the specified value from the RingArray. This is similar to `someArray.splice(someArray.indexOf(value), 1)`, but returns the RingArray for chaining.
   *
   * @param {Type} value The value to remove
   * @returns {this} The RingArray for chaining */
  remove(value: Type): this;

  /**
   * Removes the specified value from the RingArray. This is similar to `someArray.splice(idx, 1)`, but returns the RingArray for chaining.
   *
   * @param {number} idx Location in the array to remove
   * @returns {this} The RingArray for chaining */
  removeAt(idx: number): this;
}
