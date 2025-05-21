import { ensureNumber } from "@tolokoban/type-guards";
import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makePause = (kernel: KernelInterface) =>
  make(
    "pause",
    argsAreNumbers(0, 1),
    ([seconds]) =>
      new Promise((resolve) => {
        const delay = Math.max(0, ensureNumber(seconds, 0));
        if (delay > 0) {
          kernel.paint();
          globalThis.setTimeout(resolve, delay * 1000);
        } else {
          globalThis.requestAnimationFrame(() => {
            kernel.paint();
            globalThis.setTimeout(resolve);
          });
        }
      }),
  );
