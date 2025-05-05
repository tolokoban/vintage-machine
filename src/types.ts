import { isType } from "@tolokoban/type-guards"

export type BasikValue = string | number | BasikValue[]

export interface BasikError {
    pos: number
    code: string
    msg: string
}

export function isBasikError(data: unknown): data is BasikError {
    return isType(data, {
        pos: "number",
        code: "string",
        msg: "string"
    })
}