import { KernelInterface } from "../types"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const make{{namePascal}} = (kernel: KernelInterface) =>
    make("{{nameCamel}}", argsAreNumbers(2, 2), ([x, y]) => {
        kernel.x = x
        kernel.y = y
    })
