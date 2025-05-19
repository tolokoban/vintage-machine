import { BasikValue } from "@/types"
import {
    tgdCalcModulo,
    TgdContext,
    tgdFullscreenExit,
    tgdFullscreenRequest,
    TgdInputPointerEventMove,
    TgdPainter,
    TgdTexture2D,
} from "@tolokoban/tgd"
import { Symbols } from "./painters/symbols/symbols"
import { PainterLayer } from "./painters/layer"
import { PainterColorizer } from "./painters/colorizer"
import { BasikPalette } from "./palette/main"
import { KernelInterface } from "./types"
import { makeKernelInstructions } from "./instructions/procedures"
import { makeKernelFunctions } from "./instructions/functions"
import { PainterDisk } from "./painters/disk"
import { PainterRect } from "./painters/rect"

const EMPTY_FUNCTION = () => {}
export class Kernel extends TgdPainter implements KernelInterface {
    private static ID = 0

    public readonly id = `Kernel#${Kernel.ID++}`
    public readonly LAYERS_COUNT = 3
    public readonly WIDTH = 640
    public readonly HEIGHT = 480
    public readonly CHAR_SIZE = 16
    public readonly TEXT_COLS = Math.floor(this.WIDTH / this.CHAR_SIZE)
    public readonly TEXT_ROWS = Math.floor(this.HEIGHT / this.CHAR_SIZE)
    public readonly TEXT_ORIGIN_X = (this.CHAR_SIZE - this.WIDTH) / 2
    public readonly TEXT_ORIGIN_Y = (this.CHAR_SIZE - this.HEIGHT) / 2

    public readonly palette: BasikPalette
    public readonly painterSymbols: Symbols
    public readonly painterDisk: PainterDisk
    public readonly painterRect: PainterRect
    public x = (this.CHAR_SIZE - this.WIDTH) / 2
    public y = (this.CHAR_SIZE - this.HEIGHT) / 2
    public colorIndex = 24

    private readonly procedures: Record<
        string,
        (args: BasikValue[]) => void | Promise<void>
    >
    private readonly functions: Record<
        string,
        (args: BasikValue[]) => BasikValue | Promise<BasikValue>
    >
    private readonly context: TgdContext
    private readonly variablesStack = [new Map<string, BasikValue>()]
    /**
     * The user can defined functions, but not procedures.
     * But those functions can be called as procedures.
     * In this case, we need to get rid of what the function
     * returns.
     */
    private readonly subroutineCleanupFunctions: Array<(() => void) | null> = []
    private readonly layers: PainterLayer[] = []
    private readonly textureSymbols: TgdTexture2D
    private readonly texturePalette: TgdTexture2D
    private readonly colorizer: PainterColorizer
    private _currentLayerindex = 1
    private _mouseX = 0
    private _mouseY = 0

    constructor(
        private readonly canvas: HTMLCanvasElement,
        symbols: HTMLImageElement
    ) {
        super()
        canvas.width = this.WIDTH
        canvas.height = this.HEIGHT
        canvas.style.aspectRatio = `${this.WIDTH}/${this.HEIGHT}`
        const context = new TgdContext(canvas, {
            alpha: true,
            antialias: false,
            preserveDrawingBuffer: true,
            onResize(context, width, height) {},
        })
        this.context = context
        this.painterDisk = new PainterDisk(context)
        this.painterRect = new PainterRect(context)
        this.texturePalette = new TgdTexture2D(context)
        this.palette = new BasikPalette(this.texturePalette)
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
        this.procedures = makeKernelInstructions(this)
        this.functions = makeKernelFunctions(this)
        this.reset()
        context.inputs.pointer.eventMove.addListener(this.handleMouseMove)
    }

    get mouseX() {
        return this._mouseX
    }

    get mouseY() {
        return this._mouseY
    }

    get allVarNames() {
        return Array.from(this.variables.keys())
    }

    get proceduresNames(): string[] {
        return Object.keys(this.procedures).sort()
    }

    get functionsNames(): string[] {
        return Object.keys(this.functions).sort()
    }

    hasFunction(name: string) {
        return this.functions[name.trim().toUpperCase()] !== undefined
    }

    async reset() {
        this.variables.clear()
        this.palette.reset()
        this.colorIndex = 24
        for (
            let currentLayerIndex = 0;
            currentLayerIndex < this.LAYERS_COUNT;
            currentLayerIndex++
        ) {
            this.paintFB(() => {
                const { gl } = this
                this.currentLayerIndex = currentLayerIndex
                gl.clearColor(0, 0, 0, 1)
                gl.clear(gl.COLOR_BUFFER_BIT)
            })
        }
        this.currentLayerIndex = 0
        this.x = this.TEXT_ORIGIN_X
        this.y = this.TEXT_ORIGIN_Y
        this.paint()
    }

    fullscreenRequest() {
        const { canvas } = this
        tgdFullscreenRequest(canvas.parentElement)
    }

    fullscreenExit() {
        tgdFullscreenExit()
    }

