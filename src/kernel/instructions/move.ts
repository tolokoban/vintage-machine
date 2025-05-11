import { KernelInterface } from "../types";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeMove = (kernel: KernelInterface) =>
  make("move", argsAreNumbers(2, 2), ([x, y]) => {
    kernel.x = x;
    kernel.y = y;
  });

export const makeMoveR = (kernel: KernelInterface) =>
  make("move", argsAreNumbers(2, 2), ([x, y]) => {
    kernel.x += x;
    kernel.y += y;
  });
