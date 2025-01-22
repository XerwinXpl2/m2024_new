import { TILE_COALESCENCE_POWER, TILE_SIZE } from "@/constsettings";
import { getNewCanvasContext } from "@/utils";
import { Biomes } from "@/worldgen/biomes";
import { TileTextureType } from "./types";

/**
 * stores textures for all the types of the tiles
 */
export const tileTextures: Map<string, TileTextureType> = new Map();
export async function loadTextures() {
    const texturePromises = Object.keys(Biomes).map((key) => {
        return new Promise<void>((resolve) => {
            const ctx = getNewCanvasContext(TILE_SIZE, TILE_SIZE);

            const image = new Image();
            image.src =
                "data:image/webp;base64," +
                Biomes[key as keyof typeof Biomes].tx.base;

            image.onload = () => {
                ctx.drawImage(image, 0, 0);

                const gen: TileTextureType = [ctx];
                for (let i = 1; i <= TILE_COALESCENCE_POWER; i++) {
                    const tmp = getNewCanvasContext(
                        TILE_SIZE * (1 << i),
                        TILE_SIZE,
                    );
                    tmp.drawImage(gen[i - 1].canvas, 0, 0);
                    tmp.drawImage(
                        gen[i - 1].canvas,
                        TILE_SIZE * (1 << (i - 1)),
                        0,
                    );
                    gen.push(tmp);
                }

                tileTextures.set(key, gen);
                resolve();
            };
            image.onerror = () => {
                console.error(`failed to load texture for ${key}`);
                const gen: TileTextureType = [ctx];
                for (let i = 1; i <= TILE_COALESCENCE_POWER; i++) {
                    const tmp = getNewCanvasContext(
                        TILE_SIZE * (1 << i),
                        TILE_SIZE,
                    );
                    tmp.drawImage(gen[i - 1].canvas, 0, 0);
                    tmp.drawImage(
                        gen[i - 1].canvas,
                        TILE_SIZE * (1 << (i - 1)),
                        0,
                    );
                    gen.push(tmp);
                }

                tileTextures.set(key, gen);
                resolve();
            };
        });
    });
    await Promise.all(texturePromises);
}
