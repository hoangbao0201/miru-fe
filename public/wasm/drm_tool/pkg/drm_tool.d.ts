/* tslint:disable */
/* eslint-disable */
export function decrypt_data(drm_data_encrypt: string): string;
export function unscramble_image_from_drm(scrambled_data: Uint8Array, width: number, height: number, drm_data_encrypt: string): Uint8Array;
export function scramble_image_with_max_parts(scrambled_data: Uint8Array, width: number, height: number, max_parts: number): any;
export function encrypt_data(drm_data: string): string;
export class ImageData {
  free(): void;
  constructor(width: number, height: number, data: Uint8Array);
  readonly width: number;
  readonly height: number;
  readonly data: Uint8Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_imagedata_free: (a: number, b: number) => void;
  readonly imagedata_new: (a: number, b: number, c: number, d: number) => number;
  readonly imagedata_width: (a: number) => number;
  readonly imagedata_height: (a: number) => number;
  readonly imagedata_data: (a: number) => [number, number];
  readonly decrypt_data: (a: number, b: number) => [number, number, number, number];
  readonly unscramble_image_from_drm: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number, number];
  readonly scramble_image_with_max_parts: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly encrypt_data: (a: number, b: number) => [number, number, number, number];
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
