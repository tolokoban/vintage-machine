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
  private readonly dataset: TgdDataset;

  constructor(private readonly context: TgdContext) {
    const vert = new TgdShaderVertex({
      uniforms: {
        uniScreenSize: "vec2",
      },
      attributes: {
        attPos: "vec2",
      },
      mainCode: [
        "vec2 pos = attPos * uniScreenSize;",
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
    const dataset = new TgdDataset(
      { attPos: "vec2" },
      {
        usage: "DYNAMIC_DRAW",
      },
    );
    this.dataset = dataset;
    const vao = new TgdVertexArray(context.gl, prg, [dataset]);
    this.vao = vao;
  }

  delete(): void {
    this.prg.delete();
    this.vao.delete();
  }

  /**
   */
  paint(
    coords: number[],
    colorIndex: number,
    mode: "TRIANGLES" | "TRIANGLE_STRIP" | "TRIANGLE_FAN",
  ): void {
    const { context, prg, vao, dataset } = this;
    const { gl } = context;
    prg.use();
    prg.uniform2f("uniScreenSize", 2 / context.width, 2 / context.height);
    prg.uniform1f("uniColor", colorIndex / 255);
    dataset.set("attPos", new Float32Array(coords));
    vao.bind();
    gl.drawArrays(gl[mode], 0, coords.length / 2);
    vao.unbind();
  }
}
