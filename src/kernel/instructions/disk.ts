import { KernelInterface } from "../types"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeDisk = (kernel: KernelInterface) =>
    make("disk", argsAreNumbers(1, 2), ([radiusX, radiusY]) => {
        kernel.paintFB(() => {
            kernel.painterDisk.paint(
                kernel.screenSpaceX(kernel.x),
                kernel.screenSpaceY(kernel.y),
                kernel.screenSpaceX(radiusX),
                kernel.screenSpaceY(radiusY ?? radiusX),
                kernel.colorIndex
            )
        })
    })
