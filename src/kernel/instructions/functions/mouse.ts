import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { Kernel } from "@/kernel";

export const makeMouseX = (kernel: Kernel) =>
  make("MOUSEX", argsAreNumbers(0, 0), () => kernel.mouseX);

export const makeMouseY = (kernel: Kernel) =>
  make("MOUSEY", argsAreNumbers(0, 0), () => kernel.mouseY);
