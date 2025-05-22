import { BasikAssembly } from "@/basik/asm/asm";

export function parseDef(this: BasikAssembly) {
  const { lexer } = this;
  if (!lexer.get("DEF")) return false;

  const labelBegin = this.labelCreate("BeginFunc");
  const labelEnd = this.labelCreate("EndFunc");
  const token = lexer.get("FUNC");
  if (!token) {
    lexer.fatal(`Après DEF il faut mettre un nom de fonction avec ses arguments.
Par exemple :
DEF FACTORIELLE($nombre) ...
DEF COMMENCER()`);
    return false;
  }
  const name = token.val.slice(0, -1).trim().toUpperCase();
  let argsCount = 0;
  while (true) {
    const tokenVar = lexer.get("VAR");
    if (!tokenVar) break;

    this.pushBytecode(tokenVar.val);
    argsCount++;
    if (!lexer.get("COMMA")) break;
  }
  lexer.expect(
    "PAR_CLOSE",
    `Lors de la définition de la fonction "${name}", ses arguments doivent tous êtres des variables.`,
  );
  this.pushBytecode(argsCount, this.$makeArray, name);
  this.labelPushItsValue(labelBegin);
  this.pushBytecode(this.$def);
  this.pushJump(labelEnd);
  this.labelStickHere(labelBegin);
  this.parseInstruction();
  // If no RETURN has been found, we still return 0 before exit.
  this.pushBytecode(0, this.$return);
  this.labelStickHere(labelEnd);
  return true;
}
