import { player, players, updatePlayerPosition } from "./players";
import { mod } from "./utils";
import { getTileInfo } from "./worldgen/generator";
import { TileType } from "./worldgen/types";

const cv = document.getElementById("main_canvas") as HTMLCanvasElement;
let ctxn = cv.getContext("2d");
if (!ctxn) throw new Error("Failed to get canvas context");
const ctx = ctxn as CanvasRenderingContext2D;

const camera: { x: number; y: number } = { x: 0, y: 0 };
const TILESIZE = 32;

function renderLoop(_: number = 0) {
    const startTime = performance.now();

    cv.width = window.innerWidth;
    cv.height = window.innerHeight;

    updatePlayerPosition(player)
    camera.x = (player.x * TILESIZE) + (player.width * TILESIZE - cv.width)*0.5;
    camera.y = (player.y * TILESIZE) + (player.height * TILESIZE - cv.height)*0.5;

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

            ctx.fillStyle = TileType[tile];
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
        ctx.fillRect(p.x*TILESIZE - camera.x, p.y*TILESIZE - camera.y, p.width*TILESIZE, p.height*TILESIZE);
    });

    // debug overlay
    ctx.font = `${TILESIZE}px monospace`;
    let tmp: number = (performance.now() - startTime);
    ctx.fillStyle = tmp > 4 ? "red" : tmp > 2 ? "orange" : "green";
    ctx.fillText(`${Math.round(tmp)} ms`, 0, TILESIZE);
    ctx.fillStyle = "black";
    ctx.fillText(`${player.x} ${player.y}`, 0, 1 + 2 * TILESIZE);

    requestAnimationFrame(renderLoop);
}

renderLoop();
