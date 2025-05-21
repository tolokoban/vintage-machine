import * as React from "react"
import FileSaver from "file-saver"

import {
    IconExport,
    IconFullscreen,
    IconImport,
    IconPause,
    IconPlay,
    IconSpaceInvader,
    Theme,
    useHotKey,
    ViewButton,
    ViewInputFile,
    ViewPanel,
} from "@tolokoban/ui"

import { workbench } from "@/workbench"

import Styles from "./Menu.module.css"
import { isString } from "@tolokoban/type-guards"

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

    const handleLoad = (files: File[]) => {
        const [file] = files
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const { result } = reader
            if (isString(result)) workbench.state.code.value = result
        }
        reader.onerror = () => {
            console.error("Unable to read the file...")
        }
        reader.readAsText(file)
    }
    const handleSave = () => {
        FileSaver.saveAs(
            new Blob([workbench.state.code.value], {
                type: "text/plain;charset=utf-8",
            }),
            "tlk74.basik"
        )
    }

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
                    <ViewInputFile
                        onLoad={handleLoad}
                        icon={IconImport}
                        accept=".basik"
                    >
                        Load
                    </ViewInputFile>
                    <ViewButton icon={IconExport} onClick={handleSave}>
                        Save
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
