import {
    TgdContext,
    TgdDataset,
    TgdProgram,
    TgdShaderFragment,
    TgdShaderVertex,
    TgdVertexArray,
} from "@tolokoban/tgd"

/**
 * A surface painter will just display `textureRead` and call `action()`.
 */
export class PainterDisk {
    private readonly STEPS = 128

    private readonly prg: TgdProgram
    private readonly vao: TgdVertexArray

    constructor(private readonly context: TgdContext) {
        const vert = new TgdShaderVertex({
            uniforms: {
                uniCenter: "vec2",
                uniRadius: "vec2",
            },
            attributes: {
                attPos: "vec2",
            },
            mainCode: [
                "gl_Position = vec4(uniCenter + attPos * uniRadius, 0.0, 1.0);",
            ],
        }).code
        const frag = new TgdShaderFragment({
            uniforms: { uniColor: "float" },
            outputs: { FragColor: "vec4" },
            mainCode: ["FragColor = vec4(uniColor, 0.0, 0.0, 1.0);"],
        }).code
        const prg = new TgdProgram(context.gl, { vert, frag })
        this.prg = prg
        const points: number[] = [0, 0]
        const step = (2 * Math.PI) / this.STEPS
        for (let i = 0; i < this.STEPS; i++) {
            const ang = step * i
            const x = Math.cos(ang)
            const y = Math.sin(ang)
            points.push(x, y)
        }
        points.push(1, 0)
        const dataset = new TgdDataset({ attPos: "vec2" })
        dataset.set("attPos", new Float32Array(points))
        const vao = new TgdVertexArray(context.gl, prg, [dataset])
        this.vao = vao
    }

    delete(): void {
        this.prg.delete()
        this.vao.delete()
    }

    /**
     * Paint the disk in screen space coordinates.
     * @param centerX Between -1.0 and +1.0
     * @param centerY Between -1.0 and +1.0
     * @param radiusX Between -1.0 and +1.0
     * @param radiusY Between -1.0 and +1.0
     * @param colorIndex Integer between 0 and 255.
     */
    paint(
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number,
        colorIndex: number
    ): void {
        const { context, prg, vao } = this
        const { gl } = context
        prg.use()
        prg.uniform2f("uniCenter", centerX, centerY)
        prg.uniform2f("uniRadius", radiusX, radiusY)
        prg.uniform1f("uniColor", colorIndex / 255)
        vao.bind()
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.STEPS + 2)
        vao.unbind()
    }
}
