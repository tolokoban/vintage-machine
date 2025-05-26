import { isNumber } from "@tolokoban/type-guards"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"
import { Kernel } from "@/kernel"

export const makeRandom = (kernel: Kernel) =>
    make("RANDOM", argsAreNumbers(0, 2), args => {
        if (args.length === 0) return kernel.random.value

        const [start, end] = args
        if (!isNumber(end)) {
            return Math.floor(kernel.random.value * start)
        }

        if (start === end) return start
        return (
            Math.min(start, end) +
            Math.floor(kernel.random.value * (Math.abs(end - start) + 1))
        )
    })

export const makeRandomFloat = (kernel: Kernel) =>
    make("RANDOMF", argsAreNumbers(0, 2), args => {
        if (args.length === 0) return kernel.random.value

        const [start, end] = args
        if (!isNumber(end)) {
            return kernel.random.value * start
        }

        if (start === end) return start
        return (
            Math.min(start, end) +
            kernel.random.value * (Math.abs(end - start) + 1)
        )
    })
