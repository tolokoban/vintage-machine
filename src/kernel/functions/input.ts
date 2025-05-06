import { BasikValue } from "@/types"
import { KernelInterface } from "../types"
import { make } from "./_common"
import { argsAreNumbers } from "@/basik/guards"

export const makeInput = (kernel: KernelInterface) =>
    make(
        "INPUT",
        argsAreNumbers(0, 0),
        () =>
            new Promise<BasikValue>(resolve => {
                kernel.paint()
                let value = ""
                const handleKey = (evt: KeyboardEvent) => {
                    if (evt.ctrlKey || evt.altKey || evt.metaKey) return

                    try {
                        const { key } = evt
                        if (key.length === 1) {
                            value += key
                            kernel.print(key)
                            return
                        }
                        if (key === "Enter") {
                            globalThis.document.removeEventListener(
                                "keydown",
                                handleKey
                            )
                            kernel.x = kernel.TEXT_ORIGIN_X
                            kernel.y += kernel.CHAR_SIZE
                            resolve(value)
                            return
                        }
                        console.log("🚀 [input] key =", key) // @FIXME: Remove this line written on 2025-05-06 at 23:34
                    } finally {
                        kernel.paint()
                    }
                }
                globalThis.document.addEventListener("keydown", handleKey)
            })
    )
