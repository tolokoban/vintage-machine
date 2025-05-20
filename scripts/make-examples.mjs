import FS from "node:fs"
import Path from "node:path"

const ROOT = Path.join(import.meta.dirname, "../public/assets/help/fr/example")

/**
 * @type Array<{ file: string; title: string; size: number }>
 */
const examples = []
FS.readdirSync(ROOT).forEach(file => {
    if (file === "index.md") return

    const path = Path.join(ROOT, file)
    const content = FS.readFileSync(path).toString()
    const title = content.split("\n").find(line => line.startsWith("# "))
    if (!title) {
        console.error("There is no title in this file: ", file)
        return
    }
    examples.push({
        title: title.slice(2),
        size: content.length,
        file: file.slice(0, -3),
    })
})

examples.sort(({ size: size1 }, { size: size2 }) => size1 - size2)

const content = `# Exemples\n\n${examples.map(ex => `- [${ex.title}](${ex.file})`).join("\n")}`
FS.writeFileSync(Path.join(ROOT, "index.md"), content)
console.log("There are", examples.length, "examples.")
