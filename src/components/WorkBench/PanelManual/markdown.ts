import React from "react"

import { workbench } from "@/workbench"
import { marked, Tokens } from "marked"
import { tgdLoadText } from "@tolokoban/tgd"
import { BasikLexer } from "@/basik/lexer"
import { translations } from "@/translate"

marked.use({
    renderer: {
        link: (token: Tokens.Link) => {
            const { href, text } = token
            if (href.startsWith("https:") || href.startsWith("http:")) {
                return `<a href=${JSON.stringify(token.href)}>${text}</a>`
            }
            return `<a href="#/workbench/${href}" data-href=${JSON.stringify(href)}>${text}</a>`
        },
    },
})

const MAIN_PAGE = "index"

export function useMarkdown() {
    const [div, setDiv] = React.useState<HTMLDivElement | null>(null)
    const [pageId, setPageId] = workbench.state.manualPageId.useState()
    React.useEffect(() => {
        const action = async () => {
            if (!div) return

            const content = await tgdLoadText(absolutePath(`${pageId}.md`))
            if (!content) {
                if (pageId !== MAIN_PAGE) setPageId(MAIN_PAGE)
                return
            }
            parseMarkdown(
                pageId,
                div,
                await addNavigation(pageId, content),
                setPageId
            )
        }
        action()
    }, [div, pageId, setPageId])
    return (elem: HTMLDivElement | null) => setDiv(elem)
}

async function parseMarkdown(
    pageId: string,
    div: HTMLDivElement,
    content: string,
    setPageId: (id: string) => void
) {
    const parts = pageId.split("/")
    parts.pop()
    const path = parts.join("/")
    const html = await marked.parse(content, {
        async: true,
        gfm: true,
    })
    div.innerHTML = html
    parseImages(div, path)
    parseLinks(div, path, setPageId)
    parsePres(div)
    globalThis.setTimeout(() => {
        div.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }, 50)
}

function parseImages(div: HTMLDivElement, path: string) {
    const images = div.querySelectorAll("img")
    for (const img of images) {
        const src = img.getAttribute("src")
        if (!src) continue

        img.setAttribute("src", absolutePath(path, src))
    }
}

function parseLinks(
    div: HTMLDivElement,
    path: string,
    setPageId: (id: string) => void
) {
    const links = div.querySelectorAll("a[data-href]")
    for (const link of links) {
        const id = link.getAttribute("data-href")
        if (!id) continue

        link.addEventListener("click", evt => {
            evt.preventDefault()
            evt.stopPropagation()
            setPageId(joinPath(path, id))
        })
    }
}

function parsePres(div: HTMLDivElement) {
    const tr = translations()
    const pres = div.querySelectorAll("pre")
    for (const pre of pres) {
        const code = pre.textContent ?? ""
        const lexer = new BasikLexer(code)
        pre.setAttribute("title", tr.dblClickOnCode)
        pre.innerHTML = lexer.highlight()
        pre.addEventListener(
            "dblclick",
            () => (workbench.state.code.value = code)
        )
    }
}

function joinPath(...parts: string[]) {
    return parts.filter(item => item.trim().length > 0).join("/")
}

/**
 * For the folder `/tutorial/`, we will add the index.txt in index.md,
 * and navigation links (plus the header) in the other files.
 */
async function addNavigation(pageId: string, content: string) {
    const tr = translations()
    const indexFile = (
        (await tgdLoadText(
            absolutePath(...pageId.split("/").slice(0, -1), "index.txt")
        )) ?? ""
    ).trim()
    const episodes = indexFile.split("\n").map(item => item.trim().split(":"))
    if (pageId.endsWith("tutorial/index")) {
        return `${content}\n\n${episodes.map(([id, caption]) => `- [${caption}](${id})`).join("\n")}`
    }

    if (!pageId.includes("tutorial/")) return content

    const output: string[] = []
    const index = episodes.findIndex(([id]) => pageId.endsWith(`/${id}`))
    const prev = episodes[index - 1]
    const episode = episodes[index]
    const next = episodes[index + 1]
    if (episode) output.push(`# ${episode[1]}`, "\n", "\n")
    output.push(content, "\n\n----\n\n")
    if (next) output.push(`- ${tr.nextChapter} [${next[1]}](${next[0]})`)
    if (prev) output.push(`- ${tr.prevChapter} [${prev[1]}](${prev[0]})`)
    return output.join("\n")
}

function absolutePath(...path: string[]) {
    return joinPath("assets/help", workbench.state.lang.value, ...path)
}
