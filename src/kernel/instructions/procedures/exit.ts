import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { KernelInterface } from "../../types";
import { workbench } from "@/workbench";

export const makeExit = (kernel: KernelInterface) =>
  make("EXIT", argsAreNumbers(0, 0), () => {
    kernel.paint();
    workbench.stop();
  });
