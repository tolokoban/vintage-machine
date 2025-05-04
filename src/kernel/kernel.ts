export class Kernel {
    static readonly WIDTH = 640
    static readonly HEIGHT = 480

    constructor(canvas: HTMLCanvasElement, symbols: ArrayBuffer) {
        canvas.width = Kernel.WIDTH
        canvas.height = Kernel.HEIGHT
        
    }
}