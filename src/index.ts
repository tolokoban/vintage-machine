import { tgdLoadArrayBuffer, tgdLoadText } from "@tolokoban/tgd";
import { Help } from "./help";

import "./index.css";
import "./font/josefin.css";
import { Kernel } from "./kernel";
import { BasikAssembly } from "./basik/asm"

async function start() {
  const help = new Help();
  await help.load("main");
  get("index").addEventListener("click", (evt: MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    help.load("index");
  });
  const symbols = await tgdLoadArrayBuffer("assets/symbols.arr");
  if (!symbols) {
    throw new Error(`Unable to load "assets/symbols.arr"!`);
  }

  const canvas = get("CANVAS") as HTMLCanvasElement;
  const kernel = new Kernel(canvas, symbols);
  const code = await tgdLoadText("assets/basik/test.bas")
  if (!code) {
    throw new Error(`Unable to load "assets/basik/test.bas"!`)
  }

  const asm = new BasikAssembly(code, kernel)
  asm.execute()

  globalThis.document.addEventListener("keydown", (evt: KeyboardEvent) => {
    if (evt.key === "F1") {
      evt.preventDefault();
      evt.stopPropagation();
      globalThis.document.body.classList.toggle("show");
      return;
    }
    console.log("🚀 [index] evt.key =", evt.key); // @FIXME: Remove this line written on 2025-05-03 at 20:58
  });
  removeSplashScreen();
}

function removeSplashScreen() {
  const SPLASH_VANISHING_DELAY = 900;
  const splash = document.getElementById("splash");
  if (!splash) return;

  splash.classList.add("vanish");
  window.setTimeout(() => {
    const parent = splash.parentNode;
    if (!parent) return;

    parent.removeChild(splash);
  }, SPLASH_VANISHING_DELAY);
}

function get(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Found no element with id #${id}!`);

  return element;
}

void start();
