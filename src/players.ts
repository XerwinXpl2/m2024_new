import { TILE_SIZE } from "./constsettings";
import { getNewCanvasContext, WrapDebugTime } from "./utils";

interface Player {
    /**
     * player's position on the map, in tiles
     */
    x: number;

    /**
     * player's position on the map, in tiles
     */
    y: number;

    /**
     * player's width, in tiles
     */
    width: number;

    /**
     * player's height, in tiles
     */
    height: number;

    /**
     * player's speed in tiles per second
     */
    tilesPerSecond: number;

    /**
     * player's texture
     */
    tx: OffscreenCanvasRenderingContext2D;
}

const players: Player[] = [
    { x: 0, y: 0, width: 1, height: 1, tilesPerSecond: 32, fc: "white" },
    { x: 0, y: 1, width: 1, height: 1, tilesPerSecond: 32, fc: "purple" },
].map((e) => {
    const tx = getNewCanvasContext(TILE_SIZE, TILE_SIZE);
    tx.fillStyle = e.fc;
    tx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    return { ...e, tx };
});

let currentPlayerIndex = 0;

/**
 * will always refer to current player
 */
let player = players[0];

function np(): void {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    player = players[currentPlayerIndex];
}

const keys = { up: false, down: false, left: false, right: false };

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() == "w") keys.up = true;
    if (event.key.toLowerCase() == "s") keys.down = true;
    if (event.key.toLowerCase() == "a") keys.left = true;
    if (event.key.toLowerCase() == "d") keys.right = true;
    if (event.key.toLowerCase() == "g") np();
});

document.addEventListener("keyup", (event) => {
    if (event.key.toLowerCase() == "w") keys.up = false;
    if (event.key.toLowerCase() == "s") keys.down = false;
    if (event.key.toLowerCase() == "a") keys.left = false;
    if (event.key.toLowerCase() == "d") keys.right = false;
});

/**
 * updates position of given player
 * @param player player to be updated
 * @param deltaTime time since last update
 */
export const updatePlayerPosition = WrapDebugTime("updatePlayerPosition", (player: Player, deltaTime: number) => {
    let dx = 0;
    let dy = 0;

    if (keys.up) dy -= 1;
    if (keys.down) dy += 1;
    if (keys.left) dx -= 1;
    if (keys.right) dx += 1;

    if (dx != 0 && dy != 0) {
        const length = Math.hypot(dx, dy);
        dx /= length;
        dy /= length;
    }

    player.x += dx * player.tilesPerSecond * deltaTime;
    player.y += dy * player.tilesPerSecond * deltaTime;
})

export { currentPlayerIndex, player, players };
