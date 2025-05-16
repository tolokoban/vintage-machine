import { BasikAssembly } from "@/basik/asm/asm";

export function parseProcedure(this: BasikAssembly) {
  const { lexer } = this;
  const tknProcedure = lexer.get("FUNC");
  if (!tknProcedure) return false;

  const name = tknProcedure.val.slice(0, -1).trim().toUpperCase();
  let argsCount = 0;
  while (this.parseExpression()) {
    argsCount++;
    if (!lexer.get("COMMA")) break;
  }
  lexer.expect(
    "PAR_CLOSE",
    `Il manque une parenthèse fermante après les arguments de la procédure "${name}".`,
  );
  this.pushBytecode(argsCount, this.$makeArray, name);
  this.pushFunction(this.$instruction, tknProcedure);
  return true;
}
