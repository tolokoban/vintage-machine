import * as React from "react";

import { Theme, ViewStrip } from "@tolokoban/ui";

import Styles from "./PanelEditor.module.css";
import { CompMenu } from "./Menu";
import { CompEditor } from "./Editor";

const $ = Theme.classNames;

export type CompPanelEditorProps = {};

export function CompPanelEditor(props: CompPanelEditorProps) {
  return (
    <ViewStrip
      template="*1"
      orientation="column"
      className={$.join(Styles.panelEditor)}
      fullsize
    >
      <CompMenu />
      <CompEditor />
    </ViewStrip>
  );
}
