import { BlendMode } from "../../painters/layer";
import { Kernel } from "@/kernel";
import { make } from "./_common";
import { argsAreStrings } from "@/basik/guards";

export const makeMode = (kernel: Kernel) =>
  make("MODE", argsAreStrings(1, 1), ([mode]) => {
    const ALLOWED_MODES = ["add", "alpha", "replace"];
    mode = mode.toLowerCase();
    if (!ALLOWED_MODES.includes(mode)) {
      throw new Error(
        [
          `Le mode "${mode}" est inconnu.`,
          `Les modes disponibles sont : ${ALLOWED_MODES.join(", ")}.`,
        ].join("\n"),
      );
    }
    kernel.layer.mode = mode as BlendMode;
  });
