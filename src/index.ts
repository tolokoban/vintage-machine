import { tgdLoadImage } from "@tolokoban/tgd"

import { initializeState } from "./state"

import "./index.css"
import "./font/josefin.css"

async function start() {
    const symbols = await tgdLoadImage("assets/symbols/CPC6128.png")
    if (!symbols) {
        throw new Error(`Unable to load "assets/symbols.arr"!`)
    }
    initializeState({ symbols })
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
