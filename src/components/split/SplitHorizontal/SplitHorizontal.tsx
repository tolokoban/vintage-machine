import * as React from "react";

import { Theme } from "@tolokoban/ui";

import Styles from "./SplitHorizontal.module.css";

const $ = Theme.classNames;

export type CompSplitHorizontalProps = {
  className?: string;
  children: [React.ReactNode, React.ReactNode];
};

export function CompSplitHorizontal({
  className,
  children: [left, right],
}: CompSplitHorizontalProps) {
  return (
    <div className={$.join(className, Styles.splitHorizontal)}>
      <div className={Styles.container}>{left}</div>
      <div className={Styles.container}>{right}</div>
    </div>
  );
}
