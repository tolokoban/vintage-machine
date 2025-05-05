import { Kernel } from "@/kernel";
import { BasikLexer } from "./lexer";
import { isNumber, isString } from "@tolokoban/type-guards";
import { isBasikError, BasikValue } from "@/types";
import { consoleError } from "./error";
import { BINOPS } from "./binops";
import { FUNCTIONS } from "./functions";

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
  private readonly bytecode: ByteCode[] = [];
  private readonly stack: BasikValue[] = [];
  private lexer: BasikLexer = new BasikLexer("");
  private cursor = 0;

  constructor(
    public readonly code: string,
    private readonly kernel: Kernel,
  ) {}

  async execute() {
    try {
      this.compile();
      this.stack.splice(0, this.stack.length);
      const { bytecode, stack } = this;
      let cursor = 0;
      while (cursor < bytecode.length) {
        this.cursor = cursor;
        const action = bytecode[cursor++].val;
        if (typeof action === "function") {
          await action();
        } else {
          stack.push(action);
        }
      }
      this.kernel.debugVariables();
    } catch (ex) {
      if (isBasikError(ex)) {
        consoleError(ex);
      } else {
        throw ex;
      }
    }
  }

  private compile() {
    this.bytecode.splice(0, this.bytecode.length);
    const lexer = new BasikLexer(this.code);
    console.log("Tokens:", lexer.all());
    lexer.next();
    this.lexer = lexer;
    while (lexer.hasMoreCode()) {
      if (this.parseInstruction()) continue;
      if (this.parseAffectation()) continue;

      lexer.fatal("Caractère inattendu ! Je suis perdu...");
    }
    console.log("Compiled!", this.bytecode);
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
    return false;
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

    const name = tknFunction.val.slice(0, -1).trim();
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

  private readonly $function = makeAsync("call()", () => {
    const name = this.popStr();
    const args = this.popArr();
    const func = FUNCTIONS[name];
    if (!func) this.fatal(`La fonction "${name}" n'existe pas.`);
    this.stack.push(func(args));
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
