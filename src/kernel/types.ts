import { PainterDisk } from "./painters/disk";
import { PainterRect } from "./painters/rect";
import { Symbols } from "./painters/symbols/symbols";

export interface KernelInterface {
  readonly LAYERS_COUNT: number;
  readonly WIDTH: number;
  readonly HEIGHT: number;
  readonly TEXT_COLS: number;
  readonly TEXT_ROWS: number;
  readonly TEXT_ORIGIN_X: number;
  readonly TEXT_ORIGIN_Y: number;
  readonly CHAR_SIZE: number;
  readonly painterDisk: PainterDisk;
  readonly painterRect: PainterRect;
  readonly painterSymbols: Symbols;
  readonly gl: WebGL2RenderingContext;
  x: number;
  y: number;
  colorIndex: number;
  paint(): void;
  paintFB(action: () => void): void;
  print(text: string, scale?: number): void;
  printChar(symbol: number, scale?: number): void;
  screenSpaceX(xInPixels: number): number;
  screenSpaceY(yInPixels: number): number;
}
