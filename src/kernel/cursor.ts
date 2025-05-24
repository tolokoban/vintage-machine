import { Kernel } from "./kernel";

export class Cursor {
  private timeout = 0;
  private isOn = false;

  constructor(private readonly kernel: Kernel) {}

  show() {
    globalThis.clearTimeout(this.timeout);
    this.on();
  }

  hide() {
    globalThis.clearTimeout(this.timeout);
    if (this.isOn) {
      this.off();
      globalThis.clearTimeout(this.timeout);
    }
  }

  private readonly on = () => {
    globalThis.clearTimeout(this.timeout);
    this.isOn = true;
    this.kernel.printChar(0x8f);
    this.kernel.paint();
    this.timeout = globalThis.setTimeout(this.off, 500) as unknown as number;
  };

  private readonly off = () => {
    globalThis.clearTimeout(this.timeout);
    this.isOn = false;
    const color = this.kernel.colorIndex;
    this.kernel.colorIndex = 0;
    this.kernel.printChar(0x8f);
    this.kernel.paint();
    this.kernel.colorIndex = color;
    this.timeout = globalThis.setTimeout(this.on, 500) as unknown as number;
  };
}
