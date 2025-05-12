import { KernelInterface } from "../types"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeReset = (kernel: KernelInterface) =>
    make("reset", argsAreNumbers(0, 0), () => {
        kernel.reset()
    })
