import { Kernel } from "@/kernel"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeDisk = (kernel: Kernel) =>
    make(
        "disk",
        argsAreNumbers(1, 5),
        ([radiusX, radiusY, angle, spread, start]) => {
            kernel.paintCurrentLayer(() => {
                kernel.painterDisk.paint(
                    kernel.screenSpaceX(kernel.x),
                    kernel.screenSpaceY(kernel.y),
                    kernel.screenSpaceX(radiusX),
                    kernel.screenSpaceY(radiusY ?? radiusX),
                    kernel.colorIndex,
                    angle ?? 0,
                    spread ?? 360,
                    start ?? 0
                )
            })
        }
    )
