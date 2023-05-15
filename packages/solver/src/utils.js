export function checkBoundary(h, w, i, j) {
    return 0 <= i && i < h && 0 <= j && j < w;
}
export function range(n) {
    return [...Array(n).keys()];
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
