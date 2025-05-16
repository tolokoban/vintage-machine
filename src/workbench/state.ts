import AtomicState from "@tolokoban/react-state";
import { isBoolean, isString } from "@tolokoban/type-guards";

export const state = {
  lang: new AtomicState<string>("fr", {
    storage: { id: "TLK-74/lang", guard: isString },
    transform(value) {
      return value.slice(0, 2).toLocaleLowerCase();
    },
  }),
  error: new AtomicState<string | null>(null),
  ready: new AtomicState(false),
  running: new AtomicState(false),
  focusOnManual: new AtomicState(true, {
    storage: { id: "TLK-74/focusOnManual", guard: isBoolean },
  }),
  code: new AtomicState(
    ["REM Ceci est un commentaire", `PRINT("Bonjour le monde !")`].join("\n"),
    {
      storage: {
        id: "TLK-74/Basik/current",
        guard: isString,
      },
    },
  ),
  manualPageId: new AtomicState("index", {
    storage: {
      id: "TLK-74/Manual/current",
      guard: isString,
    },
  }),
};
