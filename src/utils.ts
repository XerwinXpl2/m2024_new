export function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

export function getNewCanvasContext(w: number, h: number, alpha: boolean = false) {
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d", { alpha })
    if (!ctx) throw new Error("Failed to get canvas context");
    return ctx;
}