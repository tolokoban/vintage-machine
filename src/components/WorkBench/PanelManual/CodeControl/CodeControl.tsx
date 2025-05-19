import * as React from "react"

import {
    IconCode,
    IconPause,
    IconPlay,
    Theme,
    useModal,
    ViewButton,
    ViewPanel,
} from "@tolokoban/ui"

import Styles from "./CodeControl.module.css"
import { workbench } from "@/workbench"
import { translations } from "@/translate"

const $ = Theme.classNames

export type CompCodeControlProps = {
    code: string
}

export function CompCodeControl({ code }: CompCodeControlProps) {
    const tr = translations()
    const modal = useModal()
    const running = workbench.state.running.useValue()
    const handleCopy = async () => {
        const confirmation = await modal.confirm({
            content: tr.confirmCopyCode,
            labelOK: tr.confirmCopyCodeYes,
            labelCancel: tr.confirmCopyCodeNo,
        })
        if (confirmation) workbench.state.code.value = code
    }

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
                <ViewButton
                    icon={IconPlay}
                    enabled={!running}
                    variant="filled"
                    onClick={() => workbench.run({ code })}
                >
                    Run
                </ViewButton>
                <ViewButton
                    icon={IconPause}
                    enabled={running}
                    variant="filled"
                    onClick={() => workbench.stop()}
                >
                    Stop
                </ViewButton>
            </ViewPanel>
            <ViewButton
                icon={IconCode}
                variant="filled"
                onClick={() => handleCopy()}
            >
                Copy
            </ViewButton>
        </ViewPanel>
    )
}
