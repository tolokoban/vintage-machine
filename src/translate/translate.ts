import { workbench } from "@/workbench"
import { FR } from "./fr"
import { EN } from "./en"

export function translations() {
    const lang = workbench.state.lang.value
    if (lang === "en") return EN
    return FR
}
