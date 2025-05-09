import * as React from "react";

import {
  IconPause,
  IconPlay,
  Theme,
  useHotKey,
  ViewButton,
  ViewPanel,
} from "@tolokoban/ui";

import Styles from "./Menu.module.css";
import { workbench } from "@/workbench";

const $ = Theme.classNames;

export type CompMenuProps = {};

export function CompMenu(props: CompMenuProps) {
  const ready = workbench.state.ready.useValue();
  const running = workbench.state.running.useValue();
  useHotKey("f2", () => {
    if (workbench.state.running.value) return;

    workbench.run();
  });
  console.log("🚀 [Menu] running =", running); // @FIXME: Remove this line written on 2025-05-09 at 17:42

  return (
    <ViewPanel
      className={$.join(Styles.menu)}
      color="primary-5"
      padding="S"
      display="flex"
      justifyContent="space-between"
    >
      {!running && (
        <ViewButton
          enabled={ready}
          onClick={() => {
            workbench.run();
          }}
        >
          <IconPlay /> Run (F2)
        </ViewButton>
      )}
      {running && (
        <ViewButton
          enabled={ready}
          onClick={() => {
            workbench.state.running.value = false;
          }}
        >
          <IconPause /> Stop
        </ViewButton>
      )}
    </ViewPanel>
  );
}
