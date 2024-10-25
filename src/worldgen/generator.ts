import { createNoise2D } from "simplex-noise";
import { TileType } from "./types";

const noiseA = createNoise2D();

export function getTileInfo(x: number, y: number): TileType {
    let tmp: number = noiseA(x/32, y/32);
    return tmp > 0.5 ? TileType.yellow : TileType.cyan;
}
