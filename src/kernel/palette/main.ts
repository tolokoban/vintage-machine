import { TgdTexture2D } from "@tolokoban/tgd"

export class BasikPalette {
    private readonly imageData: ImageData
    public readonly canvas: HTMLCanvasElement

    constructor(private readonly texture: TgdTexture2D) {
        this.canvas = document.createElement("canvas")
        this.canvas.width = 256
        this.canvas.height = 1
        const ctx = this.canvas.getContext("2d")
        if (!ctx)
            throw new Error("Unable to get 2D context for palette canvas!")

        this.imageData = ctx.getImageData(0, 0, 256, 1)
        this.reset()
    }

    /**
     * Set the RGB color of the pen at index `index`.
     * You must call `updateCanvas()` for the update to take effect.
     * @param index Value between 0 and 255.
     * @param red Red intensity between 0 and 15.
     * @param green Green intensity between 0 and 15.
     * @param blue Blue intensity between 0 and 15.
     * @param alpha Alpha intensity between 0 and 15.
     */
    set(index: number, red: number, green: number, blue: number, alpha = 15) {
        const { data } = this.imageData
        let ptr = index * 4
        data[ptr++] = red * 17
        data[ptr++] = green * 17
        data[ptr++] = blue * 17
        data[ptr] = alpha * 17
    }

    get(index: number): [number, number, number, number] {
        const { data } = this.imageData
        let ptr = index * 4
        const red = Math.round(data[ptr++] / 17)
        const green = Math.round(data[ptr++] / 17)
        const blue = Math.round(data[ptr++] / 17)
        const alpha = Math.round(data[ptr] / 17)
        return [red, green, blue, alpha]
    }

    updateCanvas() {
        const { canvas } = this
        const ctx = canvas.getContext("2d")
        if (!ctx)
            throw new Error("Unable to get 2D context for palette canvas!")

        ctx.putImageData(this.imageData, 0, 0)
        const [R, G, B, A] = this.get(0)
        document.body.style.setProperty(
            "--custom-monitor-color",
            `rgba(${R * 17}, ${G * 17}, ${B * 17}, ${A / 15})`
        )
        this.texture.loadBitmap(canvas)
    }

    reset() {
        const { data } = this.imageData
        for (let i = 0; i < data.length; i++) {
            data[i] = 0
        }
        const F = 15
        const H = 8
        this.set(0, 0, 0, H)
        this.set(1, 0, 0, 0)
        this.set(2, 0, 0, F)
        this.set(3, H, 0, 0)
        this.set(4, H, 0, H)
        this.set(5, H, 0, F)
        this.set(6, F, 0, 0)
        this.set(7, F, 0, H)
        this.set(8, F, 0, F)
        this.set(9, 0, H, 0)
        this.set(10, 0, H, H)
        this.set(11, 0, H, F)
        this.set(12, H, H, 0)
        this.set(13, H, H, H)
        this.set(14, H, H, F)
        this.set(15, F, H, 0)
        this.set(16, F, H, H)
        this.set(17, F, H, F)
        this.set(18, 0, F, 0)
        this.set(19, 0, F, H)
        this.set(20, 0, F, F)
        this.set(21, H, F, 0)
        this.set(22, H, F, H)
        this.set(23, H, F, F)
        this.set(24, F, F, 0)
        this.set(25, F, F, H)
        this.set(26, F, F, F)
        let index = 28
        for (let step = 1; step < 8; step++) {
            for (let color = 1; color < 27; color++) {
                const [R, G, B] = this.get(color).map(v => {
                    if (v === 0) return 0
                    if (v === H) return v - step
                    else return v - step * 2
                })
                this.set(index++, R, G, B)
            }
        }
        for (let step = 0; step < 16; step++) {
            this.set(240 + step, step, step, step)
        }
        this.updateCanvas()
    }
}
