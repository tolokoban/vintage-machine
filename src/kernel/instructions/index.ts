import { KernelInterface } from "../types"
import { makeCls } from "./cls"
import { makeColor } from "./color"
import { makeDisk } from "./disk"
import { makeLocate } from "./locate"
import { makeMove } from "./move"
import { makePause } from "./pause"
import { makePrint, makePrintLn } from "./print"

export const makeKernelInstructions = (kernel: KernelInterface) => ({
    CLS: makeCls(kernel),
    COLOR: makeColor(kernel),
    DISK: makeDisk(kernel),
    LOCATE: makeLocate(kernel),
    MOVE: makeMove(kernel),
    PAUSE: makePause(kernel),
    PRINT: makePrint(kernel),
    PRINTLN: makePrintLn(kernel),
})
