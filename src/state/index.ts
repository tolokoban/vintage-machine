import { GlobalState } from "./state"

let state: GlobalState | null = null

export function initializeState(assets: { symbols: HTMLImageElement }) {
    state = new GlobalState(assets)
}

export function getState(): GlobalState {
    if (!state) throw new Error("Global state has not been initiliazed yet!")

    return state
}
