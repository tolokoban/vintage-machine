import { Kernel } from "@/kernel"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeRect = (kernel: Kernel) =>
    make("rect", argsAreNumbers(1, 3), ([width, height, angle]) => {
        kernel.paintCurrentLayer(() => {
            kernel.painterRect.paint(
                kernel.screenSpaceX(kernel.x),
                kernel.screenSpaceY(kernel.y),
                width,
                height ?? width,
                kernel.colorIndex,
                angle ?? 0
            )
        })
    })
