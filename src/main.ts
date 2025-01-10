import { getTileInfo } from "./worldgen/generator";
import { TileType } from "./worldgen/types";

const cv = document.getElementById("main_canvas") as HTMLCanvasElement;
let ctxn = cv.getContext("2d");
if (!ctxn) throw new Error("Failed to get canvas context");
const ctx = ctxn as CanvasRenderingContext2D;

const camera: { x: number; y: number } = { x: 0, y: 0 };
const TILESIZE = 32;

const keys = { up: false, down: false, left: false, right: false };

const players: {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    fc: string;
}[] = [
    { x: 0, y: 0, width: TILESIZE, height: TILESIZE, speed: 8, fc: "white" },
    { x: 100, y: 0, width: TILESIZE, height: TILESIZE, speed: 8, fc: "purple" },
];

function np() {
    currentPlayer = (currentPlayer + 1) % players.length;
}

let currentPlayer: number = 0;

document.addEventListener("keydown", (event) => {
    if (event.key == "w") keys.up = true;
    if (event.key == "s") keys.down = true;
    if (event.key == "a") keys.left = true;
    if (event.key == "d") keys.right = true;
    if (event.key == "g") np();
});

document.addEventListener("keyup", (event) => {
    if (event.key == "w") keys.up = false;
    if (event.key == "s") keys.down = false;
    if (event.key == "a") keys.left = false;
    if (event.key == "d") keys.right = false;
});

function updatePlayerPosition() {
    const player = players[currentPlayer];

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

    camera.x = player.x - cv.width / 2 + player.width / 2;
    camera.y = player.y - cv.height / 2 + player.height / 2;
}

function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

function renderLoop(_: number = 0) {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    updatePlayerPosition();

    const startTime = performance.now();

    const newx = Math.floor(camera.x / TILESIZE);
    const newy = Math.floor(camera.y / TILESIZE);

    for (let y = -1; y * TILESIZE < cv.height + TILESIZE; y++) {
        let x = -1;
        while (x * TILESIZE < cv.width + TILESIZE) {
            const tile = getTileInfo(newx + x, newy + y);
            let length = 1;

            while (
                x + length < cv.width / TILESIZE + 1 &&
                getTileInfo(newx + x + length, newy + y) == tile
            )
                length++;

            ctx.fillStyle = getTileColor(tile);
            ctx.fillRect(
                Math.floor(x * TILESIZE - mod(camera.x, TILESIZE)),
                Math.floor(y * TILESIZE - mod(camera.y, TILESIZE)),
                TILESIZE * length,
                TILESIZE,
            );

            x += length;
        }
    }

    players.forEach((p) => {
        ctx.fillStyle = p.fc;
        ctx.fillRect(p.x - camera.x, p.y - camera.y, p.width, p.height);
    });

    ctx.font = `${TILESIZE}px monospace`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
        `${Math.round(1000.0 / (performance.now() - startTime))} fps`,
        0,
        TILESIZE,
    );
    ctx.fillText(
        `${players[currentPlayer].x} ${players[currentPlayer].y}`,
        0,
        1 + 2 * TILESIZE,
    );

    requestAnimationFrame(renderLoop);
}

function getTileColor(tileType: TileType): string {
    switch (tileType) {
        case TileType.cyan:
            return "cyan";
        case TileType.key:
            return "black";
        case TileType.magenta:
            return "magenta";
        default:
            return "yellow";
    }
}

renderLoop();
