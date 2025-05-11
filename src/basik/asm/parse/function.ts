import { BasikAssembly } from "@/basik/asm/asm";

export function parseFunction(this: BasikAssembly) {
  const { lexer } = this;
  const tknFunction = lexer.get("FUNC");
  if (!tknFunction) return false;

  const name = tknFunction.val.slice(0, -1).trim().toUpperCase();
  let argsCount = 0;
  while (this.parseExpression()) {
    argsCount++;
    if (!lexer.get("COMMA")) break;
  }
  lexer.expect(
    "PAR_CLOSE",
    `Il manque une parenthèse fermante après les arguments de la fonction "${name}".`,
  );
  this.pushBytecode(argsCount, this.$makeArray, name, this.$function);
  return true;
}
