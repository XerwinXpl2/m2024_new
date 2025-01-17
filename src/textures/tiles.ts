import { TileTextureType } from "./types";
import { TILESIZE, VERYIMPORTANTRENDEROPTSTEPS } from "@/constsettings";
import { getNewCanvasContext } from "@/utils";
import { Biomes } from "@/worldgen/biomes";

const tileTextures: Map<string, TileTextureType> = new Map();
Object.keys(Biomes).forEach((key) => {
    const ctx = getNewCanvasContext(TILESIZE, TILESIZE);

    ctx.fillStyle = Biomes[key as keyof typeof Biomes].col;
    ctx.fillRect(0, 0, TILESIZE, TILESIZE);
    const gen: TileTextureType = [ctx];
    for (let i = 1; i <= VERYIMPORTANTRENDEROPTSTEPS; i++) {
        const tmp = getNewCanvasContext(TILESIZE * (1 << i), TILESIZE);
        tmp.drawImage(gen[i - 1].canvas, 0, 0)
        tmp.drawImage(gen[i - 1].canvas, TILESIZE * (1 << (i - 1)), 0)
        gen.push(tmp);
    }
    tileTextures.set(key, gen);
})

export { tileTextures };