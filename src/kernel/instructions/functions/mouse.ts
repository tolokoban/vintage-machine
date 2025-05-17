import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { KernelInterface } from "../../types";

export const makeMouseX = (kernel: KernelInterface) =>
  make("MOUSEX", argsAreNumbers(0, 0), () => kernel.mouseX);

export const makeMouseY = (kernel: KernelInterface) =>
  make("MOUSEY", argsAreNumbers(0, 0), () => kernel.mouseY);
