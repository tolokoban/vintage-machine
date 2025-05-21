import { BasikAssembly } from "@/basik/asm/asm";

export function parseSlicer(this: BasikAssembly) {
  if (!parseSlicerArguments.call(this)) return false;

  this.pushBytecode(this.$slice);
  return true;
}

export function parseSlicerArguments(this: BasikAssembly) {
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
  if (argsCount < 0 || argsCount > 2) {
    lexer.fatal(
      `L'opérateur slice attend zéro, un ou deux argument, pas ${argsCount}.`,
    );
  }
  this.pushBytecode(argsCount, this.$makeArray);
  return true;
}
