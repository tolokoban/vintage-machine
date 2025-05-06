import { BasikValue } from "@/types"

export function make<T extends BasikValue[]>(
    name: string,
    guard: (args: BasikValue[]) => asserts args is T,
    func: (args: T) => void
) {
    return (args: BasikValue[]) => {
        try {
            guard?.(args)
            return func(args)
        } catch (ex) {
            throw new Error(
                `Erreur de l'instruction "${name.toUpperCase()}": ${ex}`
            )
        }
    }
}
