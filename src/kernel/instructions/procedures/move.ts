import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeMove = (kernel: Kernel) =>
  make("move", argsAreNumbers(2, 2), ([x, y]) => {
    kernel.x = x;
    kernel.y = y;
  });

export const makeMoveR = (kernel: Kernel) =>
  make("move", argsAreNumbers(2, 2), ([x, y]) => {
    kernel.x += x;
    kernel.y += y;
  });
