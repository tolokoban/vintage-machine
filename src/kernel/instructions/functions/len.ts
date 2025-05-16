import { isNumber } from "@tolokoban/type-guards";
import { make } from "./_common";
import { argsAreAnys } from "@/basik/guards";

export const makeLen = () =>
  make("LEN", argsAreAnys(1, 1), (args) => {
    let [value] = args;
    if (isNumber(value)) return 0;
    return value.length;
  });
