import { KernelInterface } from "../types"
import { makeColor } from "./color"
import { makeLocate } from "./locate"
import { makeMove } from "./move"
import { makePrint, makePrintLn } from "./print"

export const makeKernelInstructions = (kernel: KernelInterface) => ({
    COLOR: makeColor(kernel),
    LOCATE: makeLocate(kernel),
    MOVE: makeMove(kernel),
    PRINT: makePrint(kernel),
    PRINTLN: makePrintLn(kernel),
})
