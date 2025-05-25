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
export class PainterTri {
  private readonly prg: TgdProgram;
  private readonly vao: TgdVertexArray;
  private readonly dataset: TgdDataset;

  constructor(private readonly context: TgdContext) {
    const vert = new TgdShaderVertex({
      uniforms: {
        uniOrigin: "vec2",
        uniScreenSize: "vec2",
      },
      attributes: {
        attPos: "vec2",
      },
      mainCode: [
        "vec2 pos = (attPos + uniOrigin) * uniScreenSize;",
        "gl_Position = vec4(pos, 0.0, 1.0);",
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
    dataset.set("attPos", new Float32Array([0, 60, 50, -30, -50, -30]));
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
    originX: number,
    originY: number,
    mode: "TRIANGLES" | "TRIANGLE_STRIP" | "TRIANGLE_FAN",
  ): void {
    const { context, prg, vao, dataset } = this;
    const { gl } = context;
    prg.use();
    prg.uniform2f("uniOrigin", originX, originY);
    prg.uniform2f("uniScreenSize", 2 / context.width, 2 / context.height);
    prg.uniform1f("uniColor", colorIndex / 255);
    vao.bind();
    dataset.set("attPos", new Float32Array(coords));
    vao.updateDataset(dataset);
    gl.drawArrays(gl[mode], 0, coords.length / 2);
    vao.unbind();
  }
}
