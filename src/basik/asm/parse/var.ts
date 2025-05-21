import { BasikAssembly } from "@/basik/asm/asm";

export function parseVar(this: BasikAssembly) {
  const token = this.lexer.get("VAR") ?? this.lexer.get("GLOBAL_VAR");
  if (!token) return false;

  this.pushBytecode(token.val);
  this.pushFunction(this.$getVar, token);
  return true;
}
