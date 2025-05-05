import { BasikValue } from "@/types";
import {
  tgdCalcModulo,
  TgdContext,
  TgdPainter,
  TgdPainterFramebuffer,
  TgdPainterLogic,
  TgdTexture2D,
} from "@tolokoban/tgd";

export class Kernel extends TgdPainter {
  static readonly LAYERS_COUNT = 1;
  static readonly WIDTH = 640;
  static readonly HEIGHT = 480;

  private readonly context: TgdContext;
  private readonly variables = new Map<string, BasikValue>();
  private readonly layersSwaps: [TgdTexture2D[], TgdTexture2D[]] = [[], []];
  private readonly layersIndexes: number[] = [];
  private readonly framebuffer: TgdPainterFramebuffer;
  private _currentLayer = 0;

  constructor(canvas: HTMLCanvasElement, symbols: ArrayBuffer) {
    super();
    canvas.width = Kernel.WIDTH;
    canvas.height = Kernel.HEIGHT;
    const context = new TgdContext(canvas, {
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: true,
    });
    this.context = context;
    this.framebuffer = new TgdPainterFramebuffer(context, {
      children: [new TgdPainterLogic(this.paintLayer)],
    });
    for (let index = 0; index < Kernel.LAYERS_COUNT; index++) {
      for (const layers of this.layersSwaps) {
        layers.push(
          new TgdTexture2D(context).setParams({
            wrapS: "REPEAT",
            wrapT: "REPEAT",
            magFilter: "NEAREST",
            minFilter: "NEAREST",
          }),
        );
      }
      this.layersIndexes.push(0);
    }
    context.add(this);
    context.paint();
  }

  get currentLayer() {
    return this._currentLayer;
  }
  set currentLayer(value: number) {
    value =
      Kernel.LAYERS_COUNT === 1
        ? 0
        : tgdCalcModulo(Math.round(value), 0, Kernel.LAYERS_COUNT - 1);
    this._currentLayer = value;
  }

  delete(): void {
    this.framebuffer.delete();
    for (const layers of this.layersSwaps) {
      for (const layer of layers) {
        layer.delete();
      }
    }
  }

  paint(time: number, delay: number): void {
    const { context } = this;
    const { gl } = context;
    gl.clearColor(1, 0.667, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private readonly paintLayer = (time: number, delay: number): void => {};

  getVar(name: string) {
    return this.variables.get(name) ?? 0;
  }

  setVar(name: string, value: BasikValue) {
    this.variables.set(name, value);
  }

  debugVariables() {
    for (const key of this.variables.keys()) {
      console.log(key, "=", this.getVar(key));
    }
  }
}
