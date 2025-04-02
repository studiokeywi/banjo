/**
 * Utilities to be run as part of a loading process, such as detecting the expected monitor refresh rate or loading audio/visual assets
 *
 * @module bootstrap
 * @author studioKeywi */

// TODO: maybe utilize this + load image -> create better output object
// const toDataUrl = async src => {
//   const data = await fetch(src);
//   const blob = await data.blob();
//   const url = URL.createObjectURL(blob);
//   return Object.assign(url, {
//     [Symbol.dispose]() {
//       URL.revokeObjectURL(url);
//     },
//   });
// };

/** TODO: JSDocs
 * @internal */
const bundleImageAssets = async <Images extends string>(assets: BootstrapConfig<Images>['assets']) => {
  let bundle = {} as Record<Images, HTMLImageElement>;
  if (assets?.images) {
    const entries = await loadImages(assets.images);
    bundle = Object.fromEntries(entries) as Record<Images, HTMLImageElement>;
  }
  return bundle;
};

/**
 * Utility function that estimates the user's monitor refresh rate via averaging `requestAnimationFrame` request and returns the reciprocal
 *
 * @returns {Promise<number>}
 * @internal */
const getRefreshRateReciprocal = (): Promise<number> => {
  // NOTE: this runs 50 iterations -- should we maybe do it for ~1s and then calculate it out instead?
  const { promise: refreshRate, resolve } = Promise.withResolvers<number>();
  let last = 0;
  let sum = 0;
  let count = 0;
  const callback = (delta: number) => {
    if (last) {
      sum += delta - last;
    }
    last = delta;
    if (count++ !== 50) {
      requestAnimationFrame(callback);
    } else {
      resolve(1 / Math.round(50000 / sum));
    }
  };
  requestAnimationFrame(callback);
  return refreshRate;
};

/**
 * Utility function that loads a given path as an `<img>` element
 *
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 * @internal */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  const { promise: image, resolve, reject } = Promise.withResolvers<HTMLImageElement>();
  const ele = document.createElement('img');
  ele.addEventListener('load', () => {
    resolve(ele);
  });
  ele.addEventListener('error', evt => {
    reject(evt.error);
  });
  ele.src = src;
  return image;
};

/**
 * Utility function that loads multiple images and returns an Object entry array
 *
 * @param {string[]} srcs
 * @returns {Promise<[string, HTMLImageElement][]>}
 * @internal */
const loadImages = (srcs: string[]): Promise<[string, HTMLImageElement][]> =>
  Promise.all(srcs.map(src => loadImage(src).then(image => [src, image] as [string, HTMLImageElement])));

/**
 * Bootstraps the page for engine construction
 *
 * @template {string} Images
 * @param {BootstrapConfig<Images>} [config]
 * @returns {Promise<{ images: Record<Images, HTMLImageElement>, refreshRate: number }>} */
export const bootstrap = async <Images extends string>({ assets = {} }: BootstrapConfig<Images> = {}): Promise<{
  images: Record<Images, HTMLImageElement>;
}> => {
  const [refreshReciprocal, images] = await Promise.all([getRefreshRateReciprocal(), bundleImageAssets(assets)]);
  globalThis.refreshReciprocal = refreshReciprocal;
  return { images };
};

/**
 * Configuration options that may be provided to the bootstrap function
 */
export interface BootstrapConfig<Images extends string> {
  /**
   * External assets to be loaded
   */
  assets?: {
    /**
     * Image assets to be loaded
     */
    images?: Images[];
  };
}

declare global {
  /** Estimation of `1 / monitorRefreshRate`  */
  var refreshReciprocal: number; // eslint-disable-line no-var
}
