import log from "@shikijs/langs/log";
import shell from "@shikijs/langs/shell";
import ts from "@shikijs/langs/typescript";
import tailwindcss from "@tailwindcss/vite";
import githubDark from "@shikijs/themes/github-dark";
import { fromHighlighter } from "@shikijs/markdown-it/core";

import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";
import type { UserConfig } from "vite";
import { addCopyButton } from "shiki-transformer-copy-button";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { createHighlighterCore, HighlighterGeneric } from "shiki/core";

export default async (): Promise<UserConfig> => {
  const highlighter = (await createHighlighterCore({
    themes: [githubDark],
    langs: [ts, log, shell],
    engine: createOnigurumaEngine(() => import("shiki/wasm")),
  })) as HighlighterGeneric<string, string>;

  const md = MarkdownIt();

  md.use(
    fromHighlighter(highlighter, {
      theme: "github-dark",
      transformers: [addCopyButton()],
    })
  );

  return {
    server: {
      port: 4000,
    },
    build: {
      target: "esnext",
    },
    plugins: [
      tailwindcss(),
      {
        name: "inject-markdown-html",
        transformIndexHtml: {
          order: "pre",
          handler: (html) => {
            const paths = ["../../packages/hlogr/README.md"];
            const mdFilePath = path.resolve(__dirname, ...paths);
            const markdownContent = fs.readFileSync(mdFilePath, "utf-8");
            return html.replace("<!-- MARKDOWN_CONTENT -->", md.render(markdownContent));
          },
        },
      },
    ],
  };
};
