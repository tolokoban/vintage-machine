import { BasikAssembly } from "@/basik/asm/asm";

export function parseHexa(this: BasikAssembly) {
  const token = this.lexer.get("HEX");
  if (!token) return false;

  this.pushBytecode(Number(`0x${token.val.trim().slice(1)}`));
  return true;
}
