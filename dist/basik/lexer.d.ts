declare const RX: {
    SPC: RegExp;
    DOTS: RegExp;
    COM: RegExp;
    EOL: RegExp;
    VAR: RegExp;
    HEX: RegExp;
    NUM: RegExp;
    STR: RegExp;
    EQUAL: RegExp;
    LABEL: RegExp;
    COLON: RegExp;
    BINOP: RegExp;
    PAR_OPEN: RegExp;
    PAR_CLOSE: RegExp;
    BRA_OPEN: RegExp;
    BRA_CLOSE: RegExp;
    SQR_OPEN: RegExp;
    SQR_CLOSE: RegExp;
    COMMA: RegExp;
    TO: RegExp;
    IN: RegExp;
    STEP: RegExp;
    FUNC: RegExp;
    INST: RegExp;
    CONST: RegExp;
    EOF: RegExp;
};
type TokenID = keyof typeof RX;
export interface Token {
    id: TokenID;
    val: string;
    pos: number;
}
export declare class BasikLexer {
    private readonly _code;
    private _cursor;
    private _token;
    constructor(_code: string);
    get token(): Token;
    get tokenID(): "SPC" | "DOTS" | "COM" | "EOL" | "VAR" | "HEX" | "NUM" | "STR" | "EQUAL" | "LABEL" | "COLON" | "BINOP" | "PAR_OPEN" | "PAR_CLOSE" | "BRA_OPEN" | "BRA_CLOSE" | "SQR_OPEN" | "SQR_CLOSE" | "COMMA" | "TO" | "IN" | "STEP" | "FUNC" | "INST" | "CONST" | "EOF";
    get tokenCode(): string;
    all(): Token[];
    hasMoreCode(): boolean;
    fatal(msg: string): never;
    next(): void;
    is(...expectedTokens: TokenID[]): boolean;
    get(...tokens: TokenID[]): Token | null;
    expect(expectedTokens: TokenID | TokenID[], errorMessage: string): Token;
}
export {};
//# sourceMappingURL=lexer.d.ts.map