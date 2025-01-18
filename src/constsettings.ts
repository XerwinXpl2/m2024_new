/**
 * size of a single time, in pixels.
 */
export const TILE_SIZE: number = 32;

/**
 * 2 to this power is max width of coalesced tile, should be low if map has high entropy.
 */
export const TILE_COALESCENCE_POWER: number = 4;

/**
 * time in milliseconds between purges of map cache
 */
export const MAP_CACHE_PURGE_PERIOD: number = 2500;

/**
 * how many entries must map cache have to be purged
 */
export const MAP_CACHE_PURGE_THRESHOLD: number = 20000;

/**
 * if enabled, execution time of wrapped functions will be measured
 */
export const DEBUG_TIMER: boolean = false;

/**
 * time in milliseconds between debug timer summaries
 */
export const DEBUG_TIMER_PRINT_PERIOD: number = 5000;

/**
 * scale multiplier for map generator
 */
export const GLOBAL_MAP_SCALE_MULTIPLIER: number = 1/8;
