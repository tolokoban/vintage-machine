import { BasikError } from "@/types";

export function consoleError(title: string, err: BasikError) {
  const output: string[] = [title, err.msg, ""];
  console.log(`%c${err.msg}`, "background: #f00;color: #fff");
  const lines: [number, string][] = [];
  let start = 0;
  let cursor = 0;
  let lineNumber = 1;
  const code = `${err.code}\n\n`;
  while (cursor < code.length) {
    const c = code.charAt(cursor++);
    if (c === "\n") {
      const line = code.slice(start, cursor).trimEnd();
      lines.push([lineNumber++, line]);
      if (cursor > err.pos) {
        for (const [num, txt] of lines.slice(-5)) {
          output.push(`${`${num}`.padStart(6, " ")}:  ${txt}`);
          console.log(
            `%c${`${num}`.padStart(6, " ")}:  ${txt}`,
            "font-family:monospace",
          );
        }
        console.log(
          `%c${" ".repeat(9 + err.pos - start)}^`,
          "font-family:monospace",
        );
        output.push(`${" ".repeat(9 + err.pos - start)}^`);
        throw new Error(output.join("\n"));
      }
      start = cursor;
    }
  }
  throw new Error(output.join("\n"));
}
