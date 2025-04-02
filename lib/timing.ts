/**
 * Utilities for viewing performance timeline entries during selected time periods
 *
 * @module timing
 * @author studioKeywi */

import type { Chrono } from '#🪕/chrono';
import { seconds } from '#🪕/chrono';

/**
 * Gets the number of performance timeline marks matching a given name within the past number of milliseconds provided
 *
 * @param {Chrono} period
 * @param {string} label
 * @param {number} [threshold = 300] Default `300`
 * @returns {number} */
export const withinLastPeriod = (period: Chrono, label: string, threshold: number = 300): number => {
  const start = Math.max(performance.now() - period.milliseconds, 0);

  return performance
    .getEntriesByName(label, 'mark')
    .slice(-threshold)
    .filter(({ startTime }) => Math.sign(startTime - start) === 1).length;
};

/**
 * Helper for {@link withinLastPeriod} to check performance timeline marks within the last second
 *
 * @param {string} label
 * @param {number} [threshold = 300] Default `300`
 * @returns {number} */
export const withinLastSecond = (label: string, threshold: number = 300): number => withinLastPeriod(seconds(1), label, threshold);
