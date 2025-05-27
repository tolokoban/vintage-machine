import { Kernel } from "@/kernel"
import { make } from "./_common"
import { argsArrayOfNumbers } from "@/basik/guards"

export const makeTri = (kernel: Kernel) =>
    make("tri", argsArrayOfNumbers(), ([coords]) => {
        if ((coords.length & 1) !== 0) {
            throw new Error(
                "La liste des coordonnées doit avoir un nombre pair d'éléments ([x, y, x, y, ...])."
            )
        }
        kernel.paintCurrentLayer(() => {
            kernel.painterTri.paint(
                coords,
                kernel.colorIndex,
                kernel.x,
                kernel.y,
                "TRIANGLES"
            )
        })
    })
