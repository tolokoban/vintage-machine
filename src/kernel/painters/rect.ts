import {
  TgdContext,
  TgdDataset,
  TgdProgram,
  TgdShaderFragment,
  TgdShaderVertex,
  TgdVertexArray,
} from "@tolokoban/tgd";

/**
 * A surface painter will just display `textureRead` and call `action()`.
 */
export class PainterRect {
  private readonly prg: TgdProgram;
  private readonly vao: TgdVertexArray;

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
    }).code;
    const frag = new TgdShaderFragment({
      uniforms: { uniColor: "float" },
      outputs: { FragColor: "vec4" },
      mainCode: ["FragColor = vec4(uniColor, 0.0, 0.0, 1.0);"],
    }).code;
    const prg = new TgdProgram(context.gl, { vert, frag });
    this.prg = prg;
    const dataset = new TgdDataset({ attPos: "vec2" });
    dataset.set("attPos", new Float32Array([-1, +1, -1, -1, +1, +1, +1, -1]));
    const vao = new TgdVertexArray(context.gl, prg, [dataset]);
    this.vao = vao;
  }

  delete(): void {
    this.prg.delete();
    this.vao.delete();
  }

  /**
   * Paint the disk in screen space coordinates.
   * @param centerX Between -1.0 and +1.0
   * @param centerY Between -1.0 and +1.0
   * @param width Between -1.0 and +1.0
   * @param height Between -1.0 and +1.0
   * @param colorIndex Integer between 0 and 255.
   */
  paint(
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    colorIndex: number,
  ): void {
    const { context, prg, vao } = this;
    const { gl } = context;
    prg.use();
    prg.uniform2f("uniCenter", centerX, centerY);
    prg.uniform2f("uniRadius", width, height);
    prg.uniform1f("uniColor", colorIndex / 255);
    vao.bind();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    vao.unbind();
  }
}
