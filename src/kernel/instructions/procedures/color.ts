import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeColor = (kernel: Kernel) =>
  make("color", argsAreNumbers(1, 1), ([colorIndex]) => {
    kernel.colorIndex = colorIndex;
  });
