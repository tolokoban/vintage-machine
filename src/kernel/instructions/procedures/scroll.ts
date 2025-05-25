import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeScroll = (kernel: Kernel) =>
  make("scrollX", argsAreNumbers(2, 2), ([scrollX, scrollY]) => {
    kernel.scroll(scrollX, scrollY);
  });
