import { BasikValue } from "@/types";

export function argsAreNumbers(min = 1, max = 999) {
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

export function argsAreStrings(min = 1, max = 999) {
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
      if (typeof arg !== "string") {
        throw new Error(
          "Tous les arguments de cette fonction doivent être des nombres.",
        );
      }
    }
  };
}

export function argsAreAnys(min = 0, max = 999) {
  return (args: BasikValue[]): asserts args is BasikValue[] => {
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
  };
}

export function argsAreNumberAny() {
  return (args: BasikValue[]): asserts args is [number, BasikValue] => {
    const [count] = args;
    if (args.length !== 2 || typeof count !== "number") {
      throw new Error(
        "Cette fonction attends deux arguments: le nombre d'éléments et la valeur initiale de ces éléments.",
      );
    }
  };
}
