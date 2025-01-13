// all numeric units in tiles
interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    tx: OffscreenCanvasRenderingContext2D;
}

const players: Player[] = [
    { x: 0, y: 0, width: 1, height: 1, speed: 0.25, fc: "white" },
    { x: 2, y: 0, width: 1, height: 1, speed: 0.25, fc: "purple" },
].map((e) => {
    const osc = new OffscreenCanvas(32, 32); // TODO: TILESIZE
    const ctx = osc.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Failed to get canvas context");
    ctx.fillStyle = e.fc;
    ctx.fillRect(0, 0, 32, 32);

    return { ...e, tx: ctx };
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

function updatePlayerPosition(player: Player) {
    let dx = 0;
    let dy = 0;

    if (keys.up) dy -= 1;
    if (keys.down) dy += 1;
    if (keys.left) dx -= 1;
    if (keys.right) dx += 1;

    if (dx != 0 && dy != 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;
    }

    player.x += dx * player.speed;
    player.y += dy * player.speed;
}

export { player, players, currentPlayerIndex, updatePlayerPosition };
