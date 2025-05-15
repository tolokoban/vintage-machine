import { BasikAssembly } from "@/basik/asm/asm";

export function parseBinaryOperator(this: BasikAssembly) {
  const { lexer } = this;
  const token = lexer.get("BINOP", "SIGN");
  if (!token) return false;

  const operator = token.val;
  if (!this.parseExpression()) {
    lexer.fatal(
      `Je m'attendais à une expression après l'opérateur "${lexer.token.val}" !`,
    );
  }
  this.pushBytecode(this.makeBinOp(operator));
  return true;
}
