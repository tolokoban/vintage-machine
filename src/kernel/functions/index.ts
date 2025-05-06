import { KernelInterface } from "../types"
import { make } from "./_common"
import {
    argsAreNumberAny,
    argsAreNumbers,
    argsAreStrings,
} from "@/basik/guards"
import { makeRange } from "./range"
import { makeRandom } from "./random"
import { makeInput } from "./input"

export const makeKernelFunctions = (kernel: KernelInterface) => ({
    ABS: make("ABS", argsAreNumbers(1, 1), ([a]) => Math.abs(a)),
    INPUT: makeInput(kernel),
    INT: make("INT", argsAreStrings(1, 1), ([value]) =>
        Math.round(Number(value))
    ),
    LIST: make("LIST", argsAreNumberAny(), ([count, value]) =>
        new Array(count).fill(value)
    ),
    MIN: make("MIN", argsAreNumbers(1), ([first, ...rest]) =>
        rest.reduce((a, b) => Math.min(a, b), first)
    ),
    MAX: make("MAX", argsAreNumbers(1), ([first, ...rest]) =>
        rest.reduce((a, b) => Math.max(a, b), first)
    ),
    NOT: make("NOT", argsAreNumbers(1, 1), ([a]) => (a === 0 ? 1 : 0)),
    RANDOM: makeRandom(),
    RANGE: makeRange(),
    TIME: make("TIME", argsAreNumbers(0, 0), () => Date.now()),
})
