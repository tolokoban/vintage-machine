import { marked, Tokens } from "marked"
import { tgdLoadText } from "@tolokoban/tgd"
import { getState } from "@/state"

export class Help {
    private currentPage = ""

    constructor(public readonly element: HTMLElement) {
        marked.use({
            renderer: {
                link: (token: Tokens.Link) => {
                    return `<a href="#" data-href=${JSON.stringify(token.href)}>${token.text}</a>`
                },
            },
        })
        this.load(globalThis.localStorage.getItem("Basik/help") ?? "main")
    }

    async load(id: string) {
        const content = await tgdLoadText(`assets/help/${id}.md`)
        if (!content) {
            console.error("Found no page with this id:", id)
            return
        }

        globalThis.localStorage.setItem("Basik/help", id)
        this.currentPage = id
        const html = await marked.parse(content, {
            async: true,
            gfm: true,
        })
        this.element.innerHTML = html
        this.element.scrollTop = 0
        const links = this.element.querySelectorAll("a[data-href]")
        for (const link of links) {
            const href = link.getAttribute("data-href")
            if (!href) continue

            const id = this.makeId(href)
            ;(link as HTMLAnchorElement).addEventListener(
                "click",
                (evt: MouseEvent) => {
                    evt.preventDefault()
                    evt.stopPropagation()
                    this.load(id)
                }
            )
        }
        const pres = this.element.querySelectorAll("pre")
        for (const pre of pres) {
            pre.setAttribute("title", "Double-clique pour jouter à l'éditeur")
            pre.addEventListener("dblclick", () => {
                getState().code = (pre.textContent ?? "").trim()
            })
        }
    }

    private makeId(id: string) {
        const parts = this.currentPage.split("/")
        parts.pop()
        parts.push(id)
        return parts.join("/")
    }
}