    sound(
        frequencyInHerz: number,
        durationInSeconds: number,
        waveType: "sine" | "square" | "sawtooth" | "triangle" = "sine"
    ) {
        if (!globalThis.AudioContext) return

        const context = new globalThis.AudioContext()
        const osc = context.createOscillator()
        const gain = context.createGain()
        gain.connect(context.destination)
        osc.connect(gain)
        osc.type = waveType
        osc.frequency.value = frequencyInHerz
        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            context.currentTime + durationInSeconds
        )
        osc.start()
        osc.stop(context.currentTime + durationInSeconds)
    }

    music(score: string) {}

    get gl() {
        return this.context.gl
    }

    screenSpaceX(xInPixels: number): number {
        return (xInPixels * 2) / this.WIDTH
    }

    screenSpaceY(yInPixels: number): number {
        return (yInPixels * 2) / this.HEIGHT
    }

    async executeProcedure(name: string, args: BasikValue[]): Promise<boolean> {
        try {
            const instruction = this.procedures[name]
            if (!instruction) {
                return false
            }

            await instruction(args)
            return true
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
        value = tgdCalcModulo(Math.round(value), 0, this.LAYERS_COUNT - 1)
        this._currentLayerindex = value
    }

    get layer() {
        return this.layers[this.currentLayerIndex]
    }

    delete(): void {
        for (const layer of this.layers) {
            layer.delete()
        }
        this.painterDisk.delete()
        this.painterSymbols.delete()
        this.textureSymbols.delete()
    }

    paint(): void {
        try {
            const { context, colorizer } = this
            const { gl } = context
            console.log("PAINT")
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            for (const layer of this.layers) {
                colorizer.paint(layer)
            }
        } catch (ex) {
            console.error("Error while painting:", ex)
        }
    }

    paintFB(action: () => void = EMPTY_FUNCTION) {
        this.layer.paint(action)
    }

    print(text: string, scale = 1) {
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
                    colorIndex: this.colorIndex,
                    scale,
                })
                this.x += this.CHAR_SIZE * scale
                if (this.x >= this.WIDTH / 2) {
                    this.x = this.TEXT_ORIGIN_X
                    this.y += this.CHAR_SIZE * scale
                }
            }
        })
    }

    printChar(sym: number, scale = 1) {
        this.paintFB(() => {
            const val = sym & 0xff
            const col = val & 0xf
            const row = (val - col) >> 4
            this.painterSymbols.paint({
                screenX: this.x,
                screenY: this.y,
                symbolX: col * this.CHAR_SIZE,
                symbolY: row * this.CHAR_SIZE,
                colorIndex: this.colorIndex,
                scale,
            })
        })
    }

    getVar(name: string) {
        name = sanitizeVarName(name)
        if (!this.variables.has(name)) {
            const output = [
                `La variable $${name.toLocaleLowerCase()} n'existe pas.`,
            ]
            const names = Array.from(this.variables.keys()).map(
                name => `$${name.toLocaleLowerCase()}`
            )
            if (names.length === 0) {
                output.push("Aucune variable n'a encore été créée.")
            } else if (names.length === 1) {
                output.push(
                    `La seule variable existante maintenant est ${names[0]}.`
                )
            } else {
                output.push(
                    `Les variables disponibles sont : ${names.join("\n")}`
                )
            }
            throw new Error(output.join("\n"))
        }
        return this.variables.get(name) ?? 0
    }

    setVar(name: string, value: BasikValue) {
        this.variables.set(sanitizeVarName(name), value)
    }

    debugVariables() {
        for (const key of this.variables.keys()) {
            console.log(key, "=", this.getVar(key))
        }
    }

    subroutineEnter(
        varNames: string[],
        varValues: BasikValue[],
        cleanupFunction: (() => void) | null
    ) {
        this.subroutineCleanupFunctions.push(cleanupFunction)
        const variables = new Map<string, BasikValue>()
        this.variablesStack.push(variables)
        for (let i = 0; i < varNames.length; i++) {
            this.setVar(varNames[i], varValues[i] ?? 0)
        }
    }

    subroutineExit() {
        this.variablesStack.pop()
        const cleanupFunction = this.subroutineCleanupFunctions.pop()
        cleanupFunction?.()
    }

    test() {
        this.paintFB(() => {
            this.painterSymbols.paint({
                colorIndex: 4,
                screenX: 0,
                screenY: 0,
                symbolX: 0,
                symbolY: 0,
                width: 512,
                height: 512,
            })
        })
    }

    private get variables(): Map<string, BasikValue> {
        const v = this.variablesStack.at(-1)
        if (!v) throw Error("Nothing left on the variables stack!")

        return v
    }

    private handleMouseMove = (evt: TgdInputPointerEventMove) => {
        this._mouseX = (evt.current.x * this.WIDTH) / 2
        this._mouseY = (-evt.current.y * this.HEIGHT) / 2
    }
}

function sanitizeVarName(name: string) {
    const varName = (name.startsWith("$") ? name.slice(1) : name).toUpperCase()
    return varName
}
