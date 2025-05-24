import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreStrings } from "@/basik/guards";

export const makeKey = (kernel: Kernel) =>
  make("key", argsAreStrings(1), (keys) => (kernel.isKeyPressed(keys) ? 1 : 0));
