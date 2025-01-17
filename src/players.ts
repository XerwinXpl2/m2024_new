import { GLOBALMAPSCALEMOD, TILESIZE } from "./constsettings";
import { getNewCanvasContext, WrapDebugTime } from "./utils";

// all numeric units in tiles
interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    tilesPerSecond: number;
    tx: OffscreenCanvasRenderingContext2D;
}

const players: Player[] = [
    { x: 0, y: 0, width: 1, height: 1, tilesPerSecond: GLOBALMAPSCALEMOD, fc: "white" },
    { x: 2, y: 0, width: 1, height: 1, tilesPerSecond: GLOBALMAPSCALEMOD, fc: "purple" },
].map((e) => {
    const tx = getNewCanvasContext(TILESIZE, TILESIZE);
    tx.fillStyle = e.fc;
    tx.fillRect(0, 0, TILESIZE, TILESIZE);
    return { ...e, tx };
});

let currentPlayerIndex = 0;
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