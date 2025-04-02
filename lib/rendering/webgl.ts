/**
 * Utilities for working with `WebGL2RenderingContext`
 *
 * @module rendering/webgl
 * @author studioKeywi */

import type { GenericFunction } from '#🪕/types';

/**
 * TODO: JSDocs
 */
export const buildFragmentShader = (cfg: Omit<ShaderCfg, 'type'>) => buildShader({ ...cfg, type: WebGL2RenderingContext.FRAGMENT_SHADER });

/**
 * TODO: JSDocs
 */
export const buildShader = ({ errCallback = console.error, gl, source, type }: ShaderCfg): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Invalid shader construction');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) as GLboolean) return shader;
  const lastErr = gl.getShaderInfoLog(shader) ?? 'unknown';
  errCallback(`Error compiling shader: ${lastErr}`);
  gl.deleteShader(shader);
  return null;
};

/**
 * TODO: JSDocs
 */
export const buildVertexShader = (cfg: Omit<ShaderCfg, 'type'>) => buildShader({ ...cfg, type: WebGL2RenderingContext.VERTEX_SHADER });

/**
 * TODO: JSDocs
 */
export const buildWebGL2Program = ({ attributes, errCallback = console.error, gl, locations, shaders }: ProgramCfg): WebGLProgram | null => {
  const program = gl.createProgram();
  for (const shader of shaders) {
    gl.attachShader(program, shader);
  }
  if (attributes) {
    for (let idx = 0, attr = attributes[idx]; idx < attributes.length; attr = attributes[++idx]) {
      gl.bindAttribLocation(program, locations?.[idx] ?? idx, attr);
    }
  }
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS) as GLboolean) return program;
  const lastErr = gl.getProgramInfoLog(program) ?? 'unknown';
  errCallback(`Error linking program: ${lastErr}`);
  gl.deleteProgram(program);
  return null;
};

/**
 * TODO: JSDocs
 */
export const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement, multiplier: number = 1) => {
  const width = Math.floor(canvas.clientWidth * multiplier);
  const height = Math.floor(canvas.clientHeight * multiplier);
  if (canvas.width === width && canvas.height === height) return false;
  canvas.width = width;
  canvas.height = height;
  return true;
};

/**
 * TODO: JSDocs
 */
export interface ProgramCfg {
  attributes?: string[];
  errCallback?: ErrCallback;
  gl: WebGL2RenderingContext;
  locations?: number[];
  shaders: WebGLShader[];
}

/**
 * TODO: JSDocs
 */
export interface ShaderCfg {
  errCallback?: ErrCallback;
  gl: WebGL2RenderingContext;
  source: string;
  type: GLenum;
}

/**
 * TODO: JSDocs
 *
 * @internal */
export type ErrCallback = GenericFunction<void, [message: string]>;
