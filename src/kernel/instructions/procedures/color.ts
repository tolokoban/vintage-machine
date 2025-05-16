import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeColor = (kernel: KernelInterface) =>
  make("color", argsAreNumbers(1, 1), ([colorIndex]) => {
    kernel.colorIndex = colorIndex;
  });
