import * as React from "react";

import { Theme } from "@tolokoban/ui";

import Styles from "./PanelMonitor.module.css";
import { workbench } from "@/workbench";

const $ = Theme.classNames;

export type CompPanelMonitorProps = {};

export function CompPanelMonitor(props: CompPanelMonitorProps) {
  const handleMount = (canvas: HTMLCanvasElement | null) => {
    // We need to delay this because the listeners are not ready yet.
    globalThis.requestAnimationFrame(() => workbench.setCanvas(canvas));
  };
  return (
    <div className={$.join(Styles.panelMonitor)}>
      <div>
        <div>
          <canvas ref={handleMount} width="64" height="48"></canvas>
        </div>
      </div>
    </div>
  );
}
