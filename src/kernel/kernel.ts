import { BasikValue } from "@/types"
import {
    tgdCalcModulo,
    TgdContext,
    TgdPainter,
    TgdTexture2D,
} from "@tolokoban/tgd"
import { Symbols } from "./painters/symbols/symbols"
import { PainterLayer } from "./painters/layer"
import { PainterColorizer } from "./painters/colorizer"
import { paletteMakeDefault } from "./palette/main"
import { KernelInterface } from "./types"
import { makeKernelInstructions } from "./instructions"
import { makeKernelFunctions } from "./functions"

const EMPTY_FUNCTION = () => {}
export class Kernel extends TgdPainter implements KernelInterface {
    private static ID = 0

    public readonly id = `Kernel#${Kernel.ID++}`
    public readonly LAYERS_COUNT = 1
    public readonly WIDTH = 640
    public readonly HEIGHT = 480
    public readonly CHAR_SIZE = 16
    public readonly TEXT_COLS = Math.floor(this.WIDTH / this.CHAR_SIZE)
    public readonly TEXT_ROWS = Math.floor(this.HEIGHT / this.CHAR_SIZE)
    public readonly TEXT_ORIGIN_X = (this.CHAR_SIZE - this.WIDTH) / 2
    public readonly TEXT_ORIGIN_Y = (this.CHAR_SIZE - this.HEIGHT) / 2

    public readonly painterSymbols: Symbols
    public x = (this.CHAR_SIZE - this.WIDTH) / 2
    public y = (this.CHAR_SIZE - this.HEIGHT) / 2
    public colorIndex = 24

    private readonly instructions: Record<
        string,
        (args: BasikValue[]) => void | Promise<void>
    >
    private readonly functions: Record<
        string,
        (args: BasikValue[]) => BasikValue | Promise<BasikValue>
    >
    private readonly context: TgdContext
    private readonly variables = new Map<string, BasikValue>()
    private readonly layers: PainterLayer[] = []
    private readonly textureSymbols: TgdTexture2D
    private readonly texturePalette: TgdTexture2D
    private readonly colorizer: PainterColorizer
    private canvasPalette: HTMLCanvasElement = paletteMakeDefault()
    private _currentLayerindex = 0

    constructor(canvas: HTMLCanvasElement, symbols: HTMLImageElement) {
        super()
        canvas.width = this.WIDTH
        canvas.height = this.HEIGHT
        const context = new TgdContext(canvas, {
            alpha: true,
            antialias: false,
            preserveDrawingBuffer: true,
        })
        this.context = context
        this.texturePalette = new TgdTexture2D(context).loadBitmap(
            this.canvasPalette
        )
        this.colorizer = new PainterColorizer(context, this.texturePalette)
        this.textureSymbols = new TgdTexture2D(context)
            .setParams({
                magFilter: "LINEAR",
                minFilter: "LINEAR",
                wrapS: "MIRRORED_REPEAT",
                wrapT: "MIRRORED_REPEAT",
            })
            .loadBitmap(symbols)
        for (let index = 0; index < this.LAYERS_COUNT; index++) {
            this.layers.push(new PainterLayer(context))
        }
        context.add(this)
        context.paint()
        this.painterSymbols = new Symbols(context.gl, {
            symbols: this.textureSymbols,
            screenWidth: this.WIDTH,
            screenHeight: this.HEIGHT,
        })
        this.instructions = makeKernelInstructions(this)
        this.functions = makeKernelFunctions(this)
    }

    executeInstruction(name: string, args: BasikValue[]): void | Promise<void> {
        try {
            const instruction = this.instructions[name]
            if (!instruction) {
                throw new Error(
                    `L'instruction "${name.toUpperCase()}" n'existe pas.\nLes instructions disponibles sont: ${Object.keys(
                        this.instructions
                    )
                        .sort()
                        .join(", ")}.`
                )
            }

            return instruction(args)
        } catch (ex) {
            const msg = ex instanceof Error ? ex.message : JSON.stringify(ex)
            throw new Error(
                `Erreur de l'instruction ${name.toUpperCase()} :\n${msg}`
            )
        }
    }

    executeFunction(
        name: string,
        args: BasikValue[]
    ): BasikValue | Promise<BasikValue> {
        try {
            const func = this.functions[name]
            if (!func) {
                throw new Error(
                    `La fonction "${name.toUpperCase()}" n'existe pas.\nLes fonctions disponibles sont: ${Object.keys(
                        this.functions
                    )
                        .sort()
                        .join(", ")}.`
                )
            }

            return func(args)
        } catch (ex) {
            const msg = ex instanceof Error ? ex.message : JSON.stringify(ex)
            throw new Error(
                `Erreur de la fonction ${name.toUpperCase()} :\n${msg}`
            )
        }
    }

    get currentLayerIndex() {
        return this._currentLayerindex
    }
    set currentLayerIndex(value: number) {
        value =
            this.LAYERS_COUNT === 1
                ? 0
                : tgdCalcModulo(Math.round(value), 0, this.LAYERS_COUNT - 1)
        this._currentLayerindex = value
    }

    get layer() {
        return this.layers[this.currentLayerIndex]
    }

    delete(): void {
        for (const layer of this.layers) {
            layer.delete()
        }
        this.painterSymbols.delete()
        this.textureSymbols.delete()
    }

    paint(): void {
        const { context, colorizer } = this
        const { gl } = context
        console.log("PAINT")
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        for (const layer of this.layers) {
            colorizer.paint(layer.texture)
        }
    }

    paintFB(action: () => void = EMPTY_FUNCTION) {
        this.layer.paint(action)
    }

    print(text: string) {
        this.paintFB(() => {
            for (const char of text.split("")) {
                const sym = char.charCodeAt(0)
                const val = sym & 0xff
                const col = val & 0xf
                const row = (val - col) >> 4
                this.painterSymbols.paint({
                    screenX: this.x,
                    screenY: this.y,
                    symbolX: col * this.CHAR_SIZE,
                    symbolY: row * this.CHAR_SIZE,
                    color: this.colorIndex,
                })
                this.x += this.CHAR_SIZE
                if (this.x >= this.WIDTH / 2) {
                    this.x = this.TEXT_ORIGIN_X
                    this.y += this.CHAR_SIZE
                }
            }
        })
    }

    getVar(name: string) {
        name = name.toUpperCase()
        if (!this.variables.has(name)) {
            throw new Error(`La variable $${name} n'existe pas.`)
        }
        return this.variables.get(name) ?? 0
    }

    setVar(name: string, value: BasikValue) {
        this.variables.set(name.toUpperCase(), value)
    }

    debugVariables() {
        for (const key of this.variables.keys()) {
            console.log(key, "=", this.getVar(key))
        }
    }

    test() {
        this.paintFB(() => {
            this.painterSymbols.paint({
                color: 4,
                screenX: 0,
                screenY: 0,
                symbolX: 0,
                symbolY: 0,
                width: 512,
                height: 512,
            })
        })
    }
}
