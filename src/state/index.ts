import { GlobalState } from "./state";

let state: GlobalState | null = null;

export function initializeState(assets: { symbols: HTMLImageElement }) {
  try {
    state = new GlobalState(assets);
  } catch (ex) {
    console.error("Initialization error:", ex);
  }
}

export function getState(): GlobalState {
  if (!state) throw new Error("Global state has not been initiliazed yet!");

  return state;
}
