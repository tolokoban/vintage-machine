import * as React from "react";

import { Theme } from "@tolokoban/ui";

import Styles from "./WorkBench.module.css";
import { CompSplitHorizontal } from "../split/SplitHorizontal";
import { CompSplitVertical } from "../split/SplitVertical";
import { CompPanelEditor } from "./PanelEditor";
import { CompPanelMonitor } from "./PanelMonitor";
import { CompPanelManual } from "./PanelManual";

const $ = Theme.classNames;

export type CompWorkBenchProps = {};

export function CompWorkBench(props: CompWorkBenchProps) {
  return (
    <CompSplitHorizontal className={$.join(Styles.workBench)}>
      <CompSplitVertical>
        <CompPanelMonitor />
        <CompPanelManual />
      </CompSplitVertical>
      <CompPanelEditor />
    </CompSplitHorizontal>
  );
}
