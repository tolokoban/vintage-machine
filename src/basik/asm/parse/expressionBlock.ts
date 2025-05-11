import { BasikAssembly } from "@/basik/asm/asm";

export function parseExpressionBlock(this: BasikAssembly) {
  const { lexer } = this;
  if (!lexer.get("PAR_OPEN")) return false;

  if (!this.parseExpression()) {
    lexer.fatal("Il manque une expression après la parenthèse ouvrante.");
  }

  lexer.expect("PAR_CLOSE", "Il manque une parenthèse fermante ici.");
  return true;
}
