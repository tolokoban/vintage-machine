import { BasikAssembly } from "@/basik/asm/asm";

export function parseReturn(this: BasikAssembly) {
  const token = this.lexer.get("RETURN");
  if (!token) return false;

  if (!this.parseExpression()) {
    this.lexer.fatal("Il faut une expression après un RETURN.", token);
  }
  this.pushBytecode(this.$return);
  return true;
}
