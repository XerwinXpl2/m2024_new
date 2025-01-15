import { TILESIZE, VERYIMPORTANTRENDEROPTSTEPS } from "./constsettings";
import { player, players, updatePlayerPosition } from "./players";
import { mod } from "./utils";
import { getTileInfo } from "./worldgen/generator";
import { tileTextures, TileType } from "./worldgen/types";

const cv = document.getElementById("main_canvas") as HTMLCanvasElement;
let ctxn = cv.getContext("2d", { alpha: false});
if (!ctxn) throw new Error("Failed to get canvas context");
const ctx = ctxn as CanvasRenderingContext2D;

const camera: { x: number; y: number } = { x: 0, y: 0 };
const dt = document.getElementById("debug_text") as HTMLElement;
dt.style.fontSize = `${TILESIZE}px`;

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
        let x = -1;
        while (x * TILESIZE < cv.width + TILESIZE) {
            const tile = getTileInfo(newx + x, newy + y);
            let length = 1;
            while (
                x + length < cv.width / TILESIZE + 1 &&
                getTileInfo(newx + x + length, newy + y) == tile
            ) length++;
            let g2 = 0;
            for (let n = VERYIMPORTANTRENDEROPTSTEPS; n >= 1; n /= 2) {
                while (length-g2 >= n) {
                    // as "l1" part is to make ts shut up
                    ctx.drawImage(tileTextures[tile][`l${n}` as "l1"].canvas, Math.floor((g2+x) * TILESIZE - mod(camera.x, TILESIZE)), Math.floor(y * TILESIZE - mod(camera.y, TILESIZE)));
                    g2 += n;
                };
            }
            x += length;
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
