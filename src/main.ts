import { player, players, updatePlayerPosition } from "./players";
import { mod } from "./utils";
import { getTileInfo } from "./worldgen/generator";
import { tileTextures, TileType } from "./worldgen/types";

const cv = document.getElementById("main_canvas") as HTMLCanvasElement;
let ctxn = cv.getContext("2d", { alpha: false});
if (!ctxn) throw new Error("Failed to get canvas context");
const ctx = ctxn as CanvasRenderingContext2D;

const camera: { x: number; y: number } = { x: 0, y: 0 };
const TILESIZE = 32;
const dt = document.getElementById("debug_text") as HTMLElement;
dt.style.fontSize = `${TILESIZE}px`;

let t0 = 0;
function renderLoop(_: number = 0) {
    const startTime = performance.now();

    cv.width = window.innerWidth;
    cv.height = window.innerHeight;

    updatePlayerPosition(player)
    camera.x = (player.x * TILESIZE) + (player.width * TILESIZE - cv.width)*0.5;
    camera.y = (player.y * TILESIZE) + (player.height * TILESIZE - cv.height)*0.5;

    const newx = Math.floor(camera.x / TILESIZE);
    const newy = Math.floor(camera.y / TILESIZE);

    // TODO: OPTIMIZE MORE
    for (let y = -1; y * TILESIZE < cv.height + TILESIZE; y++) {
        for (let x = -1; x * TILESIZE < cv.width + TILESIZE; x++) {
            const tile = getTileInfo(newx + x, newy + y);
            ctx.drawImage(tileTextures[tile].canvas, Math.floor(x * TILESIZE - mod(camera.x, TILESIZE)), Math.floor(y * TILESIZE - mod(camera.y, TILESIZE)));
        }
    }

    players.forEach((p) => {
        ctx.drawImage(p.tx.canvas, p.x*TILESIZE - camera.x, p.y*TILESIZE - camera.y)
    });

    let tmp: number = (performance.now() - startTime);
    dt.innerHTML = `
        <p style="margin: 0; color: ${tmp > 4 ? "red" : tmp > 2 ? "orange" : "green"};">${Math.round(tmp)} ms</p>
        <p style="margin: 0;">${player.x} ${player.y}</p>`;

    requestAnimationFrame(renderLoop);
}

renderLoop();
