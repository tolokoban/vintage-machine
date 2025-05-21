import {
  tgdCalcDegToRad,
  TgdContext,
  TgdDataset,
  TgdMat2,
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
        uniRotation: "mat2",
        uniScreenSize: "vec2",
      },
      attributes: {
        attPos: "vec2",
      },
      mainCode: [
        "vec2 pos = (uniRotation * (attPos * uniRadius)) * uniScreenSize;",
        "gl_Position = vec4(uniCenter + pos, 0.0, 1.0);",
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
   * @param width Between -320 and +320
   * @param height Between -240 and +240
   * @param colorIndex Integer between 0 and 255.
   */
  paint(
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    colorIndex: number,
    rotation: number,
  ): void {
    const { context, prg, vao } = this;
    const { gl } = context;
    prg.use();
    const angle = tgdCalcDegToRad(rotation);
    const C = Math.cos(angle);
    const S = Math.sin(angle);
    const mat = new TgdMat2(C, S, -S, C);
    console.log(
      "🚀 [rect] centerX, centerY, width, height =",
      centerX,
      centerY,
      width,
      height,
    ); // @FIXME: Remove this line written on 2025-05-21 at 21:00
    prg.uniformMatrix2fv("uniRotation", mat);
    prg.uniform2f("uniCenter", centerX, centerY);
    prg.uniform2f("uniRadius", width / 2, height / 2);
    prg.uniform2f("uniScreenSize", 2 / context.width, 2 / context.height);
    prg.uniform1f("uniColor", colorIndex / 255);
    vao.bind();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    vao.unbind();
  }
}
