import { tgdCalcModulo } from "@tolokoban/tgd";
import { isNumber } from "@tolokoban/type-guards";
import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeCls = (kernel: KernelInterface) =>
  make("cls", argsAreNumbers(0, 1), ([color]) => {
    kernel.paintFB(() => {
      if (isNumber(color)) {
        kernel.painterRect.paint(
          0,
          0,
          1,
          1,
          tgdCalcModulo(Math.round(color), 0, 255),
        );
        return;
      }
      const { gl } = kernel;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
    kernel.x = kernel.TEXT_ORIGIN_X;
    kernel.y = kernel.TEXT_ORIGIN_Y;
    kernel.paint();
  });
