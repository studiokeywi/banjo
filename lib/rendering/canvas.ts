/**
 * Utilities for working with `<canvas>`, `OffscreenCanvas`, and web workers
 *
 * @module rendering/canvas
 * @author studioKeywi */

/**
 * TODO: JSDocs
 *
 * @param {{ canvas?: HTMLCanvasElement; data?: unknown; url: URL; }} param0
 * @returns {{ canvas: HTMLCanvasElement; layer: Worker; }} */
export const buildOffscreenLayer = ({
  canvas = document.createElement('canvas'),
  data = {},
  url,
}: {
  canvas?: HTMLCanvasElement;
  data?: unknown;
  url: URL;
}): { canvas: HTMLCanvasElement; layer: Worker } => {
  const layer = new Worker(url);
  const offscreen = canvas.transferControlToOffscreen();
  layer.postMessage({ canvas: offscreen, ...(typeof data === 'object' ? data : { data }) }, [offscreen]);
  return { canvas, layer };
};
