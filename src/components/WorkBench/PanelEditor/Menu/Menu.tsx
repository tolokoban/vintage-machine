import * as React from "react"

import {
    IconFullscreen,
    IconPause,
    IconPlay,
    IconSpaceInvader,
    Theme,
    useHotKey,
    ViewButton,
    ViewPanel,
} from "@tolokoban/ui"

import { workbench } from "@/workbench"

import Styles from "./Menu.module.css"

const $ = Theme.classNames

export type CompMenuProps = {}

export function CompMenu(props: CompMenuProps) {
    const ready = workbench.state.ready.useValue()
    const running = workbench.state.running.useValue()
    useHotKey("f2", () => {
        if (workbench.state.running.value) return

        workbench.run()
    })
    useHotKey("f3", () => {
        if (workbench.state.running.value) return

        workbench.run({ fullscreen: true })
    })
    console.log("🚀 [Menu] running, ready =", running, ready) // @FIXME: Remove this line written on 2025-05-09 at 17:42
    console.log(
        "🚀 [Menu] workbench.state.ready.value =",
        workbench.state.ready.value
    ) // @FIXME: Remove this line written on 2025-05-13 at 09:33

    return (
        <ViewPanel
            className={$.join(Styles.menu)}
            color="primary-5"
            padding="S"
            display="flex"
            justifyContent="space-between"
        >
            {!running && (
                <>
                    <ViewButton
                        enabled={ready}
                        onClick={() => {
                            workbench.run()
                        }}
                    >
                        <IconPlay /> Run (F2)
                    </ViewButton>
                    <ViewButton
                        enabled={ready}
                        onClick={() => {
                            workbench.run({ fullscreen: true })
                        }}
                    >
                        <IconFullscreen /> Fullscreen (F3)
                    </ViewButton>
                    <ViewButton
                        enabled={ready}
                        onClick={() => {
                            workbench.share()
                        }}
                    >
                        <IconSpaceInvader /> Share
                    </ViewButton>
                </>
            )}
            {running && (
                <ViewButton
                    enabled={ready}
                    onClick={() => {
                        workbench.state.running.value = false
                    }}
                >
                    <IconPause /> Stop
                </ViewButton>
            )}
        </ViewPanel>
    )
}
