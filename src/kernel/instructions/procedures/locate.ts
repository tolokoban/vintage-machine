import { tgdCalcModulo } from "@tolokoban/tgd";
import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeLocate = (kernel: KernelInterface) =>
  make("locate", argsAreNumbers(2, 2), ([col, row]) => {
    const c = tgdCalcModulo(Math.floor(col), 0, kernel.TEXT_COLS - 1);
    const r = tgdCalcModulo(Math.floor(row), 0, kernel.TEXT_ROWS - 1);
    kernel.x = kernel.TEXT_ORIGIN_X + c * kernel.CHAR_SIZE;
    kernel.y = kernel.TEXT_ORIGIN_Y + r * kernel.CHAR_SIZE;
  });
