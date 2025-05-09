import { KernelInterface } from "../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeRect = (kernel: KernelInterface) =>
  make("rect", argsAreNumbers(1, 2), ([width, height]) => {
    kernel.paintFB(() => {
      kernel.painterRect.paint(
        kernel.screenSpaceX(kernel.x),
        kernel.screenSpaceY(kernel.y),
        kernel.screenSpaceX(width),
        kernel.screenSpaceY(height ?? width),
        kernel.colorIndex,
      );
    });
  });
