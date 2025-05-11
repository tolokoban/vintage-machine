import { BasikAssembly } from "@/basik/asm/asm";

export function parseList(this: BasikAssembly) {
  const { lexer } = this;
  if (!lexer.get("SQR_OPEN")) return false;

  let argsCount = 0;
  while (this.parseExpression()) {
    argsCount++;
    if (!lexer.get("COMMA")) break;
  }
  lexer.expect(
    "SQR_CLOSE",
    `Il manque un crochet fermant à la fin de la liste.`,
  );
  this.pushBytecode(argsCount, this.$makeArray);
  return true;
}
