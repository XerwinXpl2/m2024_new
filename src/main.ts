import { DEBUTIMES, TILESIZE, VERYIMPORTANTRENDEROPTSTEPS } from "./constsettings";
import { player, players, updatePlayerPosition } from "./players";
import { tileTextures } from "./textures/tiles";
import { TileTextureType } from "./textures/types";
import { mod, WrapDebugTime } from "./utils";
import { getTile } from "./worldgen/generator";

const cv = document.getElementById("main_canvas") as HTMLCanvasElement;
let ctxn = cv.getContext("2d", { alpha: false });
if (!ctxn) throw new Error("Failed to get canvas context");
const ctx = ctxn as CanvasRenderingContext2D;

const camera: { x: number; y: number } = { x: 0, y: 0 };
const dt = document.getElementById("debug_text") as HTMLElement;
dt.style.fontSize = `${TILESIZE}px`;

let fpst = 0;
let rli = 0;

let lastFrameTime = performance.now();

const renderLoop = WrapDebugTime("renderLoop", (currentTime: number = 0) => {
    rli++;
    const startTime = performance.now();

    cv.width = window.innerWidth;
    cv.height = window.innerHeight;

    updatePlayerPosition(player, (currentTime - lastFrameTime) / 1000);
    lastFrameTime = currentTime;
    camera.x = (player.x * TILESIZE) + (player.width * TILESIZE - cv.width) * 0.5;
    camera.y = (player.y * TILESIZE) + (player.height * TILESIZE - cv.height) * 0.5;

    const newx = Math.floor(camera.x / TILESIZE);
    const newy = Math.floor(camera.y / TILESIZE);

    for (let y = -1; y * TILESIZE < cv.height + TILESIZE; y++) {
        let x = -1;
        while (x * TILESIZE < cv.width + TILESIZE) {
            const biome = getTile(newx + x, newy + y);
            let length = 1;
            while (
                x + length < cv.width / TILESIZE + 1 &&
                getTile(newx + x + length, newy + y) == biome
            ) length++;
            let g2 = 0;
            for (let n = VERYIMPORTANTRENDEROPTSTEPS; n != -1; n--) {
                while (length - g2 >= 1 << n) {
                    ctx.drawImage((tileTextures.get(biome) as TileTextureType)[n].canvas, Math.floor((g2 + x) * TILESIZE - mod(camera.x, TILESIZE)), Math.floor(y * TILESIZE - mod(camera.y, TILESIZE)));
                    g2 += 1 << n;
                };
                if (g2 == length) break;
            }
            x += length;
        }
    }

    players.forEach((p) => {
        ctx.drawImage(p.tx.canvas, p.x * TILESIZE - camera.x, p.y * TILESIZE - camera.y)
    });

    let tmp: number = (performance.now() - startTime);
    let fps: number = 1000 / tmp;
    fpst += fps;
    dt.innerHTML = `
        <p style="margin: 0; color: ${tmp > 4 ? "red" : tmp > 2 ? "orange" : "green"};">${Math.round(tmp * 10000) / 10000} ms</p>
        <p style="margin: 0; color: ${fps < 60 ? "red" : fps < 240 ? "orange" : "green"};">${Math.round(fps)} fps</p>
        <p style="margin: 0;">${Math.round(fpst / rli)} fps on average</p>
        <p style="margin: 0;">frame ${rli}</p>
        <p style="margin: 0;">${player.x} ${player.y}</p>
        <p style="margin: 0;">DEBUGTIMES: ${DEBUTIMES}</p>`;

    requestAnimationFrame(renderLoop);
});

renderLoop();
