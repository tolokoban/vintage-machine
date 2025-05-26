import * as React from "react"
import Editor from "react-simple-code-editor"

import { Theme } from "@tolokoban/ui"

import { workbench } from "@/workbench"
import { BasikLexer } from "@/basik/lexer"

import Styles from "./Editor.module.css"

const $ = Theme.classNames

export type CompEditorProps = {}

export function CompEditor(props: CompEditorProps) {
    const [code, setCode] = workbench.state.code.useState()
    return (
        <div className={$.join(Styles.editor)}>
            <div className={Styles.twoColumns}>
                <div className={Styles.lineNumbers}>
                    {code
                        .split("\n")
                        .map((_, lineNum) =>
                            `${lineNum + 1}.\n`.padStart(7, " ")
                        )}
                </div>
                <Editor
                    value={code}
                    onValueChange={setCode}
                    padding={10}
                    highlight={highlight}
                ></Editor>
            </div>
        </div>
    )
}

function highlight(code: string) {
    const lexer = new BasikLexer(code)
    return lexer.highlight()
}
