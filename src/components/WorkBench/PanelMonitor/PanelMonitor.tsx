import * as React from "react";

import { Theme } from "@tolokoban/ui";

import Styles from "./PanelMonitor.module.css";
import { workbench } from "@/workbench";

const $ = Theme.classNames;

export type CompPanelMonitorProps = {};

export function CompPanelMonitor(props: CompPanelMonitorProps) {
  const handleMount = (canvas: HTMLCanvasElement | null) => {
    workbench.setCanvas(canvas);
    workbench.state.ready.value = true;
  };
  return (
    <div className={$.join(Styles.panelMonitor)}>
      <canvas ref={handleMount} width="64" height="48"></canvas>
    </div>
  );
}
