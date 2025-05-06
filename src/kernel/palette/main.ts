import { tgdCanvasCreatePalette } from "@tolokoban/tgd"

export function paletteMakeDefault(): HTMLCanvasElement {
    return tgdCanvasCreatePalette(
        [
            "#000000", // 0
            "#000080",
            "#0000FF",
            "#800000",
            "#800080",
            "#8000FF", // 5
            "#FF0000",
            "#FF0080",
            "#FF00FF",
            "#008000",
            "#008080", // 10
            "#0080FF",
            "#808000",
            "#808080",
            "#8080FF",
            "#FF8000", // 15
            "#FF8080",
            "#FF80FF",
            "#00FF00",
            "#00FF80",
            "#00FFFF", // 20
            "#80FF00",
            "#80FF80",
            "#80FFFF",
            "#FFFF00",
            "#FFFF80", // 25
            "#FFFFFF",
            "#000000",
        ],
        256,
        1
    )
}
