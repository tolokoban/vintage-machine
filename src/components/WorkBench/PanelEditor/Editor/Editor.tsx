import * as React from "react";
import Editor from "react-simple-code-editor";

import { Theme } from "@tolokoban/ui";

import { workbench } from "@/workbench";
import { BasikLexer } from "@/basik/lexer";

import Styles from "./Editor.module.css";

const $ = Theme.classNames;

export type CompEditorProps = {};

export function CompEditor(props: CompEditorProps) {
  const [code, setCode] = workbench.state.code.useState();
  return (
    <div className={$.join(Styles.editor)}>
      <Editor
        value={code}
        onValueChange={setCode}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          //   fontSize: 12,
        }}
        highlight={highlight}
      ></Editor>
    </div>
  );
}

function highlight(code: string) {
  const lexer = new BasikLexer(code);
  return lexer.highlight();
}
