import { createBasikAssembly } from "./../asm"
import { BasikValue } from "./../../../dist/types.d"
import { PainterDisk } from "../../kernel/painters/disk"
import { PainterLayer } from "../../kernel/painters/layer"
import { PainterRect } from "../../kernel/painters/rect"
import { Symbols } from "../../kernel/painters/symbols/symbols"
import { BasikPalette } from "../../kernel/palette/main"
import { Kernel } from "../../kernel"
import { KernelInterface } from "./../../kernel/types"

describe("basik/asm/asm.ts", () => {
    async function check(
        codeLines: string[],
        expectedVars: Record<string, BasikValue>
    ) {
        const code = codeLines.join("\n")
        const kernel = new Kernel(document.createElement("canvas"), new Image())
        const asm = createBasikAssembly(kernel)
        const vars: Record<string, BasikValue> = {}
        try {
            await asm.execute(code)
            for (const key of kernel.allVarNames) {
                vars[key] = kernel.getVar(key)
            }
        } catch (ex) {
            const msg = ex instanceof Error ? ex.message : JSON.stringify(ex)
            vars["@ERROR"] = msg
        }
        for (const varName of Object.keys(vars)) {
            const varValue = expectedVars[varName]
            it(`${varName} should be of type "${typeof varValue}"`, () => {
                expect(typeof vars[varName]).toBe(typeof varValue)
            })
            it(`${varName} should be equal to ${JSON.stringify(varValue)}`, () => {
                expect(JSON.stringify(vars[varName])).toBe(
                    JSON.stringify(varValue)
                )
            })
        }
    }
    describe("Asm.foo()", () => {
        it("should assign variables", async () => {
            await check(["$a = 666"], { $a: 666 })
        })
    })
})
