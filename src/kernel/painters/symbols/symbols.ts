import {
  TgdDataset,
  TgdProgram,
  TgdTexture2D,
  TgdVertexArray,
} from "@tolokoban/tgd";
import vert from "./symbols.vert";
import frag from "./symbols.frag";

export interface SymbolsPaintOptions {
  screenX: number;
  screenY: number;
  symbolX: number;
  symbolY: number;
  width?: number;
  height?: number;
  /**
   * Index in the palette between 0 and 255.
   *
   * Note: 0 means invisible.
   */
  colorIndex: number;
  /**
   * You can scale the symbols.
   * Default to 1.
   */
  scale?: number;
}

/**
 * Symbols are extracted from a texture of 256x256 pixels.
 * By default, it holds the characters you want to print.
 * Each character is a 16x16 block.
 * Only the red channel will be used and the printing will
 * be made with a given monochrome color.
 */
export class Symbols {
  private readonly texture: TgdTexture2D;
  private readonly prg: TgdProgram;
  private readonly vao: TgdVertexArray;
  private readonly screenWidthInverse: number;
  private readonly screenHeightInverse: number;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    options: {
      symbols: TgdTexture2D;
      screenWidth: number;
      screenHeight: number;
    },
  ) {
    this.screenWidthInverse = 2 / options.screenWidth;
    this.screenHeightInverse = 2 / options.screenHeight;
    this.texture = options.symbols;
    const prg = new TgdProgram(gl, { vert, frag });
    this.prg = prg;
    const dataset = new TgdDataset({ attPos: "vec2", attUV: "vec2" });
    // prettier-ignore
    dataset.set("attPos", new Float32Array([
            -1, +1, -1, -1, +1, +1, +1, -1
        ]))
    // prettier-ignore
    dataset.set("attUV", new Float32Array([
            0, 1, 0, 0, 1, 1, 1, 0
        ]))
    const vao = new TgdVertexArray(gl, prg, [dataset]);
    this.vao = vao;
  }

  delete() {
    this.texture.delete();
    this.prg.delete();
    this.vao.delete();
  }

  paint({
    screenX,
    screenY,
    symbolX,
    symbolY,
    width = 16,
    height = 16,
    colorIndex,
    scale = 1,
  }: SymbolsPaintOptions) {
    const { gl, prg, vao, texture, screenWidthInverse, screenHeightInverse } =
      this;
    prg.use();
    texture.activate(0, prg, "texSymbols");
    prg.uniform1f("uniScale", scale);
    prg.uniform1f("uniColor", colorIndex / 255);
    prg.uniform2f(
      "uniScreenSizeInverse",
      screenWidthInverse,
      screenHeightInverse,
    );
    prg.uniform2f("uniCenter", screenX, screenY);
    prg.uniform2f("uniSymbolCorner", symbolX / 256, symbolY / 256);
    prg.uniform2f("uniSymbolSize", width / 256, height / 256);
    vao.bind();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    vao.unbind();
  }
}
