import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";

export const makeSound = (kernel: Kernel) =>
  make("sound", argsAreNumbers(1, 2), ([freq, dur = 0.1]) => {
    kernel.sound(freq, dur, "sine");
  });
