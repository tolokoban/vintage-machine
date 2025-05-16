import { KernelInterface } from "../../types";
import { make } from "./_common";
import { argsAreStrings } from "@/basik/guards";

export const makeDraw = (kernel: KernelInterface) =>
  make("draw", argsAreStrings(1), (args) => {
    const code = args.join("");
    const commands = parseCommands(code.split(/[,; \n\r\t]+/).join(" "));
    const coords: Array<[x: number, y: number]> = [];
    kernel.paintFB(() => {
      for (const [name, ...args] of commands) {
        switch (name) {
          case "(": {
            coords.push([kernel.x, kernel.y]);
            break;
          }
          case ")": {
            const coord = coords.pop();
            if (!coord) break;

            const [x, y] = coord;
            kernel.x = x;
            kernel.y = y;
            break;
          }
          case "M": {
            const [x, y] = args;
            kernel.x = x;
            kernel.y = y;
            break;
          }
          case "m": {
            const [x, y] = args;
            kernel.x += x;
            kernel.y += y;
            break;
          }
          case "C": {
            const [colorIndex] = args;
            kernel.colorIndex = colorIndex ?? kernel.colorIndex;
            break;
          }
          case "D": {
            const [rx, ry] = args;
            kernel.painterDisk.paint(
              kernel.screenSpaceX(kernel.x),
              kernel.screenSpaceY(kernel.y),
              kernel.screenSpaceX(rx),
              kernel.screenSpaceY(ry ?? rx),
              kernel.colorIndex,
            );
            break;
          }
          case "R": {
            const [rx, ry] = args;
            kernel.painterRect.paint(
              kernel.screenSpaceX(kernel.x),
              kernel.screenSpaceY(kernel.y),
              kernel.screenSpaceX(rx),
              kernel.screenSpaceY(ry ?? rx),
              kernel.colorIndex,
            );
            break;
          }
          default: {
            const index = code.indexOf(name);
            const start = Math.max(0, index - 20);
            const end = Math.min(code.length, index + 20);
            throw new Error(
              `Je ne reconnais pas la commande "${name}".
N'oublie pas que la différence entre majuscules et minuscules est importante ici.
${start > 0 ? "..." : "   "}${code.slice(start, end)}${end < code.length ? "..." : "   "}
   ${" ".repeat(index - start)}^`,
            );
          }
        }
      }
    });
  });

type Command = [name: string, ...args: number[]];

const RX_NUM = /^[ \n\r\t]*^[-+]?([0-9]+(\.[0-9]+)?|\.[0-9]+)[ \n\r\t,]*/g;
const RX_COM = /^[ \n\r\t]*[a-zA-Z]+[ \n\r\t]*/g;
const RX_PAR_OPEN = /^\(/g;
const RX_PAR_CLOSE = /^\)/g;

function parseCommands(code: string) {
  const commands: Command[] = [];
  let cursor = 0;
  const match = (rx: RegExp) => {
    rx.lastIndex = -1;
    const match = rx.exec(code.slice(cursor));
    if (!match) return null;

    const [result] = match;
    cursor += result.length;
    return result.trim();
  };
  while (cursor < code.length) {
    if (match(RX_PAR_OPEN)) {
      commands.push(["("]);
    } else if (match(RX_PAR_CLOSE)) {
      commands.push([")"]);
    } else {
      const name = match(RX_COM);
      if (!name) {
        throw new Error(
          `Je m'attendais à voir une commande ou une parenthèse :\n\n${code}\n${" ".repeat(cursor)}^`,
        );
      }
      const args: number[] = [];
      while (true) {
        const num = match(RX_NUM);
        if (!num) break;

        args.push(Number(num));
      }
      commands.push([name, ...args]);
    }
  }
  return commands;
}
