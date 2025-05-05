import { TgdContext } from "@tolokoban/tgd";

export class KernelPrint {
  private readonly _texSymbols: WebGLTexture;

  constructor(
    private readonly context: TgdContext,
    symbols: Uint8Array,
  ) {
    const { gl } = context;
    var texSymbols = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texSymbols);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      256,
      256,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      symbols,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this._texSymbols = texSymbols;
  }

  delete() {
    const { gl } = this.context;
    gl.deleteTexture(this._texSymbols);
  }
}
