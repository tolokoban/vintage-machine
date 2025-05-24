import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { Kernel } from "@/kernel";

export const makeInputDir = (kernel: Kernel) =>
  make("INPUTDIR", argsAreNumbers(0, 0), () => {
    return kernel.inputDir();
  });
