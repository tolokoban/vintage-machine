import { KernelInterface } from "../types"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makePause = (kernel: KernelInterface) =>
    make(
        "pause",
        argsAreNumbers(1, 1),
        ([seconds]) =>
            new Promise(resolve => {
                kernel.paint()
                console.log("Sleeping", seconds, "seconds...")

                globalThis.setTimeout(() => {
                    console.log("Slept", seconds, "seconds.")
                    resolve()
                }, seconds * 1000)
            })
    )
