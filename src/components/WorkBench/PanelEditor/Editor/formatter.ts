const TOKENS: Record<string, RegExp> = {
    "{": /^\{/g,
    "}": /^\}/g,
    "[": /^\[/g,
    "]": /^\]/g,
    "(": /^\(/g,
    ")": /^\)/g,
    NL: /^([ \t\r]*[\n][ \t\r]*)+/g,
    SPC: /^[ \t]+/g,
    REM: /^REM(?![a-z0-9])[^\n\r]*(?![\n\r])/gi,
    STR: /^"(\\"|[^"])*"/g,
    REST: /^[^"{}()[\]\n\r \t]+/g,
}

type Token = [key: string, txt: string, etc?: boolean]

export function formatBasik(code: string): string {
    const tokens: Token[] = flagSuccesiveClosings(
        solidifyShortBlocs(
            removeSpacesAroundBlocks(
                removeSpaceAfterNewlines(extractTokens(code))
            )
        )
    )
    let out = ""
    let indent = 0
    for (const token of tokens) {
        const [key, txt, etc] = token
        switch (key) {
            case "NL":
                out += txt
                out += "  ".repeat(indent)
                break
            case "{":
            case "[":
            case "(":
                out += key
                out += "\n"
                indent++
                out += "  ".repeat(indent)
                break
            case "}":
            case "]":
            case ")":
                indent = Math.max(0, indent - 1)
                out += "\n"
                out += "  ".repeat(indent)
                out += key
                if (!etc) {
                    out += "\n"
                    out += "  ".repeat(indent)
                }
                break
            default:
                out += txt
        }
    }
    console.log()
    console.log(out)
    console.log()
    return out
}

function getToken(code: string): Token {
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

/**
 * Keep only "\n", but strip all other spaces.
 */
function sanitizeNL(txt: string): string {
    const withoutR = txt.split("\r").join("")
    return "\n".repeat(withoutR.split("\n").length - 1)
}

function extractTokens(code: string) {
    const tokens: Token[] = []
    let cursor = 0
    while (cursor < code.length) {
        const current = code.slice(cursor)
        const token = getToken(current)
        const [key, txt] = token
        cursor += txt.length
        if (key === "NL") tokens.push(["NL", sanitizeNL(txt)])
        else if (key === "SPC") tokens.push(["SPC", " "])
        else tokens.push(token)
    }
    console.log("Raw tokens:", tokens)
    return tokens
}

function removeSpacesAroundBlocks(tokens: Token[]): Token[] {
    const output: Token[] = []
    for (const [tokenKey, tokenTxt] of tokens) {
        switch (tokenKey) {
            case "{":
            case "[":
            case "(":
            case "}":
            case "]":
            case ")":
                while (lastIs(output, "NL", "SPC")) output.pop()
                output.push([tokenKey, tokenTxt])
                break
            case "SPC":
                if (!lastIs(output, "}", "]", ")")) {
                    output.push(["SPC", " "])
                }
                break
            default:
                output.push([tokenKey, tokenTxt])
                break
        }
    }
    debugTokens("Remove spaces around blocks", output)
    return output
}

function flagSuccesiveClosings(tokens: Token[]): Token[] {
    const output: Token[] = []
    for (const [tokenKey, tokenTxt] of tokens) {
        if ("}])".includes(tokenKey)) {
            if (lastIs(output, "}", "]", ")")) {
                output[output.length - 1].push(true)
            }
        }
        output.push([tokenKey, tokenTxt])
    }
    debugTokens("Flag successive closings", output)
    return output
}

function lastIs(tokens: Token[], ...keys: string[]) {
    const last = tokens.at(-1)
    if (!last) return false

    return keys.includes(last[0])
}

const MAX_SIZE = 30

/**
 * Blocs are surrounded by `(...)` or `[...]`.
 * If the content is short ( < MAX_SIZE ), then
 * we consider the bloc as a whole solid string.
 * That means, we won't indent the content.
 */
function solidifyShortBlocs(rawTokens: Token[]): Token[] {
    const tokens = parseBlock(rawTokens, "", "")
    debugTokens("Solidify blocks", tokens)
    return tokens
}

const BLOCKS: Record<string, string> = {
    "{": "}",
    "[": "]",
    "(": ")",
}
function parseBlock(input: Token[], open: string, close: string): Token[] {
    const output: Token[] = []
    while (input.length > 0) {
        const token = input.shift()
        if (!token) continue

        const [key] = token
        if (key === close) {
            break
        } else if ("{[(".includes(key)) {
            output.push(...parseBlock(input, key, BLOCKS[key]))
        } else {
            output.push(token)
        }
    }
    let size = 0
    for (const [, txt] of output) {
        size += txt.length
        if (size > MAX_SIZE) break
    }
    return size <= MAX_SIZE
        ? [
              [
                  "BLOCK",
                  `${open}${output
                      .map(([key, txt]) =>
                          key === "NL" ? ["SPC", " "] : [key, txt]
                      )
                      .map(([, txt]) => txt)
                      .join("")}${close}`,
              ],
          ]
        : [[open, open], ...output, [close, close]]
}

function removeSpaceAfterNewlines(rawTokens: Token[]): Token[] {
    const tokens: Token[] = []
    let previous = ""
    for (const [key, txt] of rawTokens) {
        if (key === "SPC") {
            if (previous === "NL") continue
        } else {
            previous = key
        }
        if (key === "SPC") tokens.push([key, " "])
        else tokens.push([key, txt])
    }
    debugTokens("Remove space after new line", tokens)
    return tokens
}

function debugTokens(caption: string, tokens: Token[]) {
    const COLORS: Record<string, string> = {
        "{": "#f90",
        "}": "#f90",
        "[": "#f90",
        "]": "#f90",
        "(": "#f90",
        ")": "#f90",
        STR: "#0f0",
        NL: "#f00",
        SPC: "#ff0",
        REM: "#bbb",
        BLOCK: "#0ff",
    }
    console.log(`%c${caption}`, "font-weight: bold")
    const styles: string[] = []
    for (let i = 0; i < tokens.length; i++) {
        const [key] = tokens[i]
        const color = COLORS[key] ?? "#fff"
        styles.push(
            `padding:0 8px;border-radius:999px;margin:0;font-family:monospace;color:#000;background:${color}`
        )
    }
    const text = tokens.map(([, txt]) => `%c${txt}`).join("")
    console.log(text, ...styles)
    console.log(tokens)
}
