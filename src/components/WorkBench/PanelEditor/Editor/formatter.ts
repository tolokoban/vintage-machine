const TOKENS: Record<string, RegExp> = {
    OPEN: /^[ \t]*\{[ \t\r\n`]*/g,
    CLOSE: /^[ \t\n\r`]*\}[ \t\r\n]*/g,
    NL: /^[ \t]*[\n\r][ \t]*/g,
    REM: /^REM(?![a-z0-9])[^\n\r]*[\n\r]/gi,
    STR: /^"(\\"|[^"])*"/g,
    REST: /^[^"{\n\r}]+/g,
    SPC: /^\s+/g,
}

export function formatBasik(code: string): string {
    const SIZE = 2
    let out = ""
    let depth = 0
    let cursor = 0
    let fakeNewline = false
    while (cursor < code.length) {
        const current = code.slice(cursor)
        const [tokenKey, tokenTxt] = getToken(current)
        console.log(
            `${tokenKey} (${depth}): %c${tokenTxt.trim()}`,
            "background:#ff0;color:#000"
        )
        cursor += tokenTxt.length
        switch (tokenKey) {
            case "OPEN":
                depth++
                out += `{\n${" ".repeat(depth * SIZE)}`
                fakeNewline = true
                break
            case "CLOSE":
                depth = Math.max(0, depth - 1)
                out += `\n${" ".repeat(depth * SIZE)}}\n${" ".repeat(depth * SIZE)}`
                fakeNewline = true
                break
            case "NL":
                if (!fakeNewline) out += `\n${" ".repeat(depth * SIZE)}`
                break
            default:
                out += tokenTxt.trimStart()
                fakeNewline = false
                break
        }
    }
    console.log()
    console.log(out)
    console.log()
    return out
}

function getToken(code: string) {
    for (const key of Object.keys(TOKENS)) {
        const rx = TOKENS[key]
        rx.lastIndex = -1
        const match = rx.exec(code)
        if (match) {
            return [key, match[0]]
        }
    }
    return ["?", code.charAt(0)]
}
