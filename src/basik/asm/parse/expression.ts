import { BasikAssembly } from "@/basik/asm/asm";

export function parseExpression(this: BasikAssembly) {
  if (
    this.parseAny(
      this.parseNumber,
      this.parseVar,
      this.parseHexa,
      this.parseString,
      this.parseExpressionBlock,
      this.parseFunction,
    )
  ) {
    while (this.parseBinaryOperator()) {}
    return true;
  }
  return false;
}
