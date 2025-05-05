import { BasikValue } from "@/types";
import { TgdPainter } from "@tolokoban/tgd";
export declare class Kernel extends TgdPainter {
    static readonly LAYERS_COUNT = 1;
    static readonly WIDTH = 640;
    static readonly HEIGHT = 480;
    private readonly context;
    private readonly variables;
    private readonly layersSwaps;
    private readonly layersIndexes;
    private readonly framebuffer;
    private _currentLayer;
    constructor(canvas: HTMLCanvasElement, symbols: ArrayBuffer);
    get currentLayer(): number;
    set currentLayer(value: number);
    delete(): void;
    paint(time: number, delay: number): void;
    private readonly paintLayer;
    getVar(name: string): BasikValue;
    setVar(name: string, value: BasikValue): void;
    debugVariables(): void;
}
//# sourceMappingURL=kernel.d.ts.map