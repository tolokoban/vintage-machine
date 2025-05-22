import { KernelInterface } from "../../types";
import { makeBreakpoint } from "./breakpoint";
import { makeCls } from "./cls";
import { makeColor } from "./color";
import { makeDisk } from "./disk";
import { makeDraw } from "./draw";
import { makeExit } from "./exit";
import { makeInk } from "./ink";
import { makeLabel } from "./label";
import { makeLayer } from "./layer";
import { makeLocate } from "./locate";
import { makeMode } from "./mode";
import { makeMove, makeMoveR } from "./move";
import { makePause } from "./pause";
import { makePlay } from "./play";
import { makePrint, makePrintLn } from "./print";
import { makeRect } from "./rect";
import { makeReset } from "./reset";
import { makeSound } from "./sound";
import { makeStop } from "./stop";

export const makeKernelProcedures = (kernel: KernelInterface) => ({
  BREAKPOINT: makeBreakpoint(kernel),
  CLS: makeCls(kernel),
  COLOR: makeColor(kernel),
  DISK: makeDisk(kernel),
  DRAW: makeDraw(kernel),
  EXIT: makeExit(kernel),
  INK: makeInk(kernel),
  LABEL: makeLabel(kernel),
  LAYER: makeLayer(kernel),
  LOCATE: makeLocate(kernel),
  MODE: makeMode(kernel),
  MOVE: makeMove(kernel),
  MOVER: makeMoveR(kernel),
  PAUSE: makePause(kernel),
  PLAY: makePlay(kernel),
  PRINT: makePrint(kernel),
  PRINTLN: makePrintLn(kernel),
  RECT: makeRect(kernel),
  RESET: makeReset(kernel),
  SOUND: makeSound(kernel),
  STOP: makeStop(kernel),
});
