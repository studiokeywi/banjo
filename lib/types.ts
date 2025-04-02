/**
 * General utility types for internal and external use
 *
 * @module types
 * @author studioKeywi */

// TODO: finish JSDocs
/**
 * Utility type for an async no-param no-return function
 */
export type ANoOp = () => Promise<void>;

/**
 * Utility type for a function that returns a boolean
 */
export type CheckFunction = GenericFunction<boolean>;

/**
 * Utility type that represents intersection types as singular shapes in type hints/IntelliSense/etc
 */
export type Expand<Src> = { [Key in keyof Src]: Src[Key] } & NonNullable<unknown>;

/**
 * Utility type for any function with configurable return value and params
 */
export type GenericFunction<Returns = void, Input extends unknown[] = never[]> = (...args: Input) => Returns;

/**
 * Utility type for any async function (one that returns a Promise) with configurable return value and params
 */
export type GenericAsyncFunction<Returns = void, Input extends unknown[] = never[]> = (...args: Input) => Promise<Returns>;

/**
 * Utility type for a no-param no-return function
 */
export type NoOp = () => void;

/**
 * Utility type for removing index signature types from an object
 */
export type RemoveIndexSignature<Src, Type> = { [Key in keyof Src as [Type] extends [Key] ? never : Key]: [Type] extends [Key] ? never : Src[Key] };

/**
 * Utility type for any function
 */
export type RunFunction = GenericFunction | GenericAsyncFunction;
