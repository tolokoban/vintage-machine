import * as React from "react";

import {
  IconBook,
  Theme,
  useHotKey,
  ViewFloatingButton,
  ViewPanel,
  ViewStrip,
} from "@tolokoban/ui";

import { useMarkdown } from "./markdown";

import Styles from "./PanelManual.module.css";
import "@/font/bangers.css";
import { workbench } from "@/workbench";

const $ = Theme.classNames;

export type CompPanelManualProps = {};

export function CompPanelManual() {
  const [error, setError] = workbench.state.error.useState();
  useHotKey("escape", () => setError(null));
  const handleMount = useMarkdown();

  console.log("🚀 [PanelManual] error =", error); // @FIXME: Remove this line written on 2025-05-09 at 20:02
  if (error) {
    return (
      <ViewPanel
        fullsize
        position="absolute"
        padding="M"
        overflow="auto"
        color="error"
        className={Styles.error}
      >
        <div onClick={() => setError(null)}>
          <h1>Erreur !</h1>
          <pre>{error}</pre>
        </div>
      </ViewPanel>
    );
  }
  return (
    <ViewStrip
      template="*1"
      orientation="row"
      color="neutral-5"
      fullsize
      position="absolute"
    >
      <ViewPanel
        color="primary-5"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="column"
        padding="XS"
      >
        <ViewFloatingButton
          icon={IconBook}
          color="secondary-5"
          onClick={() => (workbench.state.manualPageId.value = "index")}
        />
      </ViewPanel>
      <ViewPanel
        className={$.join(Styles.panelManual)}
        color="neutral-5"
        padding="M"
        overflow="auto"
      >
        <div ref={handleMount}>Chargement en cours...</div>
      </ViewPanel>
    </ViewStrip>
  );
}
