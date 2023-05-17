import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App"
import {
    DifficultyInfo,
    DifficultySelectors,
    DifficultyType,
    GameOverOverlay,
    GamePlatform,
    PlayButton,
    clickSquare,
    SoundButton,
    pagePlatform,
    sleep
} from "@mswp/solver"
import "setimmediate"
import * as mswp from "@mswp/solver"
import { RunMode, Solver } from "./solver"

GameOverOverlay.style.cssText += "z-index: 1"

//@ts-ignore
window.mswp = mswp

export const ExtensionRoot = document.createElement("div")
ExtensionRoot.style.cssText = "display:flex; height:auto;"

if (pagePlatform === GamePlatform.SEARCH) {
    const GameContainer = document.querySelector(
        `[class='AU64fe zsYMMe TUOsUe']`
    )?.firstChild as HTMLElement
    GameContainer.style.cssText += "display:flex"

    GameContainer.appendChild(ExtensionRoot)
}

if (pagePlatform === GamePlatform.FBX) {
    document.body.style.cssText += "display:flex; block-size:fit-content"
    document.body.appendChild(ExtensionRoot)
}

SoundButton.click()


DifficultySelectors[DifficultyType.HARD].click()

async function main() {
    // let t = performance.now()
    // let id: any
    // let i = 0
    // id = setInterval( () => {
    //     console.log("here")
    //     console.log(performance.now() - t)
    //     i += 1
    //     console.log(i)
    //     if (i == 10) clearInterval(id)
    // }, 5)

    const s = new Solver(mswp.Formats.FBX_HARD, {
        startDelay: 0,
        refreshRate: 0,
        solverDepth: 5,
        startSquares: [[10,12],[5,5], [15,15]]
    }, () => {})
    await s.start(RunMode.RESET)

    // PlayButton.click()
    // clickSquare(DifficultyInfo[DifficultyType.HARD].sqSize, [10, 10])
}
//@ts-ignore
window.s = main

const root = ReactDOM.createRoot(ExtensionRoot)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
