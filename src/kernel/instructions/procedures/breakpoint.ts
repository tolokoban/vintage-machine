import { argsAreNumbers } from "@/basik/guards";
import { make } from "./_common";
import { Kernel } from "@/kernel";

export const makeBreakpoint = (kernel: Kernel) =>
  make("BREAKPOINT", argsAreNumbers(0, 0), () => {
    console.log("Breakpoint!");
    for (const name of kernel.variables.keys()) {
      console.log(name, ":=", kernel.variables.get(name));
    }
    if (kernel.variables !== kernel.globalVariables) {
      console.log("Global variables:");
      for (const name of kernel.globalVariables.keys()) {
        console.log(name, ":=", kernel.globalVariables.get(name));
      }
    }
  });
