import { isNumber } from "@tolokoban/type-guards"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeRandom = () =>
    make("RANDOM", argsAreNumbers(1, 2), args => {
        const [start, end] = args
        if (!isNumber(end)) {
            return Math.floor(Math.random() * start)
        }
        if (start === end) return start
        return (
            Math.min(start, end) +
            Math.floor(Math.random() * (Math.abs(end - start) + 1))
        )
    })
