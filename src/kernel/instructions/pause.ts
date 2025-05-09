import { isNumber } from "@tolokoban/type-guards";
import { KernelInterface } from "../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makePause = (kernel: KernelInterface) =>
  make(
    "pause",
    argsAreNumbers(0, 1),
    ([seconds]) =>
      new Promise((resolve) => {
        if (isNumber(seconds)) {
          kernel.paint();
          globalThis.setTimeout(() => {
            console.log("Slept", seconds, "seconds.");
            resolve();
          }, seconds * 1000);
        } else {
          globalThis.requestAnimationFrame(() => {
            kernel.paint();
            resolve();
          });
        }
      }),
  );
