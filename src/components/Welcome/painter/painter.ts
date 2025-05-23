import { TgdCamera, TgdPainter, TgdProgram } from "@tolokoban/tgd"

import vert from "./painter.vert"
import frag from "./painter.frag"

export class PainterFog extends TgdPainter {
    private readonly prg: TgdProgram

    constructor(
        private readonly context: {
            gl: WebGL2RenderingContext
            camera: TgdCamera
        }
    ) {
        super()
        const { gl } = context
        this.prg = new TgdProgram(gl, { vert, frag })
    }

    delete(): void {
        this.prg.delete()
    }

    paint(time: number, delay: number): void {
        const { context, prg } = this
        const { gl } = context
        prg.use()
        prg.uniform1f("uniTime", time)
        prg.uniform2f(
            "uniScreenSize",
            gl.drawingBufferWidth,
            gl.drawingBufferHeight
        )
        gl.disable(gl.CULL_FACE)
        gl.disable(gl.DEPTH_TEST)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
}
