import { EditorState } from "@codemirror/state"
import {
    EditorView,
    keymap,
    lineNumbers,
    highlightActiveLineGutter,
} from "@codemirror/view"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"

export function createCodeEditor(container: HTMLElement) {
    const startState = EditorState.create({
        doc: "",
        extensions: [
            keymap.of([...defaultKeymap, ...historyKeymap]),
            lineNumbers(),
            highlightActiveLineGutter(),
            history(),
        ],
    })
    container.textContent = ""
    const view = new EditorView({
        state: startState,
        parent: container,
    })
    return view
}
