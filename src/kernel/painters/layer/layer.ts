import { PainterFramebuffer } from "./framebuffer";
import {
  TgdContext,
  TgdPainterStateOptions,
  TgdTexture2D,
  webglPresetBlend,
} from "@tolokoban/tgd";

export type BlendMode = "replace" | "alpha" | "add";

const BLEND_MODES: Record<BlendMode, Partial<TgdPainterStateOptions>> = {
  replace: {
    blend: webglPresetBlend.off,
  },
  alpha: {
    blend: webglPresetBlend.alpha,
  },
  add: {
    blend: webglPresetBlend.add,
  },
};

export class PainterLayer {
  public mode: BlendMode = "alpha";
  private action: () => void = EMPTY_FUNCTION;
  private readonly textures: [TgdTexture2D, TgdTexture2D];
  private readonly framebuffers: [PainterFramebuffer, PainterFramebuffer];
  private currentFramebufferIndex = 0;

  constructor(private readonly context: TgdContext) {
    const tex0 = new TgdTexture2D(context);
    const tex1 = new TgdTexture2D(context);
    this.textures = [tex0, tex1];
    for (const tex of this.textures) {
      tex.setParams({
        magFilter: "NEAREST",
        minFilter: "NEAREST",
        wrapS: "REPEAT",
        wrapT: "REPEAT",
      });
    }
    const action = this.applyAction;
    this.framebuffers = [
      new PainterFramebuffer(context, tex1, tex0, action),
      new PainterFramebuffer(context, tex0, tex1, action),
    ];
  }

  get blend() {
    return BLEND_MODES[this.mode];
  }

  get texture(): TgdTexture2D {
    return this.textures[this.currentFramebufferIndex];
  }

  private swap() {
    this.currentFramebufferIndex = 1 - this.currentFramebufferIndex;
  }

  delete(): void {
    for (const tex of this.textures) {
      tex.delete();
    }
    for (const fb of this.framebuffers) {
      fb.delete();
    }
  }

  paint(action: () => void = EMPTY_FUNCTION): void {
    this.swap();
    this.action = action;
    const fb = this.framebuffers[this.currentFramebufferIndex];
    fb.paint(0, 0);
  }

  scroll(scrollX: number, scrollY: number) {
    this.swap();
    this.action = EMPTY_FUNCTION;
    const fb = this.framebuffers[this.currentFramebufferIndex];
    fb.scrollX = scrollX;
    fb.scrollY = scrollY;
    fb.paint(0, 0);
    fb.scrollX = 0;
    fb.scrollY = 0;
  }

  private readonly applyAction = () => {
    this.action();
  };
}

const EMPTY_FUNCTION = () => {};
