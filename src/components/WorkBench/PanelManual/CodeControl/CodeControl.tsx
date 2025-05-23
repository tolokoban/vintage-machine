import * as React from "react";

import {
  IconCode,
  IconPause,
  IconPlay,
  Theme,
  useModal,
  ViewPanel,
} from "@tolokoban/ui";

import Styles from "./CodeControl.module.css";
import { workbench } from "@/workbench";
import { translations } from "@/translate";
import { CompButton } from "@/components/Button";

const $ = Theme.classNames;

export type CompCodeControlProps = {
  code: string;
};

export function CompCodeControl({ code }: CompCodeControlProps) {
  const tr = translations();
  const modal = useModal();
  const running = workbench.state.running.useValue();
  const handleCopy = async () => {
    const confirmation = await modal.confirm({
      content: tr.confirmCopyCode,
      labelOK: tr.confirmCopyCodeYes,
      labelCancel: tr.confirmCopyCodeNo,
    });
    if (confirmation) workbench.state.code.value = code;
  };

  return (
    <ViewPanel
      className={$.join(Styles.codeControl)}
      fullwidth
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      fontSize="0.7em"
      margin={0}
      padding={0}
    >
      <ViewPanel display="flex" gap="S" alignItems="center">
        <CompButton
          enabled={!running}
          type="start"
          onClick={() => workbench.run({ code })}
        >
          <IconPlay />
          <div>Run</div>
        </CompButton>
        <CompButton
          type="stop"
          enabled={running}
          onClick={() => workbench.stop()}
        >
          <IconPause />
          <div>Stop</div>
        </CompButton>
      </ViewPanel>
      <CompButton onClick={() => handleCopy()}>
        <IconCode />
        <div>Copy</div>
      </CompButton>
    </ViewPanel>
  );
}
