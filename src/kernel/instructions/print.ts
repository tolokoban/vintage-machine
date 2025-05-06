import { isString } from "@tolokoban/type-guards"
import { KernelInterface } from "../types"
import { make } from "./_common"
import { argsAreAnys } from "@/basik/guards"
import { BasikValue } from "@/types"

function print(kernel: KernelInterface, args: BasikValue[]) {
    kernel.paintFB(() => {
        const text = args
            .map(arg => (isString(arg) ? arg : JSON.stringify(arg)))
            .join("")
        const chars = text.split("")
        for (const char of chars) {
            const sym = char.charCodeAt(0)
            const val = sym & 0xff
            const row = val & 0xf
            const col = (val - row) >> 4
            if (kernel.x >= kernel.WIDTH / 2) {
                kernel.x = kernel.TEXT_ORIGIN_X
                kernel.y += kernel.CHAR_SIZE
            }
            kernel.painterSymbols.paint({
                screenX: kernel.x,
                screenY: kernel.y,
                symbolX: col * kernel.CHAR_SIZE,
                symbolY: row * kernel.CHAR_SIZE,
                color: kernel.colorIndex,
            })
            kernel.x += kernel.CHAR_SIZE
        }
    })
}

export const makePrint = (kernel: KernelInterface) =>
    make("print", argsAreAnys(), (args: BasikValue[]) => {
        print(kernel, args)
    })

export const makePrintLn = (kernel: KernelInterface) =>
    make("println", argsAreAnys(), (args: BasikValue[]) => {
        print(kernel, args)
        kernel.x = kernel.TEXT_ORIGIN_X
        kernel.y += kernel.CHAR_SIZE
    })
