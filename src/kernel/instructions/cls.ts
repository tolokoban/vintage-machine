import { KernelInterface } from "../types"
import { make } from "./_common"
import { argsAreAnys } from "@/basik/guards"

export const makeCls = (kernel: KernelInterface) =>
    make("cls", argsAreAnys(), () => {
        kernel.paintFB(() => {
            kernel.x = kernel.TEXT_ORIGIN_X
            kernel.y = kernel.TEXT_ORIGIN_Y
            const { gl } = kernel
            gl.clearColor(0, 0, 0, 1)
            gl.clear(gl.COLOR_BUFFER_BIT)
        })
        kernel.paint()
    })
