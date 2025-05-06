import { BasikValue } from "@/types"
import { isNumber } from "@tolokoban/type-guards"
import { argsAreNumberAny, argsAreNumbers } from "./guards"

export const FUNCTIONS: Record<string, (args: BasikValue[]) => BasikValue> = {}

function make<T extends BasikValue[]>(
    name: string,
    guard: (args: BasikValue[]) => asserts args is T,
    func: (args: T) => BasikValue
) {
    name = name.toUpperCase()
    FUNCTIONS[name] = (args: BasikValue[]) => {
        try {
            guard?.(args)
            return func(args)
        } catch (ex) {
            throw new Error(`Erreur de la fonction "${name}": ${ex}`)
        }
    }
}

make("MIN", argsAreNumbers(1), ([first, ...rest]) =>
    rest.reduce((a, b) => Math.min(a, b), first)
)
make("MAX", argsAreNumbers(1), ([first, ...rest]) =>
    rest.reduce((a, b) => Math.max(a, b), first)
)
make("TIME", argsAreNumbers(0, 0), () => Date.now())
make("ABS", argsAreNumbers(1, 1), ([a]) => Math.abs(a))
make("NOT", argsAreNumbers(1, 1), ([a]) => (a === 0 ? 1 : 0))
make("LIST", argsAreNumberAny(), ([count, value]) =>
    new Array(count).fill(value)
)
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
