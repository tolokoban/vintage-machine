import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { Kernel } from "@/kernel";

export const makeInk = (kernel: Kernel) =>
  make("INK", argsAreNumbers(4, 5), ([index, red, green, blue, alpha]) => {
    kernel.palette.set(index, red, green, blue, alpha);
    kernel.palette.updateCanvas();
    kernel.paint();
  });
