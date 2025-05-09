import { KernelInterface } from "../types";
import { makeCls } from "./cls";
import { makeColor } from "./color";
import { makeDisk } from "./disk";
import { makeLabel } from "./label";
import { makeLocate } from "./locate";
import { makeMove } from "./move";
import { makePause } from "./pause";
import { makePrint, makePrintLn } from "./print";
import { makeRect } from "./rect";

export const makeKernelInstructions = (kernel: KernelInterface) => ({
  CLS: makeCls(kernel),
  COLOR: makeColor(kernel),
  DISK: makeDisk(kernel),
  LABEL: makeLabel(kernel),
  LOCATE: makeLocate(kernel),
  MOVE: makeMove(kernel),
  PAUSE: makePause(kernel),
  PRINT: makePrint(kernel),
  PRINTLN: makePrintLn(kernel),
  RECT: makeRect(kernel),
});
