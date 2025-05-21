import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeDisk = (kernel: KernelInterface) =>
  make(
    "disk",
    argsAreNumbers(1, 5),
    ([radiusX, radiusY, angle, spread, start]) => {
      kernel.paintFB(() => {
        kernel.painterDisk.paint(
          kernel.screenSpaceX(kernel.x),
          kernel.screenSpaceY(kernel.y),
          kernel.screenSpaceX(radiusX),
          kernel.screenSpaceY(radiusY ?? radiusX),
          kernel.colorIndex,
          angle ?? 0,
          spread ?? 360,
          start ?? 0,
        );
      });
    },
  );
