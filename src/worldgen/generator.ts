import { createNoise2D } from "simplex-noise";
import { WrapDebugTime } from "@/utils";
import { Biomes, getBiome } from "./biomes";
import { GLOBALMAPSCALEMOD, MAPCACHEPURGETIME, MAPCACHEPURGETRESHOLD } from "@/constsettings";

const noiseMapWaters = createNoise2D();
const WATERS_MAP_SCALE = 512 * GLOBALMAPSCALEMOD;
const noiseMapTemperature = createNoise2D();
const TEMPERATURE_MAP_SCALE = 512 * GLOBALMAPSCALEMOD;
const noiseMapHumidity = createNoise2D();
const HUMIDITY_MAP_SCALE = 32 * GLOBALMAPSCALEMOD;
const noiseMapFertility = createNoise2D();
const FERTILITY_MAP_SCALE = 16 * GLOBALMAPSCALEMOD;
// no light levels since the world is flat. perhaps wind but it is caused by terrain height which is not a thing yet

const cache: Map<string, keyof typeof Biomes> = new Map();
setInterval(WrapDebugTime("purgeBiomeCache", () => {
    const size = cache.size;
    if (size < MAPCACHEPURGETRESHOLD) return;
    console.info(`map cache cleanup, purging ${size} entires`);
    cache.clear();
}), MAPCACHEPURGETIME);

export const getTile = WrapDebugTime("getTile", (x: number, y: number): keyof typeof Biomes => {
    x = Math.floor(x);
    y = Math.floor(y);
    const key = `${x}+${y}`

    let tmp = cache.get(key)
    if (!tmp) {
        let temperature = noiseMapTemperature(x / TEMPERATURE_MAP_SCALE, y / TEMPERATURE_MAP_SCALE);
        let humidity = noiseMapHumidity(x / HUMIDITY_MAP_SCALE, y / HUMIDITY_MAP_SCALE);
        let fertility = noiseMapFertility(x / FERTILITY_MAP_SCALE, y / FERTILITY_MAP_SCALE);
        let waters = 1-Math.pow(1-noiseMapWaters(x / WATERS_MAP_SCALE, y / WATERS_MAP_SCALE), 1.6);
        tmp = getBiome(temperature, humidity, fertility, waters);
        cache.set(key, tmp);
    }
    return tmp;
});