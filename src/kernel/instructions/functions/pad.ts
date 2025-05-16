import { BasikValue } from "@/types";
import { make } from "./_common";
import { isNumber, isString } from "@tolokoban/type-guards";

export const makePadL = () =>
  make("PADL", argsAreforPad("PADL"), (args) => {
    const [text, size, fill = " "] = args;
    return convertIntoString(text).slice(0, size).padEnd(size, fill.charAt(0));
  });

export const makePadR = () =>
  make("PADR", argsAreforPad("PADR"), (args) => {
    const [text, size, fill = " "] = args;
    return convertIntoString(text)
      .slice(0, size)
      .padStart(size, fill.charAt(0));
  });

function argsAreforPad(name: string) {
  return (args: BasikValue[]): asserts args is [BasikValue, number, string] => {
    if (args.length < 2 || args.length > 3) {
      throw new Error(
        `Cette fonction attends deux ou trois arguments : ${name}($texte, $taille) ou ${name}($texte, $taille, $remplissage).`,
      );
    }
    const [, size, fill] = args;
    if (!isNumber(size)) {
      throw new Error(
        `La taille doit être un nombre :  ${name}($texte, $taille).`,
      );
    }
    if (fill !== undefined && !isString(fill)) {
      throw new Error(
        `Le remplissage doit être une chaîne :  ${name}($texte, $taille, remplissage).`,
      );
    }
  };
}

function convertIntoString(text: unknown) {
  if (isString(text)) return text;
  return JSON.stringify(text);
}
