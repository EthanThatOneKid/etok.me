import MarkdownIt from "markdown-it";
import anchorPlugin from "markdown-it-anchor";
import tocDoneRightPlugin from "markdown-it-toc-done-right";
import hljs from "highlight.js";

export function renderHTML(md: string): string {
  return renderer.render(md);
}

const renderer: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(content: string, language?: string) {
    const html = language && hljs.getLanguage(language)
      ? hljs.highlight(
        content,
        { language, ignoreIllegals: true },
      ).value
      : renderer.utils.escapeHtml(content);
    const langAttr = language ? ' data-lang="' + language + '"' : '';
    return '<pre' + langAttr + ' class="border-tube-green"><code class="hljs">' + html + '</code></pre>';
  },
});

renderer.use(anchorPlugin, {
  permalink: anchorPlugin.permalink.headerLink({
    class: "fart-link-visible-on-hover",
  }),
});

renderer.use(tocDoneRightPlugin);
