import { DEBUTIMES, TILESIZE, VERYIMPORTANTRENDEROPTSTEPS } from "./constsettings";
import { player, players, updatePlayerPosition } from "./players";
import { mod, WrapDebugTime } from "./utils";
import { getTileInfo } from "./worldgen/generator";
import { tileTextures } from "./worldgen/types";

const cv = document.getElementById("main_canvas") as HTMLCanvasElement;
let ctxn = cv.getContext("2d", { alpha: false});
if (!ctxn) throw new Error("Failed to get canvas context");
const ctx = ctxn as CanvasRenderingContext2D;

const camera: { x: number; y: number } = { x: 0, y: 0 };
const dt = document.getElementById("debug_text") as HTMLElement;
dt.style.fontSize = `${TILESIZE}px`;

const renderLoop = WrapDebugTime("renderLoop", (_: number = 0) => {
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
            ) length++;
            let g2 = 0;
            for (let n = VERYIMPORTANTRENDEROPTSTEPS; n != -1; n--) {
                while (length-g2 >= 1 << n) {
                    ctx.drawImage(tileTextures[tile][n].canvas, Math.floor((g2+x) * TILESIZE - mod(camera.x, TILESIZE)), Math.floor(y * TILESIZE - mod(camera.y, TILESIZE)));
                    g2 += 1 << n;
                };
                if (g2 == length) break;
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
        <p style="margin: 0;">${player.x} ${player.y}</p>
        <p style="margin: 0;">DEBUGTIMES: ${DEBUTIMES}</p>`;

    requestAnimationFrame(renderLoop);
});

renderLoop();
