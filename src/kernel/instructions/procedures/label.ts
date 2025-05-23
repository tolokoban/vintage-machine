import { isNumber, isString } from "@tolokoban/type-guards";
import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreAnys } from "@/basik/guards";
import { BasikValue } from "@/types";

export const makeLabel = (kernel: KernelInterface) =>
  make("label", argsAreAnys(1, 2), ([arg, scale = 1]: BasikValue[]) => {
    if (!isNumber(scale))
      throw new Error(
        `Si tu spécifie un deuxième argument pour LABEL(), il faut que ce soit un nombre.`,
      );
    const { x, y } = kernel;
    const text = isString(arg) ? arg : JSON.stringify(arg);
    let xx = kernel.x - scale * (text.length / 2) * kernel.CHAR_SIZE;
    const yy = kernel.y - (scale * kernel.CHAR_SIZE) / 2;
    for (const char of text.split("")) {
      kernel.x = xx + (scale * kernel.CHAR_SIZE) / 2;
      kernel.y = yy + (scale * kernel.CHAR_SIZE) / 2;
      kernel.print(char, scale);
      xx += kernel.CHAR_SIZE * scale;
    }
    kernel.x = x;
    kernel.y = y;
  });
