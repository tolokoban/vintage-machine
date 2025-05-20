import { argsAreStrings } from "@/basik/guards"
import { make } from "./_common"
import { KernelInterface } from "../../types"

export const makeStop = (kernel: KernelInterface) =>
    make("STOP", argsAreStrings(0, 0), ([score]) => {
        kernel.music.stop()
    })
