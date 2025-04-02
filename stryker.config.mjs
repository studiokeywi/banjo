/** @import {PartialStrykerOptions} from '@stryker-mutator/api/core'; */
import ignorePatterns from './.excludes.js';

/** @type {PartialStrykerOptions} */
const config = {
  clearTextReporter: { allowEmojis: true, reportTests: true },
  coverageAnalysis: 'perTest',
  htmlReporter: { fileName: './reports/mutation/index.html' },
  ignorePatterns,
  ignoreStatic: false,
  // TODO: update when available
  // packageManager: 'bun',
  packageManager: 'npm',
  // NOTE: debugging in console
  // reporters: ['clear-text', 'progress', 'html'],
  // NOTE: general reporting
  reporters: ['html', 'progress'],
  // TODO: update when available
  // testRunner: 'bun',
  testRunner: 'vitest',
  thresholds: { break: 90, high: 95, low: 93 },
  vitest: { configFile: './vitest.stryker.config.ts' },
};

export default config;
