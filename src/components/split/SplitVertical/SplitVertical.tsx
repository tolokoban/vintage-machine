import * as React from "react";

import { Theme } from "@tolokoban/ui";

import Styles from "./SplitVertical.module.css";

const $ = Theme.classNames;

export type CompSplitVerticalProps = {
  className?: string;
  children: [React.ReactNode, React.ReactNode];
};

export function CompSplitVertical({
  className,
  children: [top, bottom],
}: CompSplitVerticalProps) {
  return (
    <div className={$.join(className, Styles.splitVertical)}>
      <div className={Styles.container}>{top}</div>
      <div className={Styles.container}>{bottom}</div>
    </div>
  );
}
