export function checkBoundary(h: number, w: number, i: number, j: number) {
    return 0 <= i && i < h && 0 <= j && j < w
}

export function range(n: number) {
    return [...Array(n).keys()]
}

export function sleep(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}