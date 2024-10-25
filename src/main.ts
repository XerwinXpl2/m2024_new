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
    camera.x = Math.sin(ft / 1000) * 10;
    let t = performance.now();
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;

    for (let y = 0; y < cv.height / TILESIZE; y++) {
        let sp = getTileInfo(0, y);
        let ll = 0;
        let ti;
        let x = 0;
        while (x < cv.width / TILESIZE) {
            let ti = getTileInfo(x, y);
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
                (x - ll) * TILESIZE,
                y * TILESIZE,
                TILESIZE * (ll + 1),
                TILESIZE,
            );
            ll = 0;
            sp = ti;
            x++;
            console.log(x);
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
            (x - ll) * TILESIZE,
            y * TILESIZE,
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
