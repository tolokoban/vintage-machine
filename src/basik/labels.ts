import { ByteCode } from "./asm/asm";

export class Labels {
  private counter = 0;
  private readonly labels = new Map<string, number>();
  private readonly links: Array<{ cursor: number; label: string }> = [];

  reset() {
    this.labels.clear();
    this.links.splice(0, this.links.length);
    this.counter = 0;
  }

  create(name = "") {
    const label = `:${this.counter++}:${name}`;
    return label;
  }

  stick(label: string, cursor: number) {
    this.labels.set(label, cursor);
  }

  link(cursor: number, label: string) {
    this.links.push({ cursor, label });
  }

  apply(bytecode: ByteCode[]) {
    for (const { cursor, label } of this.links) {
      const pointer = this.labels.get(label);
      if (pointer === undefined) {
        throw Error(`Label not found: ${label}`);
      }
      bytecode[cursor].val = pointer;
    }
  }

  getLabelAtCursor(cursor: number) {
    for (const [label, pointer] of this.labels.entries()) {
      if (pointer === cursor) return label;
    }
    return "";
  }

  getLinkAtCursor(cursor: number) {
    for (const { label, cursor: pointer } of this.links) {
      if (pointer === cursor) return label;
    }
    return null;
  }

  getLabelsMaxLength() {
    let size = 0;
    for (const key of this.labels.keys()) {
      size = Math.max(size, key.length);
    }
    return size;
  }
}
