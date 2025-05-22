import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { KernelInterface } from "../../types";

export const makeInputDir = (kernel: KernelInterface) =>
  make("INPUTDIR", argsAreNumbers(0, 0), () => {
    return kernel.inputDir();
  });
