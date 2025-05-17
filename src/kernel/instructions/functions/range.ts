import { isNumber } from "@tolokoban/type-guards";
import { make } from "./_common";
import { argsAreNumbers } from "@/basik/guards";
import { BasikValue } from "@/types";

export const makeRange = () =>
  make("RANGE", argsAreNumbers(1, 3), (args) => {
    let [start, end, stride] = args;
    if (!isNumber(end)) {
      end = start - 1;
      start = 0;
    }
    if (!isNumber(stride)) stride = 1;
    else stride = Math.abs(stride);
    const steps = Math.floor(Math.abs(end - start) / stride) + 1;
    if (steps === 1) {
      return [start];
    }
    const vector = start < end ? stride : -stride;
    const array: Number[] = [];
    for (let i = 0; i < steps; i++) {
      array.push(start + vector * i);
    }
    return array as BasikValue;
  });
