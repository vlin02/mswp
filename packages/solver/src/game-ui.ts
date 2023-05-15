import { CanvasImage } from "./canvas-image"
import { Coordinate, DifficultyType, GamePlatform } from "./types"

function fromJsname<T = HTMLElement>(jsname: string) {
    return document.querySelector(`[jsname='${jsname}']`) as T
}

export const pagePlatform = document.title.includes("Google Search")
    ? GamePlatform.SEARCH
    : GamePlatform.FBX

export const Canvas = fromJsname<HTMLCanvasElement>("UzWXSb")
export const AgainButton = fromJsname("AWieJ")
export const SoundButton = fromJsname("N7ntOd")
export const PlayButton = fromJsname("ZC7Tjb")
export const DifficultySelectors = {
    [DifficultyType.EASY]: document.querySelector(`[data-difficulty='EASY']`),
    [DifficultyType.MEDIUM]: document.querySelector(
        `[data-difficulty='MEDIUM']`
    ),
    [DifficultyType.HARD]: document.querySelector(`[data-difficulty='HARD']`)
} as { [key in DifficultyType]: HTMLElement }

const CanvasCtx = Canvas && Canvas.getContext("2d", {
    willReadFrequently: true
}) as CanvasRenderingContext2D

export function clickCanvas(cord: Coordinate, leftClick = true) {
    const [x, y] = cord
    const { left, top } = Canvas.getBoundingClientRect()

    const data = {
        clientX: left + y,
        clientY: top + x,
        button: leftClick ? 0 : 2
    }

    const eventNames = ["mousedown", "mouseup"]

    eventNames.forEach((name) =>
        Canvas.dispatchEvent(new MouseEvent(name, data))
    )
}

export function pressKey(k: string) {
    const data = {
        keyCode: k.charCodeAt(0),
        bubbles: true
    }
    const e = new KeyboardEvent("keydown", data)
    document.dispatchEvent(e)
}

export function getCanvasImage() {
    const [h, w] = [Canvas.height, Canvas.width]
    const { data } = CanvasCtx.getImageData(0, 0, w, h)
    return new CanvasImage(data, h, w)
}

export function gameOverVisible() {
    return (
        document.querySelector(`[style='opacity: 1; visibility: visible;']`) !=
        null
    )
}
