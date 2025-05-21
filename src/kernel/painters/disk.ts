import {
  tgdCalcDegToRad,
  TgdContext,
  TgdMat2,
  TgdMat3,
  TgdProgram,
  TgdShaderFragment,
  TgdShaderVertex,
} from "@tolokoban/tgd";

/**
 * A surface painter will just display `textureRead` and call `action()`.
 */
export class PainterDisk {
  private readonly STEPS = 128;

  private readonly prg: TgdProgram;

  constructor(private readonly context: TgdContext) {
    const vert = new TgdShaderVertex({
      uniforms: {
        uniStartAngle: "float",
        uniCenter: "vec2",
        uniRadius: "vec2",
        uniRotation: "mat2",
        uniStepsInRadians: "float",
      },
      mainCode: [
        "if (gl_VertexID == 0) gl_Position = vec4(uniCenter, 0.0, 1.0);",
        "else {",
        "  float angle = uniStepsInRadians * float(gl_VertexID) + uniStartAngle;",
        "  vec2 pos = vec2(",
        "    cos(angle), sin(angle)",
        "  ) * uniRadius;",
        "  gl_Position = vec4(uniCenter + uniRotation * pos, 0.0, 1.0);",
        "}",
      ],
    }).code;
    const frag = new TgdShaderFragment({
      uniforms: { uniColor: "float" },
      outputs: { FragColor: "vec4" },
      mainCode: ["FragColor = vec4(uniColor, 0.0, 0.0, 1.0);"],
    }).code;
    const prg = new TgdProgram(context.gl, { vert, frag });
    this.prg = prg;
  }

  delete(): void {
    this.prg.delete();
  }

  /**
   * Paint the disk in screen space coordinates.
   * @param centerX Between -1.0 and +1.0
   * @param centerY Between -1.0 and +1.0
   * @param radiusX Between -1.0 and +1.0
   * @param radiusY Between -1.0 and +1.0
   * @param colorIndex Integer between 0 and 255.
   * @param rotation Rotation in degrees.
   * @param spread Number of degrees of the disk to draw. 90 is a quarter of the disk.
   */
  paint(
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    colorIndex: number,
    rotation: number,
    spread: number,
    startAngle: number,
  ): void {
    const { context, prg } = this;
    const { gl } = context;
    const angle = tgdCalcDegToRad(rotation);
    const C = Math.cos(angle);
    const S = Math.sin(angle);
    const mat = new TgdMat2(C, S, -S, C);
    const steps =
      Math.max(Math.abs(radiusX) * 320, Math.abs(radiusY) * 240) * 2;
    prg.use();
    prg.uniform1f("uniStartAngle", tgdCalcDegToRad(startAngle));
    prg.uniform2f("uniCenter", centerX, centerY);
    prg.uniform2f("uniRadius", radiusX, radiusY);
    prg.uniform1f("uniStepsInRadians", (2 * Math.PI) / steps);
    prg.uniformMatrix2fv("uniRotation", mat);
    prg.uniform1f("uniColor", colorIndex / 255);
    const spreadFactor = spread / 360;
    gl.drawArrays(
      gl.TRIANGLE_FAN,
      0,
      1 + Math.round((steps + 1) * spreadFactor),
    );
  }
}
