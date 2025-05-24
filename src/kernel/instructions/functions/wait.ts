import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreStrings } from "@/basik/guards";

export const makeWait = (kernel: Kernel) =>
  make("wait", argsAreStrings(0, 0), () => kernel.waitKey());
