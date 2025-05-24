import * as React from "react";
import { TgdContext } from "@tolokoban/tgd";
import { IconSpaceInvader, Theme, ViewPanel } from "@tolokoban/ui";

import { CompButton } from "../Button";
import { PainterFog } from "./painter";

import Styles from "./Welcome.module.css";

const $ = Theme.classNames;

export function CompWelcome() {
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const context = new TgdContext(canvas, {
      alpha: true,
      antialias: false,
      resolution: 1,
    });
    context.add(new PainterFog(context));
    context.play();
  });
  return (
    <ViewPanel
      className={$.join(Styles.welcome)}
      position="absolute"
      color="primary-5"
      fullsize
    >
      <canvas ref={refCanvas}></canvas>
      <ViewPanel
        position="absolute"
        fullsize
        display="grid"
        placeItems="center"
      >
        <h1>TLK-74</h1>
        <h2>
          ton ordinateur personnel et rétro-futuriste
          <br />
          pour coder les jeux les plus fous
          <br />
          avec des gros pixels
        </h2>
        <CompButton onClick="#/workbench" type="start">
          <IconSpaceInvader />
          <div>Démarrer</div>
        </CompButton>
      </ViewPanel>
    </ViewPanel>
  );
}
