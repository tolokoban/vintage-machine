import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeLayer = (kernel: Kernel) =>
  make("layer", argsAreNumbers(1, 1), ([layer]) => {
    kernel.currentLayerIndex = layer;
  });
