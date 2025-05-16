import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeLayer = (kernel: KernelInterface) =>
  make("layer", argsAreNumbers(1, 1), ([layer]) => {
    kernel.currentLayerIndex = layer;
  });
