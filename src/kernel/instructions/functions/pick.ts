import { isString } from "@tolokoban/type-guards"
import { make } from "./_common"
import { argsAreOneArrayOrOneString } from "@/basik/guards"
import { Kernel } from "@/kernel/kernel"

export const makePick = (kernel: Kernel) =>
    make("PICK", argsAreOneArrayOrOneString(), ([list]) => {
        const index = Math.floor(kernel.random.value * list.length)
        if (isString(list)) return list.charAt(index)

        return list[index]
    })
