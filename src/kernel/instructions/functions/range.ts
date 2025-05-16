import { isNumber } from "@tolokoban/type-guards"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"
import { BasikValue } from "@/types"

export const makeRange = () =>
    make("RANGE", argsAreNumbers(1, 3), args => {
        let [start, count, step] = args
        if (!isNumber(count)) {
            count = start
            start = 0
        }
        if (!isNumber(step)) step = 1
        const array: Number[] = []
        for (let value = start; count > 0; count--) {
            array.push(value)
            value += step
        }
        return array as BasikValue
    })
