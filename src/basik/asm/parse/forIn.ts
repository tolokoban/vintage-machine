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
  const labelBegin = this.labelCreate("begin");
  const labelEnd = this.labelCreate("end");
  this.labelPushItsValue(labelEnd);
  this.labelStickHere(labelBegin);
  this.pushBytecode(this.$forIn);
  if (!this.parseInstruction()) {
    this.lexer.fatal(
      "Après un FOR...IN, il me faut une instruction ou un bloc d'instructions.",
    );
  }
  this.pushJump(labelBegin);
  this.labelStickHere(labelEnd);
  return true;
}
