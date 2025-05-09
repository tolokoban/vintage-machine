import { Kernel } from "@/kernel";
import { BasikLexer } from "./lexer";
import { isFunction, isNumber, isString } from "@tolokoban/type-guards";
import { isBasikError, BasikValue, BasikError } from "@/types";
import { consoleError } from "./error";
import { BINOPS } from "./binops";
import { Labels } from "./labels";
import { workbench } from "@/workbench";

export type ByteCode = {
  pos: number;
  val: BasikValue | (() => Promise<void>);
};

/**
 *
 * Rules for `parse*()` methods:
 *
 * - If it returns `false`, the lexer should stay where it was.
 * - Otherwise, the lexer should swallow everything the method needs.
 */
export class BasikAssembly {
  private readonly labels = new Labels();
  private readonly bytecode: ByteCode[] = [];
  private readonly stack: BasikValue[] = [];
  private lexer: BasikLexer = new BasikLexer("");
  private cursor = 0;
  private code: string = "";

  constructor(private readonly kernel: Kernel) {}

  async execute(code: string) {
    try {
      this.code = code;
      console.log(code);
      this.compile();
      this.link();
    } catch (ex) {
      console.error(ex);
      console.log("Byte code:", this.bytecode);
      const err: BasikError = isBasikError(ex)
        ? ex
        : {
            code: this.code,
            pos: this.bytecode[this.cursor].pos,
            msg: `${ex}`,
          };
      consoleError("Erreur de compilation !", err);
    }
    try {
      this.stack.splice(0, this.stack.length);
      const { bytecode, stack } = this;
      this.cursor = 0;
      while (this.cursor < bytecode.length && workbench.state.running.value) {
        const action = bytecode[this.cursor++].val;
        if (typeof action === "function") {
          await action();
        } else {
          stack.push(action);
        }
      }
      this.kernel.debugVariables();
    } catch (ex) {
      console.error(ex);
      console.log("Cursor:", this.cursor);
      console.log("Byte code:", this.bytecode);
      console.log("Stack:", this.stack);
      const err: BasikError = isBasikError(ex)
        ? ex
        : {
            code: this.code,
            pos: this.bytecode[this.cursor].pos,
            msg: `${ex}`,
          };
      consoleError("Erreur d'execution !", err);
    } finally {
      this.kernel.paint();
    }
  }

  private compile() {
    this.labels.reset();
    this.bytecode.splice(0, this.bytecode.length);
    const lexer = new BasikLexer(this.code);
    console.log("Tokens:", lexer.all());
    lexer.next();
    this.lexer = lexer;
    while (lexer.hasMoreCode()) {
      if (this.parseBloc()) continue;

      lexer.fatal("Caractère inattendu ! Je suis perdu...");
    }
    this.pushBytecode("<<EOF>>");
    console.log("Compiled!", this.bytecode);
  }

  private link() {
    this.labels.apply(this.bytecode);
    this.debugBytecode();
  }

  private fatal(msg: string) {
    const bytecode = this.bytecode[this.cursor];
    if (bytecode) {
      console.error(msg, bytecode);
    }
    throw new Error(msg);
  }

  private pushBytecode(...bytecodes: ByteCode["val"][]) {
    for (const bytecode of bytecodes) {
      this.bytecode.push({
        pos: this.lexer.token.pos,
        val: bytecode,
      });
    }
  }

  private pushJump(label: string) {
    this.labelLink(label);
    this.pushBytecode(this.$jump);
  }

  private pushJumpIfZero(label: string) {
    this.labelLink(label);
    this.pushBytecode(this.$jumpIfZero);
  }

  private labelLink(label: string) {
    this.pushBytecode(0);
    this.labels.link(this.bytecode.length - 1, label);
  }

  private labelStick(label: string) {
    return this.labels.stick(label, this.bytecode.length);
  }

  private labelCreate(name: string = "") {
    return this.labels.create(name);
  }

  private readonly parseBloc = () => {
    const parsers: Array<() => boolean> = [
      this.parseInstruction,
      this.parseAffectation,
      this.parseIf,
      this.parseForIn,
      this.parseWhile,
    ];
    if (!this.parseAny(...parsers)) {
      return false;
    }
    while (this.parseAny(...parsers)) {}
    return true;
  };

