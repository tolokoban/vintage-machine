import { Kernel } from "@/kernel";
import { assets } from "@/assets";
import { state } from "./state";
import { BasikAssembly } from "@/basik/asm";
import { workbench } from ".";
import { isString } from "@tolokoban/type-guards";

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

  async run() {
    const { kernel } = this;
    if (!kernel) return;

    try {
      workbench.state.error.value = null;
      workbench.state.running.value = true;
      const asm = new BasikAssembly(kernel);
      await asm.execute(this.state.code.value);
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
    }
  }
}
