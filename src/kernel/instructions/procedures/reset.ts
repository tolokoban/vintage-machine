import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeReset = (kernel: Kernel) =>
  make("reset", argsAreNumbers(0, 0), () => {
    kernel.reset();
  });
