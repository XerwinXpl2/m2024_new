import { createNoise2D } from "simplex-noise";
import { TileType } from "./types";
import { WrapDebugTime } from "@/utils";

const noiseA = createNoise2D();

export const getTileInfo = WrapDebugTime("getTileInfo", (x: number, y: number): TileType => {
    x = Math.floor(x);
    y = Math.floor(y);
    let tmp: number = noiseA(x / 32, y / 32);
    return tmp < 0.5 ? TileType.yellow : TileType.cyan;
});