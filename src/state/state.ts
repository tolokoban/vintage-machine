import { EditorView } from "codemirror"

import { createCodeEditor } from "../editor"
import { Kernel } from "../kernel"
import { Help } from "../help"
import { BasikAssembly } from "../basik/asm"

export class GlobalState {
    public readonly asm: BasikAssembly
    public readonly help: Help
    public readonly kernel: Kernel
    public readonly editor: EditorView

    constructor(assets: { symbols: HTMLImageElement }) {
        this.help = new Help(this.get("HELP"))
        const canvas = this.get<HTMLCanvasElement>("CANVAS")
        this.kernel = new Kernel(canvas, assets.symbols)
        const editor = createCodeEditor(this.get("CODE"))
        this.editor = editor
        const asm = new BasikAssembly(this.kernel)
        this.asm = asm
        this.code =
            globalThis.localStorage.getItem("Basik/current") ??
            "# Tape ton code ici...\n\n"
        // Clicking on index brings the index documentation page.
        this.get("index").addEventListener("click", (evt: MouseEvent) => {
            evt.preventDefault()
            evt.stopPropagation()
            this.help.load("index")
        })
        globalThis.document.addEventListener(
            "keydown",
            (evt: KeyboardEvent) => {
                if (evt.key === "F1") {
                    evt.preventDefault()
                    evt.stopPropagation()
                    this.switchRuntimeAndCodeViews()
                    return
                }
                if (evt.key === "F4" || (evt.key === "Enter" && evt.ctrlKey)) {
                    evt.preventDefault()
                    evt.stopPropagation()
                    this.executeCurrentCode()
                    return
                }
                console.log("🚀 [index] evt.key =", evt.key) // @FIXME: Remove this line written on 2025-05-03 at 20:58
            }
        )
        this.get("ERROR-BUTTON").addEventListener(
            "click",
            (evt: MouseEvent) => {
                evt.preventDefault()
                evt.stopPropagation()
                this.get("ERROR").removeAttribute("open")
            }
        )
    }

    get code() {
        return this.editor.state.doc.toString()
    }
    set code(code: string) {
        this.editor.dispatch({
            changes: { from: 0, to: this.code.length, insert: code },
        })
    }

    async executeCurrentCode() {
        try {
            globalThis.localStorage.setItem("Basik/current", this.code)
            this.showRuntimeView()
            await this.asm.execute(this.code)
        } catch (ex) {
            const msg =
                ex instanceof Error
                    ? ex.message
                    : JSON.stringify(ex, null, "  ")
            console.error("Runtime error:", ex)
            this.get("ERROR").setAttribute("open", "true")
            this.get("ERROR-MESSAGE").textContent = msg
        }
    }

    /**
     * Switch between code and runtime views.
     */
    switchRuntimeAndCodeViews() {
        globalThis.document.body.classList.toggle("show")
    }

    showRuntimeView() {
        globalThis.document.body.classList.remove("show")
    }

    get<T extends HTMLElement = HTMLElement>(id: string): T {
        const elem = globalThis.document.getElementById(id)
        if (!elem) throw new Error(`Unable to find an element with id #${id}!`)

        return elem as T
    }
}
