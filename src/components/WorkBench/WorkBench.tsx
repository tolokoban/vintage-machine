import * as React from "react"

import { Theme } from "@tolokoban/ui"

import { CompSplitHorizontal } from "../split/SplitHorizontal"
import { CompSplitVertical } from "../split/SplitVertical"
import { CompPanelEditor } from "./PanelEditor"
import { CompPanelMonitor } from "./PanelMonitor"
import { CompPanelManual } from "./PanelManual"

import Styles from "./WorkBench.module.css"
import { workbench } from "@/workbench"

const $ = Theme.classNames

export function CompWorkBench() {
    const focusOnManual = workbench.state.focusOnManual.useValue()

    return (
        <CompSplitHorizontal className={$.join(Styles.workBench)}>
            <CompSplitVertical>
                <CompPanelMonitor />
                {focusOnManual ? <CompPanelEditor /> : <CompPanelManual />}
            </CompSplitVertical>
            {focusOnManual ? <CompPanelManual /> : <CompPanelEditor />}
        </CompSplitHorizontal>
    )
}
