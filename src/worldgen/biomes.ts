import { WrapDebugTime } from "@/utils";
import { tilesBase64 } from "@/generated/tiles";

/**
 * biomes that are special to generator
 */
export const NaturalBiomes = {
    void: { col: "magenta", tx: { base: "" } },
    ocean: { col: "turquoise", tx: { base: tilesBase64["water_sea"] } },
    deepocean: { col: "teal", tx: { base: tilesBase64["water_ocean"] } },
} as const;

// TODO: biome rarity somehow
/**
 * biomes selected by generator
 */
export const GeneratorBiomes = {
    desert: { col: "khaki", tx: { base: tilesBase64["sand"] }, t: 0.95, h: -1, h2: 0.4 },
    plains: { col: "yellowgreen", tx: { base: tilesBase64["grass_plains_0"] }, t: 0.2, h: 0.4, h2: 0.5 },
    forest: { col: "forestgreen", tx: { base: tilesBase64["grass_forest_0"] }, t: 0.2, h: 0.5, h2: 0.4 },
    jungle: { col: "darkolivegreen", tx: { base: tilesBase64["grass_jungle_0"] }, t: 0.4, h: 0.9, h2: 0.5 },
} as const;

/**
 * all the biomes
 */
export const Biomes = { ...GeneratorBiomes, ...NaturalBiomes } as const;

const FLL = 0.4; // level of first land
const DOL = 0.2; // deep ocean level
/**
 * returns biome based on given variables
 * @param temperature -1 (cold) to 1 (hot)
 * @param humidity -1 (dry/arid) to 1 (humid)
 * @param height 0 to 1
 */
export const getBiome = WrapDebugTime("getBiome", (temperature: number, humidity: number, height: number): keyof typeof Biomes => {
    if (height < FLL) return height < DOL ? "deepocean" : "ocean"; // height is now FLL to 1
    height = (height - FLL) / (1 - FLL); // remap it to 0 to 1 again
    humidity = 0.25 + 0.75 * humidity - 0.5 * height; // 75% humidity 25% height (i think?) so there is mode humidity near water
    let bd: number = Number.MAX_VALUE;
    let bb = "void" as keyof typeof Biomes;
    Object.keys(GeneratorBiomes).forEach(k => {
        const tmp = GeneratorBiomes[k as keyof typeof GeneratorBiomes];
        const dist = Math.hypot(tmp.h - humidity, tmp.t - temperature, tmp.h2 - height);
        if (dist > bd) return;
        bd = dist;
        bb = k as keyof typeof Biomes;
    });
    return bb;
});