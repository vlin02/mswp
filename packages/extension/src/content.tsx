import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App"
import {
    DifficultySelectors,
    GameOverOverlay,
    GamePlatform,
    SoundButton,
    pagePlatform
} from "@mswp/solver"
import "setimmediate"
import * as mswp from "@mswp/solver"
import { INITIAL_DIFFICULTY, IS_PRODUCTION } from "./const"

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

if (!IS_PRODUCTION) {
    DifficultySelectors[INITIAL_DIFFICULTY].click()
    SoundButton.click()
}

const root = ReactDOM.createRoot(ExtensionRoot)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
