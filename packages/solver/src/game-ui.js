import { CanvasImage } from "./canvas-image";
import { DifficultyType } from "./types";
function fromJsname(jsname) {
    return document.querySelector(`[jsname='${jsname}']`);
}
export const Canvas = fromJsname("UzWXSb");
export const AgainButton = fromJsname("AWieJ");
export const SoundButton = fromJsname("N7ntOd");
export const PlayButton = fromJsname("ZC7Tjb");
export const DifficultySelectors = {
    [DifficultyType.EASY]: document.querySelector(`[data-difficulty='EASY']`),
    [DifficultyType.MEDIUM]: document.querySelector(`[data-difficulty='MEDIUM']`),
    [DifficultyType.HARD]: document.querySelector(`[data-difficulty='HARD']`)
};
const CanvasCtx = Canvas.getContext("2d", {
    willReadFrequently: true
});
export function clickCanvas(cord, leftClick = true) {
    const [x, y] = cord;
    const { left, top } = Canvas.getBoundingClientRect();
    const data = {
        clientX: left + y,
        clientY: top + x,
        button: leftClick ? 0 : 2
    };
    const eventNames = ["mousedown", "mouseup"];
    eventNames.forEach((name) => Canvas.dispatchEvent(new MouseEvent(name, data)));
}
export function pressKey(k) {
    const data = {
        keyCode: k.charCodeAt(0),
        bubbles: true
    };
    const e = new KeyboardEvent("keydown", data);
    document.dispatchEvent(e);
}
export function getCanvasImage() {
    const [h, w] = [Canvas.height, Canvas.width];
    const { data } = CanvasCtx.getImageData(0, 0, w, h);
    return new CanvasImage(data, h, w);
}
export function gameOverVisible() {
    return (document.querySelector(`[style='opacity: 1; visibility: visible;']`) !=
        null);
}
