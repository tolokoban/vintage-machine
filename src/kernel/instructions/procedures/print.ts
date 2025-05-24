import { isString } from "@tolokoban/type-guards";
import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreAnys } from "@/basik/guards";
import { BasikValue } from "@/types";

function print(kernel: Kernel, args: BasikValue[]) {
  const text = args
    .map((arg) => (isString(arg) ? arg : JSON.stringify(arg)))
    .join("");
  kernel.print(text);
}

export const makePrint = (kernel: Kernel) =>
  make("print", argsAreAnys(), (args: BasikValue[]) => {
    print(kernel, args);
  });

export const makePrintLn = (kernel: Kernel) =>
  make("println", argsAreAnys(), (args: BasikValue[]) => {
    print(kernel, args);
    kernel.x = kernel.TEXT_ORIGIN_X;
    kernel.y += kernel.CHAR_SIZE;
  });
