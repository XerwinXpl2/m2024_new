import { DEBUGPRINTTIME, DEBUTIMES } from "./constsettings";

export const mod = WrapDebugTime("mod", (n: number, m: number): number => ((n % m) + m) % m);
export const norm = WrapDebugTime("norm", (v: number): number => v / 2 + 0.5);

export const getNewCanvasContext = WrapDebugTime(
    "getNewCanvasContext",
    (w: number, h: number, alpha: boolean = false) => {
        const canvas = new OffscreenCanvas(w, h);
        const ctx = canvas.getContext("2d", { alpha });
        if (!ctx) throw new Error("Failed to get canvas context");
        return ctx;
    },
);

const debugTimerMap: Map<string, { count: number; times: number }> = new Map();

export function debugPrintTime(v: string | null = null) {
    if (v) {
        const tmp = debugTimerMap.get(v);
        if (!tmp) {
            console.debug(`debugPrintTime fail: functon "${v}" not found`);
            return;
        }
        console.debug(
            `debugPrintTime: function "${v}" has average run time of ${tmp.times / tmp.count}ms, executed ${tmp.count} times, total time is ${tmp.times}ms`,
        );
    }
    debugTimerMap.forEach((e, b) => {
        console.debug(
            `debugPrintTime: function "${b}" has average run time of ${e.times / e.count}ms, executed ${e.count} times, total time is ${e.times}ms`,
        );
    });
}

export function WrapDebugTime<T extends (...args: any[]) => any>(
    key: string,
    f: T,
): T {
    if (!DEBUTIMES) return f;
    return ((...args: Parameters<T>): ReturnType<T> => {
        const l = performance.now();
        const ret = f(...args);
        const g = performance.now() - l;
        if (!debugTimerMap.get(key)) {
            debugTimerMap.set(key, { count: 1, times: g });
        } else {
            (debugTimerMap.get(key) as { count: number; times: number })
                .count++;
            (
                debugTimerMap.get(key) as { count: number; times: number }
            ).times += g;
        }
        return ret;
    }) as T;
}

if (DEBUTIMES) setInterval(debugPrintTime, DEBUGPRINTTIME);
debugPrintTime();
