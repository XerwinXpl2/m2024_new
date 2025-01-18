import { GLOBAL_MAP_SCALE_MULTIPLIER, MAP_CACHE_PURGE_PERIOD, MAP_CACHE_PURGE_THRESHOLD } from "@/constsettings";
import { rmpnorm, WrapDebugTime } from "@/utils";
import { createNoise2D } from "simplex-noise";
import { Biomes, getBiome } from "./biomes";

const noiseMapHeight = createNoise2D();
const noiseMapHeight2 = createNoise2D();
const HEIGHT_MAP_SCALE = 512 * GLOBAL_MAP_SCALE_MULTIPLIER;
const noiseMapTemperature = createNoise2D();
const TEMPERATURE_MAP_SCALE = 1024 * GLOBAL_MAP_SCALE_MULTIPLIER;
const noiseMapHumidity = createNoise2D();
const HUMIDITY_MAP_SCALE = 512 * GLOBAL_MAP_SCALE_MULTIPLIER;

const msx = 1 + 0.75 * (Math.random() - 0.5);
const msy = 1 + 0.75 * (Math.random() - 0.5);

const cache: Map<string, keyof typeof Biomes> = new Map();
setInterval(WrapDebugTime("purgeBiomeCache", () => {
    const size = cache.size;
    if (size < MAP_CACHE_PURGE_THRESHOLD) return;
    console.info(`map cache cleanup, purging ${size} entires`);
    cache.clear();
}), MAP_CACHE_PURGE_PERIOD);

/**
 * calculates biome of a tile with given coordinates
 * @param x x coordinate, will be floored
 * @param y y coordinate, will be floored
 */
export const getTile = WrapDebugTime("getTile", (x: number, y: number): keyof typeof Biomes => {
    x = Math.floor(x);
    y = Math.floor(y);
    const key = `${x}+${y}`

    let tmp = cache.get(key)
    if (!tmp) {
        const temperature = noiseMapTemperature(x / TEMPERATURE_MAP_SCALE, y / TEMPERATURE_MAP_SCALE);
        const humidity = noiseMapHumidity(x / HUMIDITY_MAP_SCALE, y / HUMIDITY_MAP_SCALE);
        const height = rmpnorm(noiseMapHeight(x / HEIGHT_MAP_SCALE, y / HEIGHT_MAP_SCALE))
        const height2 = rmpnorm(noiseMapHeight2(x / HEIGHT_MAP_SCALE * 4, y / HEIGHT_MAP_SCALE * 4))
        const ISLANDSIZEINV = 1 / (2048 * GLOBAL_MAP_SCALE_MULTIPLIER);
        const cdist = 1 - Math.hypot(ISLANDSIZEINV * x * msx, ISLANDSIZEINV * y * msy);
        tmp = getBiome(temperature, humidity, cdist * Math.pow(0.2 * height2 + height, 0.3));
        cache.set(key, tmp);
    }
    return tmp;
});