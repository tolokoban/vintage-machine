import { argsAreStrings } from "@/basik/guards";
import { make } from "./_common";
import { Kernel } from "@/kernel";

export const makeStop = (kernel: Kernel) =>
  make("STOP", argsAreStrings(0, 0), ([score]) => {
    kernel.music.stop();
  });
