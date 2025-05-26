import * as React from "react"
import FileSaver from "file-saver"

import {
    IconCode,
    IconExport,
    IconFullscreen,
    IconImport,
    IconPause,
    IconPlay,
    IconSpaceInvader,
    Theme,
    useHotKey,
    ViewInputFile,
    ViewPanel,
} from "@tolokoban/ui"

import { workbench } from "@/workbench"

import Styles from "./Menu.module.css"
import { isString } from "@tolokoban/type-guards"
import { CompButton } from "@/components/Button"
import { formatBasik } from "../Editor/formatter"

const $ = Theme.classNames

export type CompMenuProps = {}

export function CompMenu(props: CompMenuProps) {
    const refInput = React.useRef<HTMLInputElement | null>(null)
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

    const handleLoadFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const files = (evt.target as HTMLInputElement).files
        if (!files) return

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
    const handleLoad = () => {
        const input = refInput.current
        if (!input) return

        input.click()
    }
    const handleFormat = () => {
        const formattedCode = formatBasik(workbench.state.code.value)
        workbench.state.code.value = formattedCode
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
                    <CompButton
                        type="start"
                        enabled={ready}
                        onClick={() => {
                            workbench.run()
                        }}
                    >
                        <IconPlay /> Run
                    </CompButton>
                    <CompButton
                        type="start"
                        enabled={ready}
                        onClick={() => {
                            workbench.run({ fullscreen: true })
                        }}
                    >
                        <IconFullscreen /> Screen
                    </CompButton>
                    <CompButton
                        enabled={ready}
                        onClick={() => {
                            workbench.share()
                        }}
                    >
                        <IconSpaceInvader /> Share
                    </CompButton>
                    <input
                        ref={refInput}
                        style={{ display: "none" }}
                        type="file"
                        accept=".basik"
                        onChange={handleLoadFile}
                    />
                    <CompButton onClick={handleLoad}>Load</CompButton>
                    <CompButton onClick={handleSave}>Save</CompButton>
                    <CompButton onClick={handleFormat}>
                        <IconCode />
                    </CompButton>
                </>
            )}
            {running && (
                <CompButton
                    type="stop"
                    enabled={ready}
                    onClick={() => {
                        workbench.state.running.value = false
                    }}
                >
                    <IconPause /> Stop
                </CompButton>
            )}
        </ViewPanel>
    )
}
