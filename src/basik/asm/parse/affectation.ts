import { BasikAssembly } from "@/basik/asm/asm";

export function parseAffectation(this: BasikAssembly) {
  const token = this.lexer.get("VAR");
  if (!token) return false;

  const varName = token.val;
  this.pushBytecode(varName);
  this.lexer.expect(
    "EQUAL",
    `Je m'attendais à voir le signe "=" pour l'affectation de la variable ${varName} !`,
  );
  this.parseExpression();
  this.pushBytecode(this.$setVar);
  return true;
}
