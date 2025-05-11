import { BasikAssembly } from "@/basik/asm/asm";

export function parseForIn(this: BasikAssembly) {
  const { lexer } = this;
  if (!lexer.get("FOR")) return false;

  const tknVar = lexer.expect(
    "VAR",
    `Il me faut un nom de variable après le mot clef FOR.`,
  );
  this.pushBytecode(tknVar.val);
  lexer.expect(
    "IN",
    "Après le nom de variable, il faut le mot clef IN.\nExemple: FOR $i IN $notes",
  );
  if (!this.parseExpression()) {
    this.fatal("Je m'attendais à une expression après un FOR ... IN.");
  }
  // Index of the current element of the list.
  this.pushBytecode(0);
  const labelBegin = this.labelCreate();
  const labelEnd = this.labelCreate();
  this.labelPushItsValue(labelEnd);
  this.labelStickHere(labelBegin);
  lexer.expect(
    "BRA_OPEN",
    [
      "Il faut une accolade ouvrante pour définir un bloc, comme dans cet exemple :",
      "FOR $i IN RANGE(9) {",
      "  PRINTLN($i)",
      "}",
    ].join("\n"),
  );
  this.pushBytecode(this.$forIn);
  this.parseBloc();
  lexer.expect(
    "BRA_CLOSE",
    [
      "Il faut une accolade fermante à la fin d'un bloc, comme dans cet exemple :",
      "FOR $i IN RANGE(9) {",
      "  PRINTLN($i)",
      "}",
    ].join("\n"),
  );
  this.pushJump(labelBegin);
  this.labelStickHere(labelEnd);
  return true;
}
