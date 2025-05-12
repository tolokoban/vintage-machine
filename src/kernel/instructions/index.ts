import { KernelInterface } from "../types"
import { makeCls } from "./cls"
import { makeColor } from "./color"
import { makeDisk } from "./disk"
import { makeInk } from "./ink"
import { makeLabel } from "./label"
import { makeLocate } from "./locate"
import { makeMove, makeMoveR } from "./move"
import { makePause } from "./pause"
import { makePrint, makePrintLn } from "./print"
import { makeRect } from "./rect"

export const makeKernelInstructions = (kernel: KernelInterface) => ({
    CLS: makeCls(kernel),
    COLOR: makeColor(kernel),
    DISK: makeDisk(kernel),
    INK: makeInk(kernel),
    LABEL: makeLabel(kernel),
    LOCATE: makeLocate(kernel),
    MOVE: makeMove(kernel),
    MOVER: makeMoveR(kernel),
    PAUSE: makePause(kernel),
    PRINT: makePrint(kernel),
    PRINTLN: makePrintLn(kernel),
    RECT: makeRect(kernel),
})
