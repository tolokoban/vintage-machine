import * as React from "react"

import { Theme } from "@tolokoban/ui"

import Styles from "./{{namePascal}}.module.css"

const $ = Theme.classNames

export type Comp{{namePascal}}Props = {
}

export function Comp{{namePascal}}(props: Comp{{namePascal}}Props) {
    return (
        <div
            className={$.join(Styles.{{nameCamel}})}
        >
        </div>
    )
}
