import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { KernelInterface } from "../../types";

export const makeInk = (kernel: KernelInterface) =>
  make("INK", argsAreNumbers(4, 5), ([index, red, green, blue, alpha]) => {
    kernel.palette.set(index, red, green, blue, alpha);
    kernel.palette.updateCanvas();
    kernel.paint();
  });
