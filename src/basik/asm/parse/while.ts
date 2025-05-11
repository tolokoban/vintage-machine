import { BasikAssembly } from "@/basik/asm/asm";

export function parseWhile(this: BasikAssembly) {
  const { lexer } = this;
  if (!lexer.get("WHILE")) return false;

  const lblBegin = this.labelCreate("Begin");
  const lblEnd = this.labelCreate("End");
  this.labelStickHere(lblBegin);
  if (!this.parseExpression()) {
    this.fatal("Après un WHILE il faut une expression.");
  }
  this.pushJumpIfZero(lblEnd);
  lexer.expect(
    "BRA_OPEN",
    [
      "Il faut une accolade ouvrante pour définir un bloc, comme dans cet exemple :",
      "WHILE $condition {",
      `  PRINTLN("Perdu")`,
      "}",
    ].join("\n"),
  );
  this.parseBloc();
  lexer.expect(
    "BRA_CLOSE",
    [
      "Il faut une accolade fermante à la fin d'un bloc, comme dans cet exemple :",
      "WHILE $condition {",
      `  PRINTLN("Perdu")`,
      "}",
    ].join("\n"),
  );
  this.pushJump(lblBegin);
  this.labelStickHere(lblEnd);
  return true;
}
