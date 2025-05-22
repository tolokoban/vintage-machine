import { BasikValue } from "@/types";
import { isNumber, isString } from "@tolokoban/type-guards";

export const BINOPS: Record<
  string,
  (a: BasikValue, b: BasikValue) => BasikValue
> = {
  "==": (a: BasikValue, b: BasikValue): BasikValue => {
    return JSON.stringify(a) === JSON.stringify(b) ? 1 : 0;
  },
  "<>": (a: BasikValue, b: BasikValue): BasikValue => {
    return JSON.stringify(a) !== JSON.stringify(b) ? 1 : 0;
  },
  ">": (a: BasikValue, b: BasikValue): BasikValue => {
    if (isNumber(a) && isNumber(b)) {
      return a > b ? 1 : 0;
    }
    return JSON.stringify(a) > JSON.stringify(b) ? 1 : 0;
  },
  "<": (a: BasikValue, b: BasikValue): BasikValue => {
    if (isNumber(a) && isNumber(b)) {
      return a < b ? 1 : 0;
    }
    return JSON.stringify(a) < JSON.stringify(b) ? 1 : 0;
  },
  ">=": (a: BasikValue, b: BasikValue): BasikValue => {
    if (isNumber(a) && isNumber(b)) {
      return a >= b ? 1 : 0;
    }
    return JSON.stringify(a) >= JSON.stringify(b) ? 1 : 0;
  },
  "<=": (a: BasikValue, b: BasikValue): BasikValue => {
    if (isNumber(a) && isNumber(b)) {
      return a <= b ? 1 : 0;
    }
    return JSON.stringify(a) <= JSON.stringify(b) ? 1 : 0;
  },
  "+": (a: BasikValue, b: BasikValue): BasikValue => {
    if (isNumber(a) && isNumber(b)) return a + b;
    if (Array.isArray(a)) {
      if (Array.isArray(b)) return [...a, ...b];
      return [...a, b];
    }
    if (Array.isArray(b)) {
      if (Array.isArray(a)) return [...a, ...b];
      return [a, ...b];
    }
    return `${a}${b}`;
  },
  "-": numOpe("-", (a, b) => a - b),
  "/": numOpe("/", (a, b) => a / b),
  "^": numOpe("^", (a, b) => Math.pow(a, b)),
  "%": numOpe("^", (a, b) => a % b),
  AND: numOpe("AND", (a, b) => a & b),
  OR: numOpe("OR", (a, b) => a | b),
  XOR: numOpe("XOR", (a, b) => a ^ b),
  "*": (a: BasikValue, b: BasikValue): BasikValue => {
    if (isNumber(a) && isNumber(b)) return a * b;
    if (Array.isArray(a) || Array.isArray(b)) {
      throw new Error("Il est impossible de multiplier des listes !");
    }
    if (isString(a) && isString(b)) {
      throw new Error(
        "Il est impossible de multiplier deux chaînes de caractères !",
      );
    }
    let str = (isString(a) ? a : b) as string;
    let num = (isString(b) ? a : b) as number;
    if (num === 0) return "";
    if (num < 0) {
      num = -num;
      str = str.split("").reverse().join("");
    }
    const int = Math.floor(num);
    const dec = num - int;
    return `${str.repeat(int)}${str.slice(0, Math.round(dec * str.length))}`;
  },
};

function numOpe(name: string, ope: (a: number, b: number) => BasikValue) {
  return (a: BasikValue, b: BasikValue): BasikValue => {
    if (!isNumber(a) || !isNumber(b))
      throw new Error(
        [
          `L'opérateur "${name}" ne fonctionne qu'avec des nombres.`,
          `Mais je l'ai trouvé entre ${JSON.stringify(a)} et ${JSON.stringify(b)}.`,
        ].join("\n"),
      );

    return ope(a, b);
  };
}
