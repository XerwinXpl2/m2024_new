import { DEBUG_TIMER_PRINT_PERIOD, DEBUG_TIMER } from "./constsettings";

/**
 * mathematical modulo
 * @param n divident
 * @param m divisor
 */
export const mod = WrapDebugTime("mod", (n: number, m: number): number => ((n % m) + m) % m);

/**
 * maps [-1, 1] values to [0, 1]
 */
export const rmpnorm = WrapDebugTime("rmpnorm", (v: number) => (1 + v) * 0.5);

/**
 * maps [0, 1] values to [-1, 1]
 */
export const rmpb = WrapDebugTime("rmpb", (v: number) => (v * 2) - 1);

/**
 * creates new desynchronized offscreen canvas rendering context, willReadFrequently is set to true
 * @param w canvas width
 * @param h canvas height
 * @param [alpha=false] alpha
 * @throws will throw an error if canvas.getContext fails
 */
export const getNewCanvasContext = WrapDebugTime(
    "getNewCanvasContext",
    (w: number, h: number, alpha: boolean = false) => {
        const canvas = new OffscreenCanvas(w, h);
        const ctx = canvas.getContext("2d", { alpha, desynchronized: true, willReadFrequently: true });
        if (!ctx) throw new Error("Failed to get canvas context");
        return ctx;
    },
);

const debugTimerMap = new Map<string, { execCount: number; totalTime: number }>();

/**
 * prints data collected by debug timer
 * @param v name under which the data for the function is collected, if missing data for all the functions will be printed
 */
export function debugPrintTime(v?: string) {
    if (v) {
        const tmp = debugTimerMap.get(v);
        if (!tmp) {
            console.debug(`debugPrintTime fail: functon "${v}" not found`);
            return;
        }
        console.debug(
            `debugPrintTime: function "${v}" has average run time of ${tmp.totalTime / tmp.execCount}ms, executed ${tmp.execCount} time${tmp.execCount == 1 ? "" : "s"}, total time is ${tmp.totalTime}ms`,
        );
        return;
    }
    debugTimerMap.forEach((e, b) => {
        console.debug(
            `debugPrintTime: function "${b}" has average run time of ${e.totalTime / e.execCount}ms, executed ${e.execCount} time${e.execCount == 1 ? "" : "s"}, total time is ${e.totalTime}ms`,
        );
    });
    console.debug("debugPrintTime: end");
}

/**
 * wrapps given function into a debug code
 * @param key name of the function to be wrapped
 * @param f function to be wrapped
 * @returns function with the same types as passed function
 */
export function WrapDebugTime<T extends (...args: any[]) => any>(
    key: string,
    f: T,
): T {
    if (!DEBUG_TIMER) return f;
    return ((...args: Parameters<T>): ReturnType<T> => {
        const l = performance.now();
        const ret = f(...args);
        const g = performance.now() - l;
        const tmp = debugTimerMap.get(key);
        if (!tmp) {
            debugTimerMap.set(key, { execCount: 1, totalTime: g });
            return ret;
        }
        tmp.execCount++;
        tmp.totalTime += g;
        return ret;
    }) as T;
}

if (DEBUG_TIMER) setInterval(debugPrintTime, DEBUG_TIMER_PRINT_PERIOD);