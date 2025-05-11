import { BasikError } from "@/types";

const RX = {
  SPC: /^[ \t]+/g,
  COM: /^(REM )[^\n\r]*[\n\r]+/gi,
  EOL: /^[\n\r]+/g,
  //-----------------------------------
  VAR: /^\$[a-z0-9\._]+/gi,
  HEX: /^#[0-9a-f]+/gi,
  NUM: /^-?([0-9]+(\.[0-9]+)?|\.[0-9]+)/g,
  STR: /^"(\\"|[^"])*"/g,
  BINOP: /^(and|or|xor|>=|<=|<>|\^|==|[%+*/<>-])/gi,
  EQUAL: /^=/g,
  PAR_OPEN: /^\(/g,
  PAR_CLOSE: /^\)/g,
  BRA_OPEN: /^\{/g,
  BRA_CLOSE: /^\}/g,
  SQR_OPEN: /^\[/g,
  SQR_CLOSE: /^\]/g,
  COMMA: /^,/g,
  DEF: /^def(?![a-z0-9])/i,
  RETURN: /^return(?![a-z0-9])/i,
  WHILE: /^while(?![a-z0-9])/i,
  FOR: /^for(?![a-z0-9])/i,
  IN: /^in(?![a-z0-9])/i,
  IF: /^if(?![a-z0-9])/i,
  ELSE: /^else(?![a-z0-9])/i,
  FUNC: /^[a-z_][a-z_0-9]*\(/i,
  INST: /^[a-z_][a-z_0-9]*/gi,
  EOF: /^<<EOF>>/,
};

type TokenID = keyof typeof RX;

const TOKENS_TO_SKIP: TokenID[] = ["SPC", "COM", "EOL"];

export interface Token {
  id: TokenID;
  val: string;
  pos: number;
}

/**
 * A lexer for the BASIK language.
 */
export class BasikLexer {
  private _cursor = 0;
  private _token: Token = { id: "EOF", val: "", pos: 1e100 };

  constructor(private readonly _code: string) {}

  get token() {
    return this._token;
  }

  get tokenID() {
    return this.token.id;
  }

  get tokenCode() {
    return this._code.slice(this.token.pos);
  }

  all(): Token[] {
    const savedCursor = this._cursor;
    const tokens: Token[] = [];
    this._cursor = 0;
    while (this.hasMoreCode()) {
      this.next();
      tokens.push(structuredClone(this._token));
    }
    this._cursor = savedCursor;
    return tokens;
  }

  highlight() {
    const output: string[] = [];
    let cursor = 0;
    while (cursor < this._code.length) {
      const code = this._code.slice(cursor);
      let token: Token | null = null;
      for (const [id, rx] of Object.entries(RX)) {
        rx.lastIndex = -1;
        const matcher = rx.exec(code);
        if (matcher) {
          token = { id: id as TokenID, val: matcher[0], pos: cursor };
          break;
        }
      }
      if (token) {
        cursor += token.val.length;
        let text = token.val
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
        switch (token.id) {
          case "VAR":
            text = text.toLowerCase();
            break;
          case "COM":
            text = text.slice(0, 3).toUpperCase() + text.slice(3);
            break;
          case "HEX":
          case "FUNC":
          case "DEF":
          case "RETURN":
          case "FOR":
          case "IN":
          case "IF":
          case "ELSE":
          case "WHILE":
            text = text.toUpperCase();
            break;
        }
        output.push(`<span class="Basik-${token.id}">${text}</span>`);
      } else {
        cursor += 1;
        output.push(code.charAt(0));
      }
    }
    return output.join("");
  }

  hasMoreCode() {
    return this._cursor < this._code.length - 1;
  }

  fatal(msg: string, token?: Token): never {
    var e: BasikError = {
      pos: token?.pos ?? this._cursor,
      code: this._code,
      msg: msg,
    };
    console.error(e, token ?? this.token);
    throw e;
  }

  next() {
    let code = this._code.slice(this._cursor);
    if (code.trimEnd().length === 0) {
      this._token = {
        id: "EOF",
        pos: this._cursor,
        val: "",
      };
      this._cursor += code.length + 1;
      return;
    }
    while (true) {
      let tkn: Token | null = null;
      for (const key of Object.keys(RX)) {
        const id = key as TokenID;
        const rx = RX[id];
        if (!rx) continue;

        // Reinit the cursor of the RegExp.
        rx.lastIndex = 0;
        const matcher = rx.exec(code);
        if (matcher) {
          tkn = { id: id, val: matcher[0], pos: this._cursor };
          break;
        }
      }
      if (!tkn) {
        this.fatal(
          `Je suis tombé sur un caractère qui n'a rien à faire là : "${code.charAt(0)}".`,
        );
      }

      this._cursor += tkn.val.length;
      if (!TOKENS_TO_SKIP.includes(tkn.id)) {
        this._token = tkn;
        return;
      }
      code = this._code.slice(this._cursor);
    }
  }

  is(...expectedTokens: TokenID[]): boolean {
    return expectedTokens.includes(this._token.id);
  }

  /**
   * If the current token is not the expected one, return false.
   * Otherwise, return the token and nove to the next one.
   * @param expectedTokens List of expected token ids.
   * @returns The token we were expecting.
   */
  get(...tokens: TokenID[]): Token | null {
    if (!tokens.includes(this._token.id)) {
      return null;
    }

    const token = structuredClone(this._token);
    this.next();
    return token;
  }

  /**
   * If the current token is not the expected one, we throw an exception.
   * Otherwise, we move to the next token.
   * @param expectedTokens If a list is provided, it will act as a OR.
   * @param errorMessage Error message in case of exception.
   * @returns The token we were expecting.
   */
  expect(expectedTokens: TokenID | TokenID[], errorMessage: string): Token {
    const tokens: TokenID[] = Array.isArray(expectedTokens)
      ? expectedTokens
      : [expectedTokens];
    if (!tokens.includes(this._token.id)) {
      this.fatal(errorMessage);
    }

    const token = structuredClone(this._token);
    this.next();
    return token;
  }
}
