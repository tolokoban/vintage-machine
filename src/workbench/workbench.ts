import { Kernel } from "@/kernel";
import { assets } from "@/assets";
import { state } from "./state";
import { workbench } from ".";
import { isString } from "@tolokoban/type-guards";
import { createBasikAssembly } from "@/basik/asm";

export class Workbench {
  public readonly state = state;

  private canvas: HTMLCanvasElement | null = null;
  private kernel: Kernel | null = null;

  constructor() {
    state.running.value = false;
  }

  setCanvas(canvas: HTMLCanvasElement | null) {
    if (canvas === this.canvas) return;

    this.kernel?.delete();
    this.canvas = canvas;
    if (canvas) {
      this.kernel = new Kernel(canvas, assets.symbols);
    }
  }

  async run({
    fullscreen = false,
    code,
  }: Partial<{ code: string; fullscreen: boolean }> = {}) {
    const { kernel } = this;
    if (!kernel) return;

    try {
      if (fullscreen) kernel.fullscreenRequest();
      workbench.state.error.value = null;
      workbench.state.running.value = true;
      const asm = createBasikAssembly(kernel);
      await asm.execute(code ?? this.state.code.value);
    } catch (ex) {
      console.error(ex);
      const message: string = isString(ex)
        ? ex
        : ex instanceof Error
          ? ex.message
          : JSON.stringify(ex);
      workbench.state.error.value = message;
    } finally {
      workbench.state.running.value = false;
      if (fullscreen) kernel.fullscreenExit();
    }
  }

  async share() {
    const { href } = globalThis.location;
    const index = href.lastIndexOf("#");
    const url = `${index > 0 ? href.slice(0, index) : href}#/run/${compressCode(workbench.state.code.value)}`;

    if (navigator.share) {
      navigator.share({
        title: "TLK-74",
        text: "Mon programme",
        url,
      });
    } else {
      globalThis.open(url, "_blank_");
    }
  }
}

function compressCode(value: string) {
  return btoa(value);
}
