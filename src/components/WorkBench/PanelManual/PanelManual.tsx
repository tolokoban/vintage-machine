import * as React from "react"

import {
    IconArrowUp,
    IconBook,
    Theme,
    useHotKey,
    ViewFloatingButton,
    ViewPanel,
    ViewStrip,
} from "@tolokoban/ui"

import { useMarkdown } from "./markdown"

import Styles from "./PanelManual.module.css"
import "@/font/bangers.css"
import { workbench } from "@/workbench"

const $ = Theme.classNames

export type CompPanelManualProps = {}

export function CompPanelManual() {
    const [error, setError] = workbench.state.error.useState()
    useHotKey("escape", () => setError(null))
    const handleMount = useMarkdown()

    console.log("🚀 [PanelManual] error =", error) // @FIXME: Remove this line written on 2025-05-09 at 20:02
    if (error) {
        return (
            <ViewPanel
                fullsize
                position="absolute"
                padding="M"
                overflow="auto"
                color="error"
                className={Styles.error}
            >
                <div onClick={() => setError(null)}>
                    <h1>Erreur !</h1>
                    <pre>{error}</pre>
                </div>
            </ViewPanel>
        )
    }
    return (
        <ViewStrip
            template="*1"
            orientation="row"
            color="neutral-5"
            fullsize
            position="absolute"
        >
            <ViewPanel
                color="primary-5"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                flexDirection="column"
                gap="M"
                padding="XS"
            >
                <ViewFloatingButton
                    icon={IconBook}
                    color="secondary-5"
                    onClick={handleGoToIndex}
                />
                <ViewFloatingButton
                    icon={IconArrowUp}
                    color="secondary-5"
                    onClick={handleGoUp}
                />
            </ViewPanel>
            <ViewPanel
                className={$.join(Styles.panelManual)}
                color="neutral-5"
                padding="M"
                overflow="auto"
            >
                <div ref={handleMount}>Chargement en cours...</div>
            </ViewPanel>
        </ViewStrip>
    )
}

function handleGoToIndex() {
    const currentPage = workbench.state.manualPageId.value
    const parts = currentPage.split("/")
    parts.pop()
    parts.push("index")
    workbench.state.manualPageId.value = parts.join("/")
    console.log(
        "🚀 [PanelManual] workbench.state.manualPageId.value =",
        workbench.state.manualPageId.value
    ) // @FIXME: Remove this line written on 2025-05-12 at 18:00
}

function handleGoUp() {
    const currentPage = workbench.state.manualPageId.value
    const parts = currentPage.split("/")
    if (parts.length < 2) return

    parts.pop()
    parts.pop()
    parts.push("index")
    workbench.state.manualPageId.value = parts.join("/")
    console.log(
        "🚀 [PanelManual] workbench.state.manualPageId.value =",
        workbench.state.manualPageId.value
    ) // @FIXME: Remove this line written on 2025-05-12 at 18:00
}
