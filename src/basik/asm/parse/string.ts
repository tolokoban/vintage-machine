import { BasikAssembly } from "@/basik/asm/asm";

export function parseString(this: BasikAssembly) {
  const token = this.lexer.get("STR");
  if (!token) return false;

  this.pushBytecode(token.val.slice(1, -1));
  return true;
}
