import { TILESIZE, VERYIMPORTANTRENDEROPTSTEPS } from "src/constsettings";
import { TileTextureType } from "src/textures/types";
import { getNewCanvasContext } from "src/utils";

export enum TileType {
    cyan,
    magenta,
    yellow,
    key,
}

// typescript has actually been so stupid here, sorry
const tileTextures: TileTextureType[] = [];
for (let tile in TileType) {
    const tileType = TileType[tile as keyof typeof TileType]; // ?
    const ctx = getNewCanvasContext(TILESIZE, TILESIZE);

    ctx.fillStyle = TileType[tileType];
    ctx.fillRect(0, 0, TILESIZE, TILESIZE);
    tileTextures[tileType] = {} as TileTextureType;
    tileTextures[tileType]["l1"] = ctx;
    for (let i = 2; i <= VERYIMPORTANTRENDEROPTSTEPS; i *= 2) {
        const tmp = getNewCanvasContext(TILESIZE*i, TILESIZE);
        const ind = `l${i/2}` as "l1";
        tmp.drawImage(tileTextures[tileType][ind].canvas, 0, 0)
        tmp.drawImage(tileTextures[tileType][ind].canvas, TILESIZE*(i/2), 0)
        tileTextures[tileType][`l${i}` as "l1"] = tmp; // won't ever be l1
    }
}

export { tileTextures };
