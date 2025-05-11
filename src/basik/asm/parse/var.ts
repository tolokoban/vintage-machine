import { BasikAssembly } from "@/basik/asm/asm";

export function parseVar(this: BasikAssembly) {
  const token = this.lexer.get("VAR");
  if (!token) return false;

  this.pushBytecode(token.val, this.$getVar);
  return true;
}
