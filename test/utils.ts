import type { Chrono } from '../lib/chrono.js';

export const delay = (delay: Chrono) => {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(resolve, +delay.milliseconds);
  return promise;
};
