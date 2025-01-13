export enum TileType {
    cyan,
    magenta,
    yellow,
    key,
}

const tileTextures: OffscreenRenderingContext[] = [];
for (let tile in TileType) {
    const tileType = TileType[tile as keyof typeof TileType]; // ?
    const osc = new OffscreenCanvas(32, 32); // TODO: TILESIZE
    const ctx = osc.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    ctx.fillStyle = TileType[tileType];
    ctx.fillRect(0, 0, 32, 32);
    tileTextures[tileType] = ctx;
}

export { tileTextures };
