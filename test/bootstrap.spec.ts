// @vitest-environment happy-dom
import { bootstrap } from '#🪕/bootstrap';
import { lstat } from 'node:fs';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const mockRefreshRate = (refreshRate: number) => {
  let accumulated = 0;
  const value = 1000 / refreshRate;
  globalThis.requestAnimationFrame = (callback => {
    setTimeout(callback, 1, (accumulated += value));
  }) as typeof globalThis.requestAnimationFrame;
};

beforeAll(() => {
  Object.defineProperty(globalThis.HTMLImageElement.prototype, 'src', {
    set(this: HTMLImageElement, src: string) {
      lstat(src, err => {
        if (err) {
          this.dispatchEvent(new ErrorEvent('error', { error: err }));
        } else {
          this.dispatchEvent(new Event('load'));
        }
      });
    },
  });
});

describe('bootstrap (function)', () => {
  it('sets refresh rate reciprocal', async () => {
    mockRefreshRate(50);
    await bootstrap();
    expect(globalThis.refreshReciprocal).toEqual(1 / 50);
    mockRefreshRate(60);
    await bootstrap();
    expect(globalThis.refreshReciprocal).toEqual(1 / 60);
    mockRefreshRate(144);
    await bootstrap();
    expect(globalThis.refreshReciprocal).toEqual(1 / 144);
  });

  it('loads requested images as HTMLImageElements', async () => {
    const valid = await bootstrap({ assets: { images: ['./test/test.png'] } });
    expect(valid.images['./test/test.png']).toBeInstanceOf(HTMLImageElement);
    await expect(() => bootstrap({ assets: { images: ['./invalid.bmp'] } })).rejects.toMatchObject(
      new Error(`ENOENT: no such file or directory, lstat '${resolve(process.cwd(), 'invalid.bmp')}'`)
    );
  });
});
