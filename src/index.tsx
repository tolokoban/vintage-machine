import { ModalProvider, Theme } from "@tolokoban/ui"
import { createRoot } from "react-dom/client"

import App from "./app"
import { assets } from "./assets"

import "./index.css"
import "./highlight.css"
import "./font/josefin.css"

async function start() {
    await assets.initialize()

    new Theme({
        colors: {
            neutral: ["#999", "#fff"],
        },
    }).apply()
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(
        <ModalProvider>
            <App />
        </ModalProvider>
    )

    removeSplashScreen()
}

function removeSplashScreen() {
    const SPLASH_VANISHING_DELAY = 900
    const splash = document.getElementById("splash")
    if (!splash) return

    splash.classList.add("vanish")
    window.setTimeout(() => {
        const parent = splash.parentNode
        if (!parent) return

        parent.removeChild(splash)
    }, SPLASH_VANISHING_DELAY)
}

void start()
