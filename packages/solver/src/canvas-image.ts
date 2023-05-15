export class CanvasImage {
    data: Uint8ClampedArray
    h: number
    w: number

    constructor(data: Uint8ClampedArray, h: number, w: number) {
        this.data = data
        this.h = h
        this.w = w
    }

    getRgb(x: number, y: number) {
        const idx = (x * this.w + y) * 4
        return this.data.slice(idx, idx + 3)
    }
}
