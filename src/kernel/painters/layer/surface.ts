import {
    TgdContext,
    TgdDataset,
    TgdPainter,
    TgdProgram,
    TgdShaderFragment,
    TgdShaderVertex,
    TgdTexture2D,
    TgdVertexArray,
} from "@tolokoban/tgd"

/**
 * A surface painter will just display `textureRead` and call `action()`.
 */
export class PainterSurface extends TgdPainter {
    private readonly prg: TgdProgram
    private readonly vao: TgdVertexArray

    constructor(
        private readonly context: TgdContext,
        private readonly textureRead: TgdTexture2D,
        private readonly action: () => void
    ) {
        super()
        const vert = new TgdShaderVertex({
            varying: {
                varUV: "vec2",
            },
            attributes: {
                attPos: "vec2",
                attUV: "vec2",
            },
            mainCode: [
                "varUV = attUV;",
                "gl_Position = vec4(attPos, 0.0, 1.0);",
            ],
        }).code
        const frag = new TgdShaderFragment({
            varying: { varUV: "vec2" },
            uniforms: { uniTexture: "sampler2D" },
            outputs: { FragColor: "vec4" },
            mainCode: [
                "float colorIndex = texture(uniTexture, varUV).r;",
                "FragColor = vec4(colorIndex, 0.0, 0.0, 1.0);",
            ],
        }).code
        const prg = new TgdProgram(context.gl, { vert, frag })
        this.prg = prg
        const dataset = new TgdDataset({ attPos: "vec2", attUV: "vec2" })
        // prettier-ignore
        dataset.set("attPos", new Float32Array([
            -1, +1, -1, -1, +1, +1, +1, -1
        ]))
        // prettier-ignore
        dataset.set("attUV", new Float32Array([
            0, 1, 0, 0, 1, 1, 1, 0
        ]))
        const vao = new TgdVertexArray(context.gl, prg, [dataset])
        this.vao = vao
    }

    delete(): void {
        this.prg.delete()
        this.vao.delete()
    }

    paint(): void {
        const { context, prg, vao, textureRead } = this
        const { gl } = context
        prg.use()
        textureRead.activate(0, prg, "uniTexture")
        vao.bind()
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        vao.unbind()
        this.action()
    }
}
