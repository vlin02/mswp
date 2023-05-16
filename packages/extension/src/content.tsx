import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App"
import {
    DifficultyInfo,
    DifficultySelectors,
    DifficultyType,
    GamePlatform,
    PlayButton,
    clickSquare,
    pagePlatform,
    sleep
} from "@mswp/solver"

export const ExtensionRoot = document.createElement("div")
ExtensionRoot.style.cssText = "display:flex; height:auto"

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

async function main() {
    PlayButton.click()
    DifficultySelectors[DifficultyType.HARD].click()
    clickSquare(DifficultyInfo[DifficultyType.HARD].sqSize, [10, 10])
}
main()

const root = ReactDOM.createRoot(ExtensionRoot)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
