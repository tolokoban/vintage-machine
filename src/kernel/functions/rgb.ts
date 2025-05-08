import { tgdCalcModulo } from "@tolokoban/tgd"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeRgb = () =>
    make("RGB", argsAreNumbers(3, 3), args => {
        const [r, g, b] = args
        const R = tgdCalcModulo(Math.round(r), 0, 15)
        const G = tgdCalcModulo(Math.round(g), 0, 15)
        const B = tgdCalcModulo(Math.round(b), 0, 15)
        return R * 0x100 + G * 0x10 + B
    })
