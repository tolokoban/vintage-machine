import { marked, Tokens } from "marked";
import { tgdLoadText } from "@tolokoban/tgd";

export class Help {
  public readonly element: HTMLDivElement;

  private currentPage = "";

  constructor() {
    const div = document.getElementById("HELP");
    if (!div) throw new Error("There is no element with id #HELP!");

    this.element = div as HTMLDivElement;
    marked.use({
      renderer: {
        link: (token: Tokens.Link) => {
          return `<a href="#" data-href=${JSON.stringify(token.href)}>${token.text}</a>`;
        },
      },
    });
  }

  async load(id: string) {
    const content = await tgdLoadText(`assets/help/${id}.md`);
    if (!content) {
      console.error("Found no page with this id:", id);
      return;
    }

    this.currentPage = id;
    const html = await marked.parse(content, {
      async: true,
      gfm: true,
    });
    this.element.innerHTML = html;
    this.element.scrollTop = 0;
    const links = this.element.querySelectorAll("a[data-href]");
    for (const link of links) {
      const href = link.getAttribute("data-href");
      if (!href) continue;

      const id = this.makeId(href);
      (link as HTMLAnchorElement).addEventListener(
        "click",
        (evt: MouseEvent) => {
          evt.preventDefault();
          evt.stopPropagation();
          this.load(id);
        },
      );
    }
  }

  private makeId(id: string) {
    const parts = this.currentPage.split("/");
    parts.pop();
    parts.push(id);
    return parts.join("/");
  }
}
