import { readPosts } from "./lib/blog/posts.ts";
import { blogCSS } from "./lib/blog/css.ts";
import { copy } from "@std/fs/copy";
import { go } from "@fartlabs/go";
import { parse } from "@std/jsonc";

function blogLayout(title: string, description: string, content: string): string {
  return '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>' + title + ' - etok.me</title>\n    <meta name="description" content="' + description + '" />\n    <link rel="stylesheet" type="text/css" href="/fartcss/fart.css" />\n    <link rel="stylesheet" type="text/css" href="/index.css" />\n    <link rel="stylesheet" type="text/css" href="/blog/blog.css" />\n    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" />\n    <link rel="icon" href="https://fart.tools/fl-logo.png">\n  </head>\n  <body>\n    <header style="margin-bottom: 2rem;">\n      <nav><a href="/">? Home</a> | <a href="/blog">Blog</a></nav>\n    </header>\n    <main>\n      ' + content + '\n    </main>\n  </body>\n</html>';
}

if (import.meta.main) {
  const output = Deno.args[0] ?? "./static";
  await Deno.mkdir(output, { recursive: true });
  await Deno.copyFile("./index.html", output + "/index.html");
  await Deno.copyFile("./index.css", output + "/index.css");
  await Deno.mkdir(output + "/for-agents", { recursive: true });
  await Deno.copyFile("./for-agents.html", output + "/for-agents/index.html");
  await Deno.copyFile("./llms.txt", output + "/llms.txt");

  await copy("./lib", output + "/lib", { overwrite: true });
  await copy("./assets", output + "/assets", { overwrite: true });
  await copy("./fartcss", output + "/fartcss", { overwrite: true });

  try {
    await Deno.copyFile("./CNAME", output + "/CNAME");
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  await Deno.writeTextFile(output + "/.nojekyll", "");

  const shortlinks = parse(
    await Deno.readTextFile(new URL(import.meta.resolve("./shortlinks.jsonc"))),
  ) as Record<string, string>;

  for (const alias of Object.keys(shortlinks)) {
    const url = go(new URL("https://etok.me/" + alias), shortlinks);
    await Deno.mkdir(output + "/" + alias, { recursive: true });
    await Deno.writeTextFile(
      output + "/" + alias + "/index.html",
      '<!DOCTYPE html>\n<html>\n  <head>\n    <meta http-equiv="refresh" content="0; url=' + url + '" />\n  </head>\n  <body>Redirecting...</body>\n</html>',
    );
  }

  const posts = await readPosts();
  await Deno.mkdir(output + "/blog", { recursive: true });
  await Deno.writeTextFile(output + "/blog/blog.css", blogCSS());

  const postList = posts
    .map((post) => {
      const date = post.attrs.date.toISOString().split("T")[0];
      return '<li>\n        <h2><a href="/blog/' + post.id + '">' + post.attrs.title + '</a></h2>\n        <div class="post-meta">' + date + '</div>\n        <p>' + post.attrs.description + '</p>\n      </li>';
    })
    .join("\n");
  await Deno.writeTextFile(
    output + "/blog/index.html",
    blogLayout("Blog", "Posts by Ethan Davidson", '<ul class="post-list">' + postList + '</ul>'),
  );

  for (const post of posts) {
    await Deno.mkdir(output + "/blog/" + post.id, { recursive: true });
    const date = post.attrs.date.toISOString().split("T")[0];
    const meta = '<div class="post-meta">' + date + '</div>';
    await Deno.writeTextFile(
      output + "/blog/" + post.id + "/index.html",
      blogLayout(post.attrs.title, post.attrs.description, meta + post.html),
    );
  }
}
