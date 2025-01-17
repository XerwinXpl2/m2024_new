import { TILESIZE, VERYIMPORTANTRENDEROPTSTEPS } from "src/constsettings";
import { TileTextureType } from "src/textures/types";
import { getNewCanvasContext } from "src/utils";

export enum TileType {
    cyan,
    magenta,
    yellow,
    key,
}

const tileTextures: TileTextureType[] = [];
for (let tile in TileType) {
    const tileType = TileType[tile as keyof typeof TileType]; // ?
    const ctx = getNewCanvasContext(TILESIZE, TILESIZE);

    ctx.fillStyle = TileType[tileType];
    ctx.fillRect(0, 0, TILESIZE, TILESIZE);
    tileTextures[tileType] = [ctx];
    for (let i = 1; i <= VERYIMPORTANTRENDEROPTSTEPS; i++) {
        const tmp = getNewCanvasContext(TILESIZE*(1 << i), TILESIZE);
        tmp.drawImage(tileTextures[tileType][i - 1].canvas, 0, 0)
        tmp.drawImage(tileTextures[tileType][i - 1].canvas, TILESIZE*(1 << (i-1)), 0)
        tileTextures[tileType].push(tmp);
    }
}

export { tileTextures };
