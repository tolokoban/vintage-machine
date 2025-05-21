import { BasikAssembly } from "@/basik/asm/asm";

export function parseAffectation(this: BasikAssembly) {
  const tokenVar = this.lexer.get("VAR");
  if (tokenVar) {
    const varName = tokenVar.val;
    this.pushBytecode(varName);
    const hasSlicer = this.parseSlicerArguments();
    this.lexer.expect(
      "EQUAL",
      `Je m'attendais à voir le signe "=" pour l'affectation de la variable ${varName} !`,
    );
    this.parseExpression();
    this.pushBytecode(hasSlicer ? this.$setElem : this.$setVar);
    return true;
  }

  const tokenDestruct = this.lexer.get("DESTRUCT");
  if (!tokenDestruct) return false;

  const varNames = tokenDestruct.val
    .trim()
    .slice(2, -1)
    .split(",")
    .map((item) => `$${item.trim().toLowerCase()}`);
  this.pushBytecode(varNames);
  this.lexer.expect(
    "EQUAL",
    `Je m'attendais à voir le signe "=" pour l'affectation des variables ${varNames.join(", ")}.`,
  );
  this.parseExpression();
  this.pushBytecode(this.$setVars);
  return true;
}
