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
        const delay = ensureNumber(seconds, 0);
        kernel.paint();
        globalThis.setTimeout(() => {
          console.log("Slept", seconds, "seconds.");
          resolve();
        }, delay * 1000);
      }),
  );
