import { BasikAssembly } from "@/basik/asm/asm"

export function parseIf(this: BasikAssembly) {
    const { lexer } = this
    if (!lexer.get("IF")) return false

    if (!this.parseExpression()) {
        this.fatal("Après un IF il faut une expression.")
    }
    const lblElse = this.labelCreate("Else")
    const lblEndIf = this.labelCreate("EndIf")
    this.labelPushItsValue(lblElse)
    this.pushBytecode(this.$if)
    this.parseInstruction()
    this.pushJump(lblEndIf)
    this.labelStickHere(lblElse)
    while (true) {
        const tknElif = lexer.get("ELIF")
        if (!tknElif) break

        if (!this.parseExpression()) {
            this.lexer.fatal("Après un ELIF il faut une expression.", tknElif)
        }
        const lblElseIf = this.labelCreate("ElseIf")
        this.labelPushItsValue(lblElseIf)
        this.pushBytecode(this.$if)
        this.parseInstruction()
        this.pushJump(lblEndIf)
        this.labelStickHere(lblElseIf)
    }
    if (lexer.get("ELSE")) {
        this.parseInstruction()
    }
    this.labelStickHere(lblEndIf)
    return true
}
