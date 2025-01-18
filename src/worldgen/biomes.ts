import { rmpb, rmpnorm, WrapDebugTime } from "@/utils";

export const NaturalBiomes = {
    void: { col: "magenta" },
    ocean: { col: "teal" },
}

// deserts are lower because idk i assume since it's a lot of sand it wouldn't form a mountain on a small island
// TODO: biome rarity somehow
export const GeneratorBiomes = {
    desert: { col: "khaki", t: 0.95, h: -1, h2: 0.4},
    plains: { col: "yellowgreen", t: 0.2, h: 0.4, h2: 0.5},
    forest: { col: "forestgreen", t: 0.2, h: 0.5, h2: 0.4 },
    jungle: { col: "darkolivegreen", t: 0.4, h: 0.9, h2: 0.5},
} as const;

export const Biomes = { ...GeneratorBiomes, ...NaturalBiomes } as const;

const FLL = 0.4;
export const getBiome = WrapDebugTime("getBiome", (temperature: number, humidity: number, height: number): keyof typeof Biomes => {
    if (height < FLL) return "ocean"; // height is now FLL to 1
    height = (height-FLL)/(1-FLL); // remap it to 0 to 1 again
    humidity = rmpb(rmpnorm(humidity)*0.75 + 0.25*(1-height));
    let bd: number = Number.MAX_VALUE;
    let bb = "void" as keyof typeof Biomes;
    Object.keys(GeneratorBiomes).forEach(k => {
        const tmp = GeneratorBiomes[k as keyof typeof GeneratorBiomes];
        const dist = Math.hypot(tmp.h-humidity, tmp.t-temperature, tmp.h2-height);
        if (dist > bd) return;
        bd = dist;
        bb = k as keyof typeof Biomes;
    });
    return bb;
});