import React from "react";

import { workbench } from "@/workbench";
import { marked, Tokens } from "marked";
import { tgdLoadText } from "@tolokoban/tgd";
import { BasikLexer } from "@/basik/lexer";

marked.use({
  renderer: {
    link: (token: Tokens.Link) => {
      const { href, text } = token;
      if (href.startsWith("https:") || href.startsWith("http:")) {
        return `<a href=${JSON.stringify(token.href)}>${text}</a>`;
      }
      return `<a href="#/workbench/${href}" data-href=${JSON.stringify(href)}>${text}</a>`;
    },
  },
});

const MAIN_PAGE = "index";

export function useMarkdown() {
  const [div, setDiv] = React.useState<HTMLDivElement | null>(null);
  const [pageId, setPageId] = workbench.state.manualPageId.useState();
  React.useEffect(() => {
    if (!div) return;

    tgdLoadText(`assets/help/${pageId}.md`)
      .then((content) => {
        if (!content) {
          if (pageId !== MAIN_PAGE) setPageId(MAIN_PAGE);
          return;
        }
        parseMarkdown(pageId, div, content, setPageId);
      })
      .catch(() => setPageId(MAIN_PAGE));
  }, [div, pageId, setPageId]);
  return (elem: HTMLDivElement | null) => setDiv(elem);
}

async function parseMarkdown(
  pageId: string,
  div: HTMLDivElement,
  content: string,
  setPageId: (id: string) => void,
) {
  const parts = pageId.split("/");
  parts.pop();
  const path = parts.join("/");
  const html = await marked.parse(content, {
    async: true,
    gfm: true,
  });
  div.innerHTML = html;
  parseImages(div, path);
  parseLinks(div, path, setPageId);
  parsePres(div);
  div.scrollTop = 0;
}

function parseImages(div: HTMLDivElement, path: string) {
  const images = div.querySelectorAll("img");
  for (const img of images) {
    const src = img.getAttribute("src");
    if (!src) continue;

    img.setAttribute("src", joinPath(`assets/help`, path, src));
  }
}

function parseLinks(
  div: HTMLDivElement,
  path: string,
  setPageId: (id: string) => void,
) {
  const links = div.querySelectorAll("a[data-href]");
  for (const link of links) {
    const id = link.getAttribute("data-href");
    if (!id) continue;

    link.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      setPageId(joinPath(path, id));
    });
  }
}

function parsePres(div: HTMLDivElement) {
  const pres = div.querySelectorAll("pre");
  for (const pre of pres) {
    const code = pre.textContent ?? "";
    const lexer = new BasikLexer(code);
    pre.setAttribute("title", "Double clique pour utiliser ce code");
    pre.innerHTML = lexer.highlight();
    pre.addEventListener("dblclick", () => (workbench.state.code.value = code));
  }
}

function joinPath(...parts: string[]) {
  return parts.filter((item) => item.trim().length > 0).join("/");
}
