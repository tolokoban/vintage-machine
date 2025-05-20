import * as React from "react"

import {
    IconArrowUp,
    IconBook,
    IconClose,
    IconInvert,
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
    const [focusOnManual, setFocusOnManual] =
        workbench.state.focusOnManual.useState()
    const handleMount = useMarkdown()
    const handleSwap = () => {
        setFocusOnManual(!focusOnManual)
    }

    if (error) {
        return (
            <ViewPanel
                fullsize
                position="absolute"
                padding={0}
                overflow="auto"
                className={Styles.error}
            >
                <ViewStrip template="*1" orientation="column">
                    <ViewPanel
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        color="secondary-5"
                        padding="M"
                    >
                        <strong>Erreur !</strong>
                        <IconClose onClick={() => setError(null)} />
                    </ViewPanel>
                    <ViewPanel overflow="auto" padding="M">
                        <pre>{error}</pre>
                    </ViewPanel>
                </ViewStrip>
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
                <ViewFloatingButton
                    icon={IconInvert}
                    color="secondary-5"
                    onClick={handleSwap}
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
}

function handleGoUp() {
    const currentPage = workbench.state.manualPageId.value
    const parts = currentPage.split("/")
    if (parts.length < 2) return

    parts.pop()
    parts.pop()
    parts.push("index")
    workbench.state.manualPageId.value = parts.join("/")
}
