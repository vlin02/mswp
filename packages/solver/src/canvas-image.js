export class CanvasImage {
    data;
    h;
    w;
    constructor(data, h, w) {
        this.data = data;
        this.h = h;
        this.w = w;
    }
    getRgb(x, y) {
        const idx = (x * this.w + y) * 4;
        return this.data.slice(idx, idx + 3);
    }
}
