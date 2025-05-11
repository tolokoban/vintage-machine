import { BasikAssembly } from "@/basik/asm/asm";

export function parseNumber(this: BasikAssembly) {
  const token = this.lexer.get("NUM");
  if (!token) return false;

  this.pushBytecode(Number(token.val));
  return true;
}
