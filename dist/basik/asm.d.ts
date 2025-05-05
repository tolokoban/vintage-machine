import { Kernel } from "@/kernel";
import { BasikValue } from "@/types";
export type ByteCode = {
    pos: number;
    val: BasikValue | (() => Promise<void>);
};
export declare class BasikAssembly {
    readonly code: string;
    private readonly kernel;
    private readonly bytecode;
    private readonly stack;
    private lexer;
    private cursor;
    constructor(code: string, kernel: Kernel);
    execute(): Promise<void>;
    private compile;
    private fatal;
    private pushBytecode;
    private readonly parseAffectation;
    private readonly parseInstruction;
    private readonly parseExpression;
    private readonly parseFunction;
    private readonly parseExpressionBlock;
    private readonly parseBinaryOperator;
    private readonly parseNumber;
    private readonly parseString;
    private readonly parseHexa;
    private readonly parseVar;
    private parseAny;
    private pop;
    private popStr;
    private popNum;
    private popArr;
    private readonly $setVar;
    private readonly $getVar;
    private readonly $makeArray;
    private readonly $function;
    private makeBinOp;
}
//# sourceMappingURL=asm.d.ts.map