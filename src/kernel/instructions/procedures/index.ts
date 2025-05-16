import { KernelInterface } from "../../types";
import { makeCls } from "./cls";
import { makeColor } from "./color";
import { makeDisk } from "./disk";
import { makeDraw } from "./draw";
import { makeInk } from "./ink";
import { makeLabel } from "./label";
import { makeLayer } from "./layer";
import { makeLocate } from "./locate";
import { makeMode } from "./mode";
import { makeMove, makeMoveR } from "./move";
import { makePause } from "./pause";
import { makePrint, makePrintLn } from "./print";
import { makeRect } from "./rect";
import { makeReset } from "./reset";

export const makeKernelInstructions = (kernel: KernelInterface) => ({
  CLS: makeCls(kernel),
  COLOR: makeColor(kernel),
  DISK: makeDisk(kernel),
  DRAW: makeDraw(kernel),
  INK: makeInk(kernel),
  LABEL: makeLabel(kernel),
  LAYER: makeLayer(kernel),
  LOCATE: makeLocate(kernel),
  MODE: makeMode(kernel),
  MOVE: makeMove(kernel),
  MOVER: makeMoveR(kernel),
  PAUSE: makePause(kernel),
  PRINT: makePrint(kernel),
  PRINTLN: makePrintLn(kernel),
  RECT: makeRect(kernel),
  RESET: makeReset(kernel),
});
