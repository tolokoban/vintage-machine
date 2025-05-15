import { BasikAssembly } from "@/basik/asm/asm";

export function parseExpression(this: BasikAssembly) {
  const tokenSign = this.lexer.get("SIGN");
  if (
    this.parseAny(
      this.parseNumber,
      this.parseVar,
      this.parseHexa,
      this.parseString,
      this.parseExpressionBlock,
      this.parseFunction,
      this.parseList,
    )
  ) {
    const sign = tokenSign?.val ?? "+";
    if (sign === "-") {
      this.pushFunction(this.$neg, tokenSign);
    }
    while (this.parseSlicer()) {}
    while (this.parseBinaryOperator()) {}
    return true;
  }
  return false;
}
