import { createNoise2D } from "simplex-noise";
import { rmpnorm, WrapDebugTime } from "@/utils";
import { Biomes, getBiome } from "./biomes";
import { GLOBALMAPSCALEMOD, MAPCACHEPURGETIME, MAPCACHEPURGETRESHOLD } from "@/constsettings";

const noiseMapHeight = createNoise2D();
const noiseMapHeight2 = createNoise2D();
const HEIGHT_MAP_SCALE = 512 * GLOBALMAPSCALEMOD;
const noiseMapTemperature = createNoise2D();
const TEMPERATURE_MAP_SCALE = 1024 * GLOBALMAPSCALEMOD;
const noiseMapHumidity = createNoise2D();
const HUMIDITY_MAP_SCALE = 512 * GLOBALMAPSCALEMOD;

const msx = 1 + 0.75 * (Math.random() - 0.5);
const msy = 1 + 0.75 * (Math.random() - 0.5);

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
        const temperature = noiseMapTemperature(x / TEMPERATURE_MAP_SCALE, y / TEMPERATURE_MAP_SCALE);
        const humidity = noiseMapHumidity(x / HUMIDITY_MAP_SCALE, y / HUMIDITY_MAP_SCALE);
        const height = rmpnorm(noiseMapHeight(x / HEIGHT_MAP_SCALE, y / HEIGHT_MAP_SCALE))
        const height2 = rmpnorm(noiseMapHeight2(x / HEIGHT_MAP_SCALE * 4, y / HEIGHT_MAP_SCALE * 4))
        const ISLANDSIZEINV = 1 / (2048 * GLOBALMAPSCALEMOD);
        const cdist = 1 - Math.hypot(ISLANDSIZEINV * x * msx, ISLANDSIZEINV * y * msy);
        tmp = getBiome(temperature, humidity, cdist * Math.pow(0.2 * height2 + height, 0.3));
        // tmp = getBiome(temperature, humidity, fertility, height);
        cache.set(key, tmp);
    }
    return tmp;
});