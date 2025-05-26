import {
    TgdContext,
    TgdPainter,
    TgdPainterFramebuffer,
    TgdTexture2D,
} from "@tolokoban/tgd"
import { PainterSurface } from "./surface"

/**
 * PainterFramebuffer will first copy `textureRead` onto `textureWrite`.
 * Then it will call `action()` to display something more on `textureWrite`.
 */
export class PainterFramebuffer extends TgdPainter {
    public scrollX = 0
    public scrollY = 0
    private readonly framebuffer: TgdPainterFramebuffer
    private readonly surface: PainterSurface

    constructor(
        context: TgdContext,
        textureRead: TgdTexture2D,
        textureWrite: TgdTexture2D,
        action: () => void
    ) {
        super()
        this.surface = new PainterSurface(context, textureRead, action)
        this.framebuffer = new TgdPainterFramebuffer(context, {
            textureColor0: textureWrite,
            children: [this.surface],
        })
    }

    delete(): void {
        this.surface.delete()
        this.framebuffer.delete()
    }

    paint(time: number, delay: number): void {
        this.surface.scrollX = this.scrollX * 0.5
        this.surface.scrollY = this.scrollY * 0.5
        this.framebuffer.paint(time, delay)
    }
}
