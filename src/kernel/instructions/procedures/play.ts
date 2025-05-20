import { make } from "./_common"
import { KernelInterface } from "../../types"
import { BasikValue } from "@/types"
import { isNumber, isType } from "@tolokoban/type-guards"

export const makePlay = (kernel: KernelInterface) =>
    make("PLAY", argsAreForPlay(), ([score, tempo]) => {
        kernel.music.play(score, tempo)
    })

export function argsAreForPlay() {
    return (
        args: BasikValue[]
    ): asserts args is [string | string[], number] => {
        if (args.length < 1 || args.length > 2) {
            throw new Error(`Cette function attend entre 1 et 2 arguments.`)
        }
        const [scores, tempo] = args
        if (!isType(scores, ["|", "string", ["array", "string"]])) {
            throw new Error(
                "Le premier argument est la partition. J'attends un texte ou une liste de textes ici."
            )
        }
        if (tempo !== undefined) return
        if (!isNumber(tempo)) {
            throw new Error(
                "Le second argument est le tempo et il me faut un nombre ici."
            )
        }
    }
}
