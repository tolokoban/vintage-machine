import { argsAreNumbers } from "@/basik/guards"
import { make } from "./_common"
import { Kernel } from "@/kernel"
import { workbench } from "@/workbench"

export const makeExit = (kernel: Kernel) =>
    make("EXIT", argsAreNumbers(0, 0), () => {
        kernel.paint()
        workbench.stop()
    })
