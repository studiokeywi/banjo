import { defineConfig } from 'vitest/config';
import exclude from './.excludes.js';

const config = defineConfig({
  test: {
    coverage: {
      exclude,
      include: ['lib'],
      reporter: ['html', 'text'],
      reportsDirectory: 'reports/coverage',
      thresholds: { branches: 95, functions: 95, lines: 95, statements: 95 },
    },
    dir: 'test',
    reporters: ['default', ['html', { outputFile: 'reports/unit/index.html' }]],
    watch: false,
  },
});

export default config;
