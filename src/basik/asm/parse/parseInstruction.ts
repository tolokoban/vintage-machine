import { BasikAssembly } from "@/basik/asm/asm";

export function parseInstruction(this: BasikAssembly) {
  const { lexer } = this;
  const tknInstruction = lexer.get("FUNC");
  if (!tknInstruction) return false;

  const name = tknInstruction.val.slice(0, -1).trim().toUpperCase();
  let argsCount = 0;
  while (this.parseExpression()) {
    argsCount++;
    if (!lexer.get("COMMA")) break;
  }
  lexer.expect(
    "PAR_CLOSE",
    `Il manque une parenthèse fermante après les arguments de l'instruction "${name}".`,
  );
  this.pushBytecode(argsCount, this.$makeArray, name, this.$instruction);
  return true;
}
