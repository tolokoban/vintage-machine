import { BasikAssembly } from "@/basik/asm/asm";

export function parseInstruction(this: BasikAssembly) {
  const token = this.lexer.get("BRA_OPEN");
  if (token) {
    while (this.parseInstruction()) {}
    this.lexer.expect("BRA_CLOSE", "Il manque une accolade fermante.");
  }
  const parsers: Array<() => boolean> = [
    this.parseProcedure,
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
  return true;
}
