import { TILE_COALESCENCE_POWER, TILE_SIZE } from "@/constsettings";
import { getNewCanvasContext } from "@/utils";
import { Biomes } from "@/worldgen/biomes";
import { TileTextureType } from "./types";

/**
 * stores textures for all the types of the tiles
 */
const tileTextures: Map<string, TileTextureType> = new Map();
Object.keys(Biomes).forEach((key) => {
    const ctx = getNewCanvasContext(TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = Biomes[key as keyof typeof Biomes].col;
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    const gen: TileTextureType = [ctx];
    for (let i = 1; i <= TILE_COALESCENCE_POWER; i++) {
        const tmp = getNewCanvasContext(TILE_SIZE * (1 << i), TILE_SIZE);
        tmp.drawImage(gen[i - 1].canvas, 0, 0)
        tmp.drawImage(gen[i - 1].canvas, TILE_SIZE * (1 << (i - 1)), 0)
        gen.push(tmp);
    }
    tileTextures.set(key, gen);
})

export { tileTextures };
