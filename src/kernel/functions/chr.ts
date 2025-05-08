import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeChr = () =>
    make("CHR", argsAreNumbers(1), args => {
        return args.map(v => String.fromCharCode(v)).join("")
    })
