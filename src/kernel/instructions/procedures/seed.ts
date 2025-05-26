import { make } from "./_common"
import { argsAreAnys } from "@/basik/guards"
import { Kernel } from "@/kernel/kernel"
import { isNumber, isString } from "@tolokoban/type-guards"

export const makeSeed = (kernel: Kernel) =>
    make("SEED", argsAreAnys(1, 1), ([arg]) => {
        if (isNumber(arg)) kernel.random.seed = arg
        else {
            let text = isString(arg) ? arg : JSON.stringify(arg)
            let seed = text.length
            for (const c of text.split("")) {
                seed += c.charCodeAt(0) * 0.01
            }
            kernel.random.seed = seed
        }
    })
