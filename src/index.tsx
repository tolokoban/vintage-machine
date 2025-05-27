import { ModalProvider, Theme } from "@tolokoban/ui"
import { createRoot } from "react-dom/client"

import App from "./app"
import { assets } from "./assets"

import "./index.css"
import "./highlight.css"
import "./font/josefin.css"
import { formatBasik } from "./components/WorkBench/PanelEditor/Editor/formatter"

function testFormat() {
    const code = `DEF DISP(  $text)  {$colors = [ 
    4, 7, 12, 33, 0] 
     IF LEN( $text)>5 { PRINTLN("Prout")
     IF LEN($text)<3 {
     PRINTLN("Beurk {") }}} CLS() }

EXIT()`
    console.log(code)
    const code1 = formatBasik(code)
}

async function start() {
    await assets.initialize()

    new Theme({
        colors: {
            neutral: ["#333", "#666"],
            primary: ["#222", "#555"],
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

// void start()
testFormat()
