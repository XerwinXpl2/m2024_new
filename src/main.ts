import { DEBUG_TIMER, TILE_COALESCENCE_POWER, TILE_SIZE } from "./constsettings";
import { player, players, updatePlayerPosition } from "./players";
import { tileTextures } from "./textures/tiles";
import { TileTextureType } from "./textures/types";
import { mod, WrapDebugTime } from "./utils";
import { getTile } from "./worldgen/generator";

const cv = document.getElementById("main_canvas") as HTMLCanvasElement;
let ctxn = cv.getContext("2d", { alpha: false, desynchonized: false, willReadFrequently: false });
if (!ctxn) throw new Error("Failed to get canvas context");
const ctx = ctxn as CanvasRenderingContext2D;

const camera: { x: number; y: number } = { x: 0, y: 0 };
const dt = document.getElementById("debug_text") as HTMLElement;

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
    camera.x = (player.x * TILE_SIZE) + (player.width * TILE_SIZE - cv.width) * 0.5;
    camera.y = (player.y * TILE_SIZE) + (player.height * TILE_SIZE - cv.height) * 0.5;

    const newx = Math.floor(camera.x / TILE_SIZE);
    const newy = Math.floor(camera.y / TILE_SIZE);

    for (let y = -1; y * TILE_SIZE < cv.height + TILE_SIZE; y++) {
        let x = -1;
        while (x * TILE_SIZE < cv.width + TILE_SIZE) {
            const biome = getTile(newx + x, newy + y);
            let length = 1;
            while (
                x + length < cv.width / TILE_SIZE + 1 &&
                getTile(newx + x + length, newy + y) == biome
            ) length++;
            let g2 = 0;
            for (let n = TILE_COALESCENCE_POWER; n != -1; n--) {
                while (length - g2 >= 1 << n) {
                    ctx.drawImage((tileTextures.get(biome) as TileTextureType)[n].canvas, Math.floor((g2 + x) * TILE_SIZE - mod(camera.x, TILE_SIZE)), Math.floor(y * TILE_SIZE - mod(camera.y, TILE_SIZE)));
                    g2 += 1 << n;
                };
                if (g2 == length) break;
            }
            x += length;
        }
    }

    players.forEach((p) => {
        ctx.drawImage(p.tx.canvas, p.x * TILE_SIZE - camera.x, p.y * TILE_SIZE - camera.y)
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
        <p style="margin: 0;">DEBUGTIMES: ${DEBUG_TIMER}</p>`;

    requestAnimationFrame(renderLoop);
});

renderLoop();
