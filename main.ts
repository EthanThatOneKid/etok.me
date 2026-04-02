import { parse } from "@std/jsonc";
import { copy } from "@std/fs/copy";
import { go } from "@fartlabs/go";

if (import.meta.main) {
  const output = Deno.args[0] ?? "./static";
  await Deno.mkdir(output, { recursive: true });
  await Deno.copyFile("./index.html", `${output}/index.html`);
  await Deno.copyFile("./index.css", `${output}/index.css`);

  await copy("./lib", `${output}/lib`, { overwrite: true });
  await copy("./assets", `${output}/assets`, { overwrite: true });

  const shortlinks = parse(
    await Deno.readTextFile(new URL(import.meta.resolve("./shortlinks.jsonc"))),
  ) as Record<string, string>;

  const sitemapUrls = ["https://etok.me/"];
  for (const alias of Object.keys(shortlinks)) {
    const url = go(new URL(`https://etok.me/${alias}`), shortlinks);
    sitemapUrls.push(`https://etok.me/${alias}`);
    await Deno.mkdir(`${output}/${alias}`, { recursive: true });
    await Deno.writeTextFile(
      `${output}/${alias}/index.html`,
      `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=${url}" />
    <script id="shortlinks" type="application/json">
${JSON.stringify(shortlinks, null, 2)}
    </script>
    <script type="importmap">
      {
        "imports": {
          "@fartlabs/go": "https://esm.sh/jsr/@fartlabs/go@0.0.3"
        }
      }
    </script>
    <script type="module">
      import { go } from "@fartlabs/go";
      const shortlinks = JSON.parse(
        document.getElementById("shortlinks").textContent,
      );
      const result = go(new URL(location.href), shortlinks);
      if (result && result !== location.href) {
        location.replace(result);
      }
    </script>
  </head>
</html>`,
    );
  }

  // Generate robots.txt
  await Deno.writeTextFile(
    `${output}/robots.txt`,
    `User-agent: *
Allow: /
Sitemap: https://etok.me/sitemap.xml`,
  );

  // Generate sitemap.xml
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${
    sitemapUrls.map((url) =>
      `  <url>
    <loc>${url}</loc>
    <priority>${url === "https://etok.me/" ? "1.0" : "0.8"}</priority>
  </url>`
    ).join("\n")
  }
</urlset>`;
  await Deno.writeTextFile(`${output}/sitemap.xml`, sitemapContent);

  // Generate 404.html for dynamic redirection
  await Deno.writeTextFile(
    `${output}/404.html`,
    `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <script id="shortlinks" type="application/json">
${JSON.stringify(shortlinks, null, 2)}
    </script>
    <script type="importmap">
      {
        "imports": {
          "@fartlabs/go": "https://esm.sh/jsr/@fartlabs/go@0.0.3"
        }
      }
    </script>
    <script type="module">
      import { go } from "@fartlabs/go";
      const shortlinks = JSON.parse(
        document.getElementById("shortlinks").textContent,
      );
      const result = go(new URL(location.href), shortlinks);
      if (result && result !== location.href) {
        location.replace(result);
      } else {
        // Fallback UI if no match is found
        document.body.innerHTML = \`
          <div style="font-family: system-ui; text-align: center; padding: 2rem;">
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/">Go to Home Page</a>
          </div>
        \`;
      }
    </script>
  </head>
  <body>
    <noscript>
      <div style="font-family: system-ui; text-align: center; padding: 2rem;">
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/">Go to Home Page</a>
      </div>
    </noscript>
    <div id="redirecting-message" style="font-family: system-ui; text-align: center; padding: 2rem;">
      <p>Redirecting...</p>
    </div>
  </body>
</html>`,
  );
}
