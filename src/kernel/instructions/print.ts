import { isString } from "@tolokoban/type-guards"
import { KernelInterface } from "../types"
import { make } from "./_common"
import { argsAreAnys } from "@/basik/guards"
import { BasikValue } from "@/types"

function print(kernel: KernelInterface, args: BasikValue[]) {
    const text = args
        .map(arg => (isString(arg) ? arg : JSON.stringify(arg)))
        .join("")
    kernel.print(text)
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
