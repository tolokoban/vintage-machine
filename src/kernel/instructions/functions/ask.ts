import { BasikValue } from "@/types";
import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreAnys } from "@/basik/guards";
import { isString } from "@tolokoban/type-guards";

export const makeAsk = (kernel: KernelInterface) =>
  make(
    "ASK",
    argsAreAnys(0),
    async (args: BasikValue[]) => await ask(args, kernel),
  );

export const makeAskNum = (kernel: KernelInterface) =>
  make("ASK", argsAreAnys(0), async (args: BasikValue[]) =>
    toNumber(await ask(args, kernel)),
  );

export const makeAskInt = (kernel: KernelInterface) =>
  make("ASK", argsAreAnys(0), async (args: BasikValue[]) =>
    Math.round(toNumber(await ask(args, kernel))),
  );

function toNumber(str: string): number {
  const num = parseFloat(str);
  return Number.isNaN(num) ? 0 : num;
}

function ask(args: BasikValue[], kernel: KernelInterface) {
  return new Promise<string>((resolve) => {
    const text = args
      .map((arg) => (isString(arg) ? arg : JSON.stringify(arg)))
      .join("");
    kernel.print(text);
    kernel.paint();
    let isCursorVisible = true;
    const cursorShow = () => {
      kernel.printChar(0x8f);
      kernel.paint();
    };
    const cursorHide = () => {
      const colorIndex = kernel.colorIndex;
      kernel.colorIndex = 0;
      kernel.printChar(0x8f);
      kernel.colorIndex = colorIndex;
      kernel.paint();
    };
    const cursorBlink = globalThis.setInterval(() => {
      if (isCursorVisible) cursorShow();
      else cursorHide();
      isCursorVisible = !isCursorVisible;
    }, 500);
    let value = "";
    cursorShow();
    const handleKey = (evt: KeyboardEvent) => {
      if (evt.ctrlKey || evt.altKey || evt.metaKey) return;

      try {
        const { key } = evt;
        if (key.length === 1) {
          value += key;
          cursorHide();
          kernel.print(key);
          return;
        }
        if (key === "Enter") {
          globalThis.document.removeEventListener("keydown", handleKey);
          cursorHide();
          kernel.x = kernel.TEXT_ORIGIN_X;
          kernel.y += kernel.CHAR_SIZE;
          globalThis.clearInterval(cursorBlink);
          resolve(value);
          return;
        }
      } finally {
        kernel.paint();
      }
    };
    globalThis.document.addEventListener("keydown", handleKey);
  });
}
