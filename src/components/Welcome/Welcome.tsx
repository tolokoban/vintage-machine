import * as React from "react";

import { Theme, ViewButton, ViewPanel } from "@tolokoban/ui";

import Styles from "./Welcome.module.css";

const $ = Theme.classNames;

export function CompWelcome() {
  return (
    <ViewPanel
      className={$.join(Styles.welcome)}
      position="absolute"
      color="primary-5"
      fullsize
      display="grid"
      placeItems="center"
    >
      <h1>TLK-74 : ton ordinateur personnel et rétro-futuriste</h1>
      <ViewButton onClick="#/workbench">Accéder à ton atelier</ViewButton>
    </ViewPanel>
  );
}
