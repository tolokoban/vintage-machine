import { BasikValue } from "@/types"
import { make } from "./_common"
import { argsAreAnys } from "@/basik/guards"
import { isString } from "@tolokoban/type-guards"
import { Kernel } from "@/kernel"

export const makeAsk = (kernel: Kernel) =>
    make(
        "ASK",
        argsAreAnys(0),
        async (args: BasikValue[]) => await ask(args, kernel)
    )

export const makeAskNum = (kernel: Kernel) =>
    make("ASK", argsAreAnys(0), async (args: BasikValue[]) =>
        toNumber(await ask(args, kernel))
    )

export const makeAskInt = (kernel: Kernel) =>
    make("ASK", argsAreAnys(0), async (args: BasikValue[]) =>
        Math.round(toNumber(await ask(args, kernel)))
    )

function toNumber(str: string): number {
    const num = parseFloat(str)
    return Number.isNaN(num) ? 0 : num
}

function ask(args: BasikValue[], kernel: Kernel) {
    return new Promise<string>(resolve => {
        const text = args
            .map(arg => (isString(arg) ? arg : JSON.stringify(arg)))
            .join("")
        kernel.print(text)
        kernel.paint()
        kernel.cursor.show()
        let value = ""
        const handleKey = (key: string) => {
            console.log("🚀 [ask] key =", key) // @FIXME: Remove this line written on 2025-05-26 at 16:41
            if (key.length === 1) {
                value += key
                kernel.cursor.hide()
                kernel.print(key)
                kernel.cursor.show()
                return
            }
            if (key === "Enter") {
                kernel.onKeyPressed = null
                kernel.cursor.hide()
                kernel.x = kernel.TEXT_ORIGIN_X
                kernel.y += kernel.CHAR_SIZE
                kernel.scrollUpIfTextOverflows()
                resolve(value)
                return
            }
            if (key === "Backspace" && value.length > 0) {
                kernel.cursor.hide()
                kernel.x -= kernel.CHAR_SIZE
                if (kernel.x < -kernel.WIDTH / 2) {
                    kernel.x += kernel.WIDTH
                    kernel.y -= kernel.CHAR_SIZE
                }
                kernel.cursor.show()
                value = value.slice(0, -1)
            }
            console.log("🚀 [ask] key =", key) // @FIXME: Remove this line written on 2025-05-24 at 09:38
        }
        kernel.onKeyPressed = handleKey
    })
}
