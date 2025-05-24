import { Kernel } from "@/kernel";
import { make } from "./_common";
import {
  argsAreAnys,
  argsAreNumberAny,
  argsAreNumbers,
  argsAreStrings,
} from "@/basik/guards";
import { makeRange } from "./range";
import { makeRandom, makeRandomFloat } from "./random";
import { makeAsk, makeAskInt, makeAskNum } from "./ask";
import { makeChr } from "./chr";
import { makePadL, makePadR } from "./pad";
import { makeLen } from "./len";
import { makeInk } from "./ink";
import { tgdCalcClamp } from "@tolokoban/tgd";
import { makeMouseX, makeMouseY } from "./mouse";
import { makePlay } from "./play";
import { makeInputDir } from "./input";

const RAD_PER_DEG = Math.PI / 180;

export const makeKernelFunctions = (kernel: Kernel) => ({
  ABS: make("ABS", argsAreNumbers(1, 1), ([a]) => Math.abs(a)),
  ASC: make("ASC", argsAreStrings(1, 1), ([s]) => s.charCodeAt(0)),
  ASK: makeAsk(kernel),
  ASKINT: makeAskInt(kernel),
  ASKNUM: makeAskNum(kernel),
  CHR: makeChr(),
  CLAMP: make("CLAMP", argsAreNumbers(3, 3), ([value, min, max]) =>
    tgdCalcClamp(value, min, max),
  ),
  COLOR: make("COLOR", argsAreNumbers(0, 0), () => kernel.colorIndex),
  COS: make("COS", argsAreNumbers(1, 1), ([deg]) =>
    Math.cos(deg * RAD_PER_DEG),
  ),
  FLOOR: make("FLOOR", argsAreNumbers(1, 1), ([value]) => {
    return Math.floor(Number(value));
  }),
  FRACT: make("FRACT", argsAreNumbers(1, 1), ([value]) => {
    return Math.abs(value - Math.floor(Number(value)));
  }),
  HEX: make("HEX", argsAreNumbers(1, 1), ([a]) => a.toString(16).toUpperCase()),
  HOUR: make("HOUR", argsAreAnys(0, 0), () => new Date().getHours()),
  INK: makeInk(kernel),
  INPUTDIR: makeInputDir(kernel),
  INT: make("INT", argsAreAnys(1, 1), ([value]) => {
    if (Array.isArray(value)) return value.length;
    return Math.round(Number(value));
  }),
  LAYER: make("LAYER", argsAreNumbers(0, 0), () => kernel.currentLayerIndex),
  LEN: makeLen(),
  LIST: make("LIST", argsAreNumberAny(), ([count, value]) =>
    new Array(count).fill(value),
  ),
  LOWERCASE: make("LOWERCASE", argsAreStrings(1), (parts) =>
    parts.join("").toLowerCase(),
  ),
  MIN: make("MIN", argsAreNumbers(1), ([first, ...rest]) =>
    rest.reduce((a, b) => Math.min(a, b), first),
  ),
  MINUTE: make("MINUTE", argsAreAnys(0, 0), () => new Date().getMinutes()),
  MAX: make("MAX", argsAreNumbers(1), ([first, ...rest]) =>
    rest.reduce((a, b) => Math.max(a, b), first),
  ),
  MODE: make("MODE", argsAreNumbers(0, 0), () => kernel.layer.mode),
  MOUSEX: makeMouseX(kernel),
  MOUSEY: makeMouseY(kernel),
  NOT: make("NOT", argsAreNumbers(1, 1), ([a]) => (a === 0 ? 1 : 0)),
  PADL: makePadL(),
  PADR: makePadR(),
  PLAY: makePlay(kernel),
  RANDOM: makeRandom(),
  RANDOMF: makeRandomFloat(),
  RANGE: makeRange(),
  SECOND: make("SECOND", argsAreAnys(0, 0), () => new Date().getSeconds()),
  SIN: make("SIN", argsAreNumbers(1, 1), ([deg]) =>
    Math.sin(deg * RAD_PER_DEG),
  ),
  TIME: make("TIME", argsAreNumbers(0, 0), () => Date.now()),
  UPPERCASE: make("UPPERCASE", argsAreStrings(1), (parts) =>
    parts.join("").toUpperCase(),
  ),
});
