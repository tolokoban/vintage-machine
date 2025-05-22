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
  this.parseInstruction();
  this.pushJump(lblBegin);
  this.labelStickHere(lblEnd);
  return true;
}
