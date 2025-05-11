import { BasikAssembly } from "@/basik/asm/asm";

export function parseBloc(this: BasikAssembly) {
  const parsers: Array<() => boolean> = [
    this.parseInstruction,
    this.parseAffectation,
    this.parseIf,
    this.parseForIn,
    this.parseWhile,
    this.parseReturn,
    this.parseDef,
  ];
  if (!this.parseAny(...parsers)) {
    return false;
  }
  while (this.parseAny(...parsers)) {}
  return true;
}
