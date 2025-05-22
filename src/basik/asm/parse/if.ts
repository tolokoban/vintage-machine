import { BasikAssembly } from "@/basik/asm/asm";

export function parseIf(this: BasikAssembly) {
  const { lexer } = this;
  if (!lexer.get("IF")) return false;

  if (!this.parseExpression()) {
    this.fatal("Après un IF il faut une expression.");
  }
  const lblElse = this.labelCreate("Else");
  const lblEndIf = this.labelCreate("EndIf");
  this.labelPushItsValue(lblElse);
  lexer.expect(
    "BRA_OPEN",
    [
      "Il faut une accolade ouvrante pour définir un bloc, comme dans cet exemple :",
      "IF $condition {",
      `  PRINTLN("Perdu")`,
      "}",
    ].join("\n"),
  );
  this.pushBytecode(this.$if);
  this.parseInstruction();
  lexer.expect(
    "BRA_CLOSE",
    [
      "Il faut une accolade fermante à la fin d'un bloc, comme dans cet exemple :",
      "IF $condition {",
      `  PRINTLN("Perdu")`,
      "}",
    ].join("\n"),
  );
  this.pushJump(lblEndIf);
  this.labelStickHere(lblElse);
  if (lexer.get("ELSE")) {
    lexer.expect(
      "BRA_OPEN",
      [
        "Il faut une accolade ouvrante pour définir un bloc, comme dans cet exemple :",
        "ELSE {",
        `  PRINTLN("Perdu")`,
        "}",
      ].join("\n"),
    );
    this.parseInstruction();
    lexer.expect(
      "BRA_CLOSE",
      [
        "Il faut une accolade fermante à la fin d'un bloc, comme dans cet exemple :",
        "ELSE {",
        `  PRINTLN("Perdu")`,
        "}",
      ].join("\n"),
    );
  }
  this.labelStickHere(lblEndIf);
  return true;
}