  private readonly parseIf = () => {
    const { lexer } = this;
    if (!lexer.get("IF")) return false;

    if (!this.parseExpression()) {
      this.fatal("Après un IF il faut une expression.");
    }
    const lblElse = this.labelCreate("Else");
    const lblEndIf = this.labelCreate("EndIf");
    this.labelLink(lblElse);
    lexer.expect(
      "BRA_OPEN",
      [
        "Il faut une accolade ouvrante pour définir un bloc, comme dans cet exemple :",
        "IF $condition {",
        `  PRINTLN("Perdu")`,
        "}",
      ].join("\n"),
    );
    this.pushBytecode(this.$if);
    this.parseBloc();
    lexer.expect(
      "BRA_CLOSE",
      [
        "Il faut une accolade fermante à la fin d'un bloc, comme dans cet exemple :",
        "IF $condition {",
        `  PRINTLN("Perdu")`,
        "}",
      ].join("\n"),
    );
    this.pushJump(lblEndIf);
    this.labelStick(lblElse);
    if (lexer.get("ELSE")) {
      lexer.expect(
        "BRA_OPEN",
        [
          "Il faut une accolade ouvrante pour définir un bloc, comme dans cet exemple :",
          "ELSE {",
          `  PRINTLN("Perdu")`,
          "}",
        ].join("\n"),
      );
      this.parseBloc();
      lexer.expect(
        "BRA_CLOSE",
        [
          "Il faut une accolade fermante à la fin d'un bloc, comme dans cet exemple :",
          "ELSE {",
          `  PRINTLN("Perdu")`,
          "}",
        ].join("\n"),
      );
    }
    this.labelStick(lblEndIf);
    return true;
  };

  private readonly parseWhile = () => {
    const { lexer } = this;
    if (!lexer.get("WHILE")) return false;

    const lblBegin = this.labelCreate("Begin");
    const lblEnd = this.labelCreate("End");
    this.labelStick(lblBegin);
    if (!this.parseExpression()) {
      this.fatal("Après un WHILE il faut une expression.");
    }
    this.pushJumpIfZero(lblEnd);
    lexer.expect(
      "BRA_OPEN",
      [
        "Il faut une accolade ouvrante pour définir un bloc, comme dans cet exemple :",
        "WHILE $condition {",
        `  PRINTLN("Perdu")`,
        "}",
      ].join("\n"),
    );
    this.parseBloc();
    lexer.expect(
      "BRA_CLOSE",
      [
        "Il faut une accolade fermante à la fin d'un bloc, comme dans cet exemple :",
        "WHILE $condition {",
        `  PRINTLN("Perdu")`,
        "}",
      ].join("\n"),
    );
    this.pushJump(lblBegin);
    this.labelStick(lblEnd);
    return true;
  };

  private readonly parseForIn = () => {
    const { lexer } = this;
    if (!lexer.get("FOR")) return false;

    const tknVar = lexer.expect(
      "VAR",
      `Il me faut un nom de variable après le mot clef FOR.`,
    );
    this.pushBytecode(tknVar.val);
    lexer.expect(
      "IN",
      "Après le nom de variable, il faut le mot clef IN.\nExemple: FOR $i IN $notes",
    );
    if (!this.parseExpression()) {
      this.fatal("Je m'attendais à une expression après un FOR ... IN.");
    }
    // Index of the current element of the list.
    this.pushBytecode(0);
    const labelBegin = this.labelCreate();
    const labelEnd = this.labelCreate();
    this.labelLink(labelEnd);
    this.labelStick(labelBegin);
    lexer.expect(
      "BRA_OPEN",
      [
        "Il faut une accolade ouvrante pour définir un bloc, comme dans cet exemple :",
        "FOR $i IN RANGE(9) {",
        "  PRINTLN($i)",
        "}",
      ].join("\n"),
    );
    this.pushBytecode(this.$forIn);
    this.parseBloc();
    lexer.expect(
      "BRA_CLOSE",
      [
        "Il faut une accolade fermante à la fin d'un bloc, comme dans cet exemple :",
        "FOR $i IN RANGE(9) {",
        "  PRINTLN($i)",
        "}",
      ].join("\n"),
    );
    this.pushJump(labelBegin);
    this.labelStick(labelEnd);
    return true;
  };

  private readonly parseAffectation = () => {
    const token = this.lexer.get("VAR");
    if (!token) return false;

    const varName = token.val;
    this.pushBytecode(varName);
    this.lexer.expect(
      "EQUAL",
      `Je m'attendais à voir le signe "=" pour l'affectation de la variable ${varName} !`,
    );
    this.parseExpression();
    this.pushBytecode(this.$setVar);
    return true;
  };

  private readonly parseInstruction = () => {
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
  };

  private readonly parseExpression = () => {
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
  };

  private readonly parseFunction = () => {
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
  };

  private readonly parseExpressionBlock = () => {
    const { lexer } = this;
    if (!lexer.get("PAR_OPEN")) return false;

    if (!this.parseExpression()) {
      lexer.fatal("Il manque une expression après la parenthèse ouvrante.");
    }

    lexer.expect("PAR_CLOSE", "Il manque une parenthèse fermante ici.");
    return true;
  };

  private readonly parseBinaryOperator = () => {
    const { lexer } = this;
    const token = lexer.get("BINOP");
    if (!token) return false;

    const operator = token.val;
    if (!this.parseExpression()) {
      lexer.fatal(
        `Je m'attendais à une expression après l'opérateur "${lexer.token.val}" !`,
      );
    }
    this.pushBytecode(this.makeBinOp(operator));
    return true;
  };

  private readonly parseNumber = () => {
    const token = this.lexer.get("NUM");
    if (!token) return false;

    this.pushBytecode(Number(token.val));
    return true;
  };

