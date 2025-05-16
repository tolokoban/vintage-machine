import { tgdCalcModulo } from "@tolokoban/tgd";
import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { KernelInterface } from "../../types";

export const makeInk = (kernel: KernelInterface) =>
  make("INK", argsAreNumbers(1, 1), ([value]) => {
    const index = tgdCalcModulo(Math.round(value), 0, 255);
    return kernel.palette.get(index);
  });
