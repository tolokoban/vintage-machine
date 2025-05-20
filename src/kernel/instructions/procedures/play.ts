import { argsAreStrings } from "@/basik/guards"
import { make } from "./_common"
import { KernelInterface } from "../../types"

export const makePlay = (kernel: KernelInterface) =>
    make("PLAY", argsAreStrings(1, 1), ([score]) => {
        kernel.music.play(score)
    })