  private readonly parseString = () => {
    const token = this.lexer.get("STR");
    if (!token) return false;

    this.pushBytecode(token.val.slice(1, -1));
    return true;
  };

  private readonly parseHexa = () => {
    const token = this.lexer.get("HEX");
    if (!token) return false;

    this.pushBytecode(Number(`0x${token.val.trim().slice(1)}`));
    return true;
  };

  private readonly parseVar = () => {
    const token = this.lexer.get("VAR");
    if (!token) return false;

    this.pushBytecode(token.val, this.$getVar);
    return true;
  };

  private parseAny(...parsers: Array<() => boolean>) {
    for (const parser of parsers) {
      if (parser()) return true;
    }
    return false;
  }

  private pop() {
    const val = this.stack.pop();
    return val ?? 0;
  }

  private popStr(): string {
    const val = this.stack.pop();
    return isString(val) ? val : JSON.stringify(val);
  }

  private popNum(): number {
    const val = this.stack.pop();
    return isNumber(val) ? val : 0;
  }

  private popArr(): BasikValue[] {
    const val = this.stack.pop();
    if (!Array.isArray(val)) {
      console.error("We were expecting an array, but got:", val);
      return [];
    }
    return val;
  }

  private readonly $jump = makeAsync("JMP", () => {
    this.cursor = this.popNum();
  });

  private readonly $jumpIfZero = makeAsync("JMP", () => {
    const cursor = this.popNum();
    const value = this.pop();
    if (value === 0) this.cursor = cursor;
  });

  private readonly $setVar = makeAsync("setVar(name, value)", () => {
    const varValue = this.pop();
    const varName = this.popStr();
    this.kernel.setVar(varName, varValue);
  });

  private readonly $getVar = makeAsync("getVar(name)", () => {
    const varName = this.popStr();
    this.stack.push(this.kernel.getVar(varName) ?? 0);
  });

  private readonly $makeArray = makeAsync("makeArray(count, ...)", () => {
    const count = this.popNum();
    const array = this.stack.splice(this.stack.length - count, count);
    this.stack.push(array);
  });

  private readonly $function = async () => {
    const name = this.popStr();
    const args = this.popArr();
    const result = await this.kernel.executeFunction(name, args);
    this.stack.push(result);
  };

  private readonly $instruction = async () => {
    const name = this.popStr();
    const args = this.popArr();
    await this.kernel.executeInstruction(name, args);
  };

  private readonly $if = makeAsync("IF ... ELSE", () => {
    const jump = this.popNum();
    const cond = this.pop();
    if (cond === 0) {
      this.cursor = jump;
    }
  });

  private readonly $forIn = makeAsync("FOR ... IN", () => {
    const [varName, list, index, jumpOut] = this.stack.slice(-4);
    const arr = isString(list) ? list.split("") : list;
    if (!Array.isArray(arr)) {
      throw new Error(
        [
          "Après le IN, il me faut une liste ou une chaine.",
          `Mais j'ai reçu ça : ${JSON.stringify(arr)}.`,
        ].join("\n"),
      );
    }
    if (!isString(varName))
      throw new Error("Internal error! VarName must be a number.");
    if (!isNumber(index))
      throw new Error("Internal error! Index must be a number.");
    if (!isNumber(jumpOut))
      throw new Error("Internal error! JumpOut must be a number.");
    if (index >= arr.length) {
      // End of the loop. We cleanup.
      this.stack.splice(-4, 4);
      this.cursor = jumpOut;
      return;
    }
    this.kernel.setVar(varName, arr[index]);
    this.stack[this.stack.length - 2] = index + 1;
  });

  private makeBinOp(operator: string) {
    return makeAsync(operator, () => {
      const varB = this.pop();
      const varA = this.pop();
      const binop = BINOPS[operator.toUpperCase()];
      if (!binop) {
        this.lexer.fatal(`Unimplemented binary operator: "${operator}"!`);
      }
      const result: BasikValue = binop(varA, varB);
      this.stack.push(result);
    });
  }

  public debugBytecode() {
    const size = this.labels.getLabelsMaxLength();
    const lines = this.bytecode
      .map(({ val }, cursor) => {
        if (isFunction(val)) return `CALL ${val.name}`;
        const label = this.labels.getLinkAtCursor(cursor);
        if (label) return `LINK ${label}  ->  ${JSON.stringify(val)}`;
        return `PUSH ${JSON.stringify(val)}`;
      })
      .map(
        (line, cursor) =>
          `${`${cursor}`.padStart(6, " ")}. ${this.labels.getLabelAtCursor(cursor).padEnd(size)} ${line}`,
      );
    console.info(lines.join("\n"));
  }
}

function makeAsync(name: string, func: () => void): () => Promise<void> {
  const result = {
    [name]: () =>
      new Promise<void>((resolve, reject) => {
        try {
          func();
        } catch (ex) {
          reject(ex);
        }
        resolve();
      }),
  };
  return result[name];
}
