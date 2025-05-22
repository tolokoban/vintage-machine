import { Kernel } from "@/kernel";
import { BasikLexer, Token } from "../lexer";
import {
  assertType,
  ensureNumber,
  isFunction,
  isNumber,
  isString,
} from "@tolokoban/type-guards";
import { isBasikError, BasikValue, BasikError } from "@/types";
import { consoleError } from "../error";
import { BINOPS } from "../binops";
import { Labels } from "../labels";
import { workbench } from "@/workbench";

import { parseReturn } from "./parse/return";
import { parseProcedure } from "./parse/procedure";
import { parseInstruction } from "./parse/instruction";
import { parseIf } from "./parse/if";
import { parseWhile } from "./parse/while";
import { parseForIn } from "./parse/forIn";
import { parseAffectation } from "./parse/affectation";
import { parseExpression } from "./parse/expression";
import { parseFunction } from "./parse/function";
import { parseExpressionBlock } from "./parse/expressionBlock";
import { parseBinaryOperator } from "./parse/binaryOperator";
import { parseDef } from "./parse/def";
import { parseNumber } from "./parse/number";
import { parseString } from "./parse/string";
import { parseHexa } from "./parse/hexa";
import { parseVar } from "./parse/var";
import { parseList } from "./parse/list";
import { parseSlicer, parseSlicerArguments } from "./parse/slicer";
import { tgdCalcClamp } from "@tolokoban/tgd";

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
  readonly labels = new Labels();
  readonly bytecode: ByteCode[] = [];
  readonly stack: BasikValue[] = [];
  /**
   * Used to keep track of a caller position of a function.
   */
  readonly callStack: number[] = [];
  readonly functionsDefinitions = new Map<
    string,
    {
      cursor: number;
      args: string[];
    }
  >();
  lexer: BasikLexer = new BasikLexer("");
  cursor = 0;
  code: string = "";

  constructor(readonly kernel: Kernel) {}

  async execute(code: string) {
    try {
      this.code = `${code}\n`;
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
      workbench.state.running.value = true;
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
            pos: this.bytecode[this.cursor - 1].pos,
            msg: `${ex}`,
          };
      consoleError("Erreur d'execution !", err);
    } finally {
      this.kernel.paint();
      workbench.state.running.value = false;
      this.kernel.music.stop();
    }
  }

  compile() {
    this.labels.reset();
    this.bytecode.splice(0, this.bytecode.length);
    const lexer = new BasikLexer(this.code);
    console.log("Tokens:", lexer.all());
    lexer.next();
    this.lexer = lexer;
    while (lexer.hasMoreCode()) {
      if (this.parseInstruction()) continue;

      if (lexer.token.id === "EOF") break;

      lexer.fatal("J'attendais une instruction ici. Je suis perdu...");
    }
    this.pushBytecode("<<EOF>>");
    console.log("Compiled!", this.bytecode);
  }

  link() {
    this.labels.apply(this.bytecode);
    this.debugBytecode();
  }

  fatal(msg: string): never {
    const bytecode = this.bytecode[this.cursor];
    if (bytecode) {
      console.error(msg, bytecode);
    }
    throw new Error(msg);
  }

  pushBytecode(...bytecodes: ByteCode["val"][]) {
    for (const bytecode of bytecodes) {
      this.bytecode.push({
        pos: this.lexer.token.pos,
        val: bytecode,
      });
    }
  }

  pushFunction(val: () => Promise<void>, token?: Token) {
    this.bytecode.push({
      pos: (token ?? this.lexer.token).pos,
      val,
    });
  }

  pushJump(label: string) {
    this.labelPushItsValue(label);
    this.pushBytecode(this.$jump);
  }

  pushJumpIfZero(label: string) {
    this.labelPushItsValue(label);
    this.pushBytecode(this.$jumpIfZero);
  }

  /**
   * The position defined by the label is a number.
   * This function add an instruction that pushes this number to the stack.
   */
  labelPushItsValue(label: string) {
    this.pushBytecode(0);
    this.labels.link(this.bytecode.length - 1, label);
  }

  /**
   * Stick the label at the current position.
   */
  labelStickHere(label: string) {
    return this.labels.stick(label, this.bytecode.length);
  }

  /**
   * Ceate a label with an unique name.
   */
  labelCreate(name: string = "") {
    return this.labels.create(name);
  }

  parseAny(...parsers: Array<() => boolean>) {
    for (const parser of parsers) {
      if (parser()) return true;
    }
    return false;
  }

  readonly parseAffectation = parseAffectation.bind(this);
  readonly parseBinaryOperator = parseBinaryOperator.bind(this);
  readonly parseInstruction = parseInstruction.bind(this);
  readonly parseDef = parseDef.bind(this);
  readonly parseExpression = parseExpression.bind(this);
  readonly parseExpressionBlock = parseExpressionBlock.bind(this);
  readonly parseForIn = parseForIn.bind(this);
  readonly parseFunction = parseFunction.bind(this);
  readonly parseIf = parseIf.bind(this);
  readonly parseProcedure = parseProcedure.bind(this);
  readonly parseList = parseList.bind(this);
  readonly parseReturn = parseReturn.bind(this);
  readonly parseWhile = parseWhile.bind(this);
  readonly parseNumber = parseNumber.bind(this);
  readonly parseSlicer = parseSlicer.bind(this);
  readonly parseSlicerArguments = parseSlicerArguments.bind(this);
  readonly parseString = parseString.bind(this);
  readonly parseHexa = parseHexa.bind(this);
  readonly parseVar = parseVar.bind(this);

  pop() {
    const val = this.stack.pop();
    return val ?? 0;
  }

  popStr(): string {
    const val = this.stack.pop();
    return isString(val) ? val : JSON.stringify(val);
  }

  popNum(): number {
    const val = this.stack.pop();
    if (isNumber(val)) return val;

    throw new Error(
      `J'attendais un nombre ici, mais j'ai reçu : ${JSON.stringify(val)}`,
    );
  }

  popArr(): BasikValue[] {
    const val = this.stack.pop();
    if (isString(val)) return val.split("");

    if (!Array.isArray(val)) {
      console.error("We were expecting an array, but got:", val);
      return [];
    }
    return val;
  }

  readonly $def = makeAsync("DEF", () => {
    const cursor = this.popNum();
    const name = this.popStr();
    const args = this.popArr();
    assertType<string[]>(args, ["array", "string"], `${name}()`);
    this.functionsDefinitions.set(name, {
      cursor,
      args,
    });
  });

  readonly $return = makeAsync("RETURN", () => {
    const back = this.callStack.pop();
    if (!isNumber(back)) {
      this.fatal("Call stack is empty!");
    }
    this.cursor = back;
    this.kernel.subroutineExit();
  });

  readonly $jump = makeAsync("JMP", () => {
    this.cursor = this.popNum();
  });

  readonly $jumpIfZero = makeAsync("JMP", () => {
    const cursor = this.popNum();
    const value = this.pop();
    if (value === 0) this.cursor = cursor;
  });

  readonly $setVar = makeAsync("setVar(name, value)", () => {
    const varValue = this.pop();
    const varName = this.popStr();
    this.kernel.setVar(varName, varValue);
  });

  readonly $setElem = makeAsync("setVar(name, slicer, value)", () => {
    const varValue = this.pop();
    const varSlicer = this.popArr();
    const varName = this.popStr();
    const currentValue = this.kernel.getVar(varName);
    if (isNumber(currentValue)) {
      throw new Error(`La variable ${varName} est un nombre (${currentValue}).
On ne peut donc pas lui assigner d'élément.`);
    }
    if (varSlicer.length < 2) {
      const [arg0] = varSlicer;
      let index = isNumber(arg0) ? Math.floor(arg0) : currentValue.length;
      if (index < 0) index += currentValue.length;
      index = tgdCalcClamp(index, 0, currentValue.length);
      if (Array.isArray(currentValue)) {
        currentValue[index] = varValue;
        return;
      }
      this.kernel.setVar(
        varName,
        currentValue.slice(0, index) +
          stringify(varValue) +
          currentValue.slice(index + 1),
      );
    } else {
      let [start, end] = varSlicer
        .map((v) => Math.round(ensureNumber(v, 0)))
        .map((v) => (v < 0 ? v + currentValue.length : v))
        .map((v) => tgdCalcClamp(v, 0, currentValue.length - 1));
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }
      if (Array.isArray(currentValue)) {
        const head = currentValue.slice(0, start);
        const tail = currentValue.slice(end + 1);
        const v = Array.isArray(varValue)
          ? [...head, ...varValue, ...tail]
          : [...head, varValue, ...tail];
        this.kernel.setVar(varName, v);
      } else {
        this.kernel.setVar(
          varName,
          currentValue.slice(0, start) +
            stringify(varValue) +
            currentValue.slice(end + 1),
        );
      }
    }
    // this.kernel.setVar(varName, varValue);
  });

  readonly $setVars = makeAsync("setVar(name, value)", () => {
    const varArray = this.pop();
    if (!Array.isArray(varArray)) {
      this.lexer.fatal(`Je ne peux desctructurer que des listes.
Mais j'ai reçu ${JSON.stringify(varArray)}.`);
    }
    const varNames = this.popArr();
    for (let i = 0; i < varNames.length; i++) {
      const varName = varNames[i];
      if (!isString(varName)) continue;

      this.kernel.setVar(varName, varArray[i]);
    }
  });

  readonly $getVar = makeAsync("getVar(name)", () => {
    const varName = this.popStr();
    this.stack.push(this.kernel.getVar(varName) ?? 0);
  });

  readonly $neg = makeAsync("neg(...)", () => {
    var value = this.popNum();
    this.stack.push(-value);
  });

  readonly $makeArray = makeAsync("makeArray(count, ...)", () => {
    const count = this.popNum();
    const array = this.stack.splice(this.stack.length - count, count);
    this.stack.push(array);
  });

  readonly $slice = makeAsync("slice[...]", () => {
    const [start, end] = this.popArr();
    if (!isNumber(start)) {
      this.lexer.fatal(
        `Le premier argument d'un operateur slice doit ētre un nombre et pas ${JSON.stringify(start)}.`,
      );
    }
    if (!isNumber(end) && end !== undefined) {
      this.lexer.fatal(
        `Le deuxieme argument d'un operateur slice, s'il est défini, doit ētre un nombre et pas ${JSON.stringify(end)}.`,
      );
    }
    const value = this.pop();
    if (isString(value) || Array.isArray(value)) {
      if (end === undefined) {
        if (isString(value)) {
          this.stack.push(value.slice(start, start + 1));
        } else {
          if (start < 0) {
            this.stack.push(value[value.length + start]);
          } else {
            this.stack.push(value[start]);
          }
        }
      } else {
        if (end === -1) {
          this.stack.push(value.slice(start));
        } else {
          this.stack.push(value.slice(start, end + 1));
        }
      }
      return;
    }
    this.stack.push(value);
  });

  readonly $function = async () => {
    const { kernel } = this;
    const name = this.popStr();
    const args = this.popArr();
    if (kernel.hasFunction(name)) {
      const result = await kernel.executeFunction(name, args);
      this.stack.push(result);
      return;
    }
    const userFunc = this.functionsDefinitions.get(name);
    if (!userFunc) {
      throw new Error(
        `La fonction "${name.toUpperCase()}" n'existe pas.\nLes fonctions disponibles sont: ${[
          Array.from(this.functionsDefinitions.keys()).map(
            (name) =>
              `${name}(${this.functionsDefinitions
                .get(name)
                ?.args.join(", ")})`,
          ),
          ...this.kernel.functionsNames,
        ].join(", ")}.`,
      );
    }
    if (args.length !== userFunc.args.length) {
      throw new Error(
        `La fonction ${name}(${userFunc.args.join(", ")}) attend ${userFunc.args.length} argument${userFunc.args.length > 1 ? "s" : ""}, pas ${args.length}.`,
      );
    }
    this.kernel.subroutineEnter(userFunc.args, args, null);
    this.callStack.push(this.cursor);
    this.cursor = userFunc.cursor;
  };

  readonly $procedure = async () => {
    const name = this.popStr();
    const args = this.popArr();
    const instructionExist = await this.kernel.executeProcedure(name, args);
    if (!instructionExist) {
      const userFunc = this.functionsDefinitions.get(name);
      if (!userFunc) {
        throw new Error(
          `La procédure "${name.toUpperCase()}" n'existe pas.\nLes procédures disponibles sont: ${[
            Array.from(this.functionsDefinitions.keys()).map(
              (name) =>
                `${name}(${this.functionsDefinitions
                  .get(name)
                  ?.args.join(", ")})`,
            ),
            ...this.kernel.proceduresNames,
          ].join(", ")}.`,
        );
      }
      if (args.length !== userFunc.args.length) {
        throw new Error(
          `La fonction ${name}(${userFunc.args.join(", ")}) attend ${userFunc.args.length} argument${userFunc.args.length > 1 ? "s" : ""}, pas ${args.length}.`,
        );
      }
      this.kernel.subroutineEnter(userFunc.args, args, () => this.stack.pop());
      this.callStack.push(this.cursor);
      this.cursor = userFunc.cursor;
    }
  };

  readonly $if = makeAsync("IF ... ELSE", () => {
    const jump = this.popNum();
    const cond = this.pop();
    if (cond === 0) {
      this.cursor = jump;
    }
  });

  readonly $forIn = makeAsync("FOR ... IN", () => {
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

  makeBinOp(operator: string) {
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

  debugBytecode() {
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

function stringify(value: BasikValue) {
  return isString(value) ? value : JSON.stringify(value);
}
