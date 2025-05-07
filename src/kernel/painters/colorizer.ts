import {
    TgdContext,
    TgdDataset,
    TgdProgram,
    TgdShaderFragment,
    TgdShaderVertex,
    TgdTexture2D,
    TgdVertexArray,
} from "@tolokoban/tgd"

/**
 * Get a monochrome texture and apply colors from a palette.
 */
export class PainterColorizer {
    private readonly prg: TgdProgram
    private readonly vao: TgdVertexArray

    constructor(
        private readonly context: TgdContext,
        private readonly texturePalette: TgdTexture2D
    ) {
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
            uniforms: { uniTexture: "sampler2D", uniPalette: "sampler2D" },
            outputs: { FragColor: "vec4" },
            mainCode: [
                "vec4 texel = texture(uniTexture, varUV);",
                "float colorIndex = texel.r;",
                "float u = colorIndex + 1.0 / 512.0;",
                "FragColor = texture(uniPalette, vec2(u, 0.5));",
                "if (colorIndex == 0.0) FragColor.a = 0.0;",
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
            0, 0, 0, 1, 1, 0, 1, 1
        ]))
        const vao = new TgdVertexArray(context.gl, prg, [dataset])
        this.vao = vao
    }

    delete(): void {
        this.prg.delete()
        this.vao.delete()
    }

    paint(texture: TgdTexture2D): void {
        const { context, prg, vao, texturePalette } = this
        const { gl } = context
        prg.use()
        texture.activate(0, prg, "uniTexture")
        texturePalette.activate(1, prg, "uniPalette")
        vao.bind()
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        vao.unbind()
    }
}
