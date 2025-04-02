/**
 * Functions to convert numeric values, such as circular conversions or value clamping
 *
 * @module math/conversions
 * @author studioKeywi */

import { toDeg, toRad } from '#🪕/math/constants';

/**
 * Provides a value that is within an inclusive range
 *
 * @param {number} value Value to clamp
 * @param {number} [min = 0] Minimum of the range (default `0`)
 * @param {number} [max = 1] Maximum of the range (default `1`)
 * @returns {number} The clamped value */
export const clamp = (value: number, min: number = 0, max: number = 1): number => (value < min ? min : value > max ? max : value);

/**
 * Convert a measurement in degrees into radians
 *
 * @param {number} deg Measure in degrees
 * @returns {number} Measure in radians */
export const degToRad = (deg: number): number => deg * toRad;

/**
 * Convert a measurement in radians into degrees
 *
 * @param {number} rad Measure in radians
 * @returns {number} Measure in degrees */
export const radToDeg = (rad: number): number => rad * toDeg;
