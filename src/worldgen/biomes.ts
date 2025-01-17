import { WrapDebugTime } from "@/utils";

type BiomeData = { col: string, t: number, h: number, f: number, w: number }
// TODO: should be like `Record<string, BiomeData>` however that breaks `keyof typeof biome`
// low w means things needs to be far away from the water to generate
export const Biomes = {
    desert: { col: "khaki", t: 0.95, h: -0.9, f: -0.95, w: -1.0 },
    waters: { col: "teal", t: 0.3, h: 1.0, f: -0.3, w: 0.8 },
    plains: { col: "yellowgreen", t: 0.3, h: 0.4, f: -0.2, w: -0.6 },
    forest: { col: "forestgreen", t: 0.5, h: 0.5, f: 0.6, w: -0.8 },
    jungle: { col: "darkolivegreen", t: 0.6, h: 1.0, f: 1.0, w: -1.0 },
} as const;

export const getBiome = WrapDebugTime("getBiome", (t: number, h: number, f: number, w: number): keyof typeof Biomes => {
    let bd: number = Number.MAX_VALUE;
    let bb: keyof typeof Biomes = "desert"; // just to have clean type, it will be replaced with first tested biome anyway as long as values are in bounds
    Object.keys(Biomes).forEach(k => {
        const tmp = Biomes[k as keyof typeof Biomes];
        // TODO: this is kinda stupid, water and humidity should be correlated, only low humidity area with water i can imagine are deserts near cold ocean currents, but then still there is correlation, just with temperature.
        const dist = Math.sqrt((tmp.f-f)*(tmp.f-f) + (tmp.h-h)*(tmp.h-h) + (tmp.t-t)*(tmp.t-t) + (tmp.w-w)*(tmp.w-w));
        if (dist > bd) return;
        bd = dist;
        bb = k as keyof typeof Biomes;
    });
    return bb;
});