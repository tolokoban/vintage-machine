import * as React from "react";

import { Theme } from "@tolokoban/ui";

import Styles from "./Button.module.css";
import { isString } from "@tolokoban/type-guards";

const $ = Theme.classNames;

export type CompButtonProps = {
  type?: "neutral" | "start" | "stop" | "float";
  enabled?: boolean;
  children: React.ReactNode;
  onClick: string | (() => void);
};

export function CompButton({
  type = "neutral",
  enabled = true,
  children,
  onClick,
}: CompButtonProps) {
  const handleClick = isString(onClick)
    ? () => (globalThis.location.href = onClick)
    : onClick;
  return (
    <div className={$.join(Styles.button, Styles[type])}>
      <button type="button" onClick={handleClick} disabled={!enabled}>
        {children}
      </button>
    </div>
  );
}
