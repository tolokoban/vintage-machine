import { isNumber } from "@tolokoban/type-guards"
import { make } from "./_common"
import { argsAreAnys } from "@/basik/guards"

export const makeLen = () =>
    make("LEN", argsAreAnys(1, 1), args => {
        let [value] = args
        if (isNumber(value))
            return value === 0
                ? 1
                : Math.max(0, Math.ceil(Math.log10(Math.abs(value) + 1e-14)))
        return value.length
    })
