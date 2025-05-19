import { KernelInterface } from "../../types"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeSound = (kernel: KernelInterface) =>
    make("sound", argsAreNumbers(1, 2), ([freq, dur = 0.1]) => {
        kernel.sound(freq, dur, "sine")
    })
