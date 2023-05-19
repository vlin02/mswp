export function checkBoundary(h: number, w: number, i: number, j: number) {
    return 0 <= i && i < h && 0 <= j && j < w
}

export function range(n: number) {
    return [...Array(n).keys()]
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}