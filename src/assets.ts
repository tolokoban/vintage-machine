import { tgdLoadImage } from "@tolokoban/tgd";

/**
 * All assets we need at startup are available here.
 */
class Assets {
  #symbols: HTMLImageElement | null = null;

  async initialize() {
    this.#symbols = await tgdLoadImage("assets/symbols/CPC6128.png");
  }

  get symbols() {
    if (!this.#symbols)
      throw Error("[Assets] Symbols have not yet been loaded!");

    return this.#symbols;
  }
}

export const assets = new Assets();
