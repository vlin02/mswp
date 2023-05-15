import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App"

enum Format {
    SEARCH = "SEARCH",
    FBX = "FBX"
}

export const pageFormat = document.title.includes("Google Search")
    ? Format.SEARCH
    : Format.FBX

export const ExtensionRoot = document.createElement("div")
ExtensionRoot.style.cssText = "display:flex; height:auto"

if (pageFormat === Format.SEARCH) {
    const GameContainer = document.querySelector(
        `[class='AU64fe zsYMMe TUOsUe']`
    )?.firstChild as HTMLElement
    GameContainer.style.cssText += "display:flex"

    GameContainer.appendChild(ExtensionRoot)
}

if (pageFormat === Format.FBX) {
    document.body.style.cssText += "display:flex; block-size:fit-content"
    document.body.appendChild(ExtensionRoot)
}

const root = ReactDOM.createRoot(ExtensionRoot)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)