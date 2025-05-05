import { BasikValue } from "@/types";
import { isNumber } from "@tolokoban/type-guards";

export const FUNCTIONS: Record<string, (args: BasikValue[]) => BasikValue> = {};

function f<T extends BasikValue[]>(
  name: string,
  guard: (args: BasikValue[]) => asserts args is T,
  func: (args: T) => BasikValue,
) {
  name = name.toUpperCase();
  FUNCTIONS[name] = (args: BasikValue[]) => {
    try {
      guard?.(args);
      return func(args);
    } catch (ex) {
      throw new Error(`Erreur de la fonction "${name}": ${ex}`);
    }
  };
}

f("MIN", isNumbers(1), ([first, ...rest]) =>
  rest.reduce((a, b) => Math.min(a, b), first),
);
f("MAX", isNumbers(1), ([first, ...rest]) =>
  rest.reduce((a, b) => Math.max(a, b), first),
);
f("TIME", isNumbers(0, 0), () => Date.now());
f("ABS", isNumbers(1, 1), ([a]) => Math.abs(a));
f("NOT", isNumbers(1, 1), ([a]) => (a === 0 ? 1 : 0));
f("LIST", isNumberAny, ([count, value]) => new Array(count).fill(value));
f("RANGE", isNumbers(1, 3), (args) => {
  let [start, count, step] = args;
  if (!isNumber(count)) {
    count = start;
    start = 0;
  }
  if (!isNumber(step)) step = 1;
  const array: Number[] = [];
  for (let value = start; count > 0; count--) {
    array.push(value);
    value += step;
  }
  return array as BasikValue;
});

function isNumbers(min = 1, max = 999) {
  return (args: BasikValue[]): asserts args is number[] => {
    if (args.length < min || args.length > max) {
      if (min === max) {
        if (min === 0)
          throw new Error("Cette function n'attend aucun argument.");
        if (min === 1)
          throw new Error("Cette function attend un et un seul argument.");
        throw new Error(
          `Cette function attend entre ${min} et ${max} arguments.`,
        );
      }
    }
    for (const arg of args) {
      if (typeof arg !== "number") {
        throw new Error(
          "Tous les arguments de cette fonction doivent être des nombres.",
        );
      }
    }
  };
}

function isNumberAny(args: BasikValue[]): asserts args is [number, BasikValue] {
  const [count] = args;
  if (args.length !== 2 || typeof count !== "number") {
    throw new Error(
      "Cette fonction attends deux arguments: le nombre d'éléments et la valeur initiale de ces éléments.",
    );
  }
}
