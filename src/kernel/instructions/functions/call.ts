import { isString } from "@tolokoban/type-guards"
import { Kernel } from "@/kernel"
import { make } from "./_common"
import { argsAreAnys } from "@/basik/guards"

export const makeCall = (kernel: Kernel) =>
    make("key", argsAreAnys(1), ([name, ...args]) => {
        throw new Error("Not implemented yet!")
        // if (!isString(name)) {
        //     throw new Error(
        //         `La fonction CALL attend un texte comme premier argument.`
        //     )
        // }
        // const userFunc = this.functionsDefinitions.get(name)
        // if (!userFunc) {
        //     throw new Error(
        //         `La fonction "${name.toUpperCase()}" n'existe pas.\nLes fonctions disponibles sont: ${[
        //             Array.from(this.functionsDefinitions.keys()).map(
        //                 name =>
        //                     `${name}(${this.functionsDefinitions
        //                         .get(name)
        //                         ?.args.join(", ")})`
        //             ),
        //             ...kernel.functionsNames,
        //         ].join(", ")}.`
        //     )
        // }
        // if (args.length !== userFunc.args.length) {
        //     throw new Error(
        //         `La fonction ${name}(${userFunc.args.join(", ")}) attend ${userFunc.args.length} argument${userFunc.args.length > 1 ? "s" : ""}, pas ${args.length}.`
        //     )
        // }
        // this.kernel.subroutineEnter(userFunc.args, args, null)
    })
