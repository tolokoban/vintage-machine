export type BasikValue = string | number | BasikValue[];
export interface BasikError {
    pos: number;
    code: string;
    msg: string;
}
export declare function isBasikError(data: unknown): data is BasikError;
//# sourceMappingURL=types.d.ts.map