import { getTileInfo } from "./worldgen/generator";
import { TileType } from "./worldgen/types";

const cv = document.getElementById("main_canvas") as HTMLCanvasElement;
let ctxn = cv.getContext("2d");
if (ctxn === null) {
    console.error("failed to get canvas context");
    throw new Error();
}
let ctx = ctxn as CanvasRenderingContext2D;

type point = {
    x: number;
    y: number;
};
let camera: point = { x: 0, y: 0 };

let TILESIZE: number = 32;

function renderLoop(ft: number) {
    // WARNING: render breaks when camera coords have non int values
    // TODO: this almost works, however
    // 1) when value are negative, floor is glitching, ceil does not.
    // 2) for some reason shapes that touch right edge are cut out.
    camera.y = Math.floor(ft/4);
    camera.x = camera.y;
    let t = performance.now();
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;

    for (let y = -1; y-1 < cv.height / TILESIZE; y++) {
        let sp = getTileInfo(-1, Math.floor(y)+Math.floor(camera.y/TILESIZE));
        let ll = 0;
        let ti;
        let x = -1;
        while (x-1 < cv.width / TILESIZE) {
            let ti = getTileInfo(x+Math.floor(camera.x/TILESIZE), Math.floor(y)+Math.floor(camera.y/TILESIZE));
            if (ti == sp) {
                ll++;
                x++;
                continue;
            }
            ctx.fillStyle =
                ti == TileType.cyan
                    ? "cyan"
                    : ti == TileType.key
                      ? "black"
                      : ti == TileType.magenta
                        ? "magenta"
                        : "yellow";
            ctx.fillRect(
                ((x - ll) * TILESIZE) - (camera.x%TILESIZE),
                (y * TILESIZE) - (camera.y%TILESIZE),
                TILESIZE * (ll + 1),
                TILESIZE,
            );
            ll = 0;
            sp = ti;
            x++;
        }
        ctx.fillStyle =
            ti == TileType.cyan
                ? "cyan"
                : ti == TileType.key
                  ? "black"
                  : ti == TileType.magenta
                    ? "magenta"
                    : "yellow";
        ctx.fillRect(
            ((x - ll) * TILESIZE) - (camera.x % TILESIZE),
            y * TILESIZE - (camera.y % TILESIZE),
            TILESIZE * (ll + 1),
            TILESIZE,
        );
    }

    ctx.font = `${TILESIZE}px "JetBrains mono"`;
    ctx.fillStyle = "#000000";
    ctx.fillText(`${1000.0 / (performance.now() - t)} fps`, 0, TILESIZE);
    requestAnimationFrame(renderLoop);
}
renderLoop(0);
