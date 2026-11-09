import { parse } from "@std/xml";
import { isElement, isText } from "@std/xml/types";
import { readPosts } from "../lib/blog/posts.ts";
import { sitemapEntries } from "../lib/seo.ts";

// readPosts() globs blog/*.md relative to the working directory.
Deno.chdir(new URL("..", import.meta.url));

const origin = "https://etok.me";
const sitemapURL = `${origin}/sitemap.xml`;
const staticURL = new URL("../static/", import.meta.url);

function fail(message: string): never {
  console.error(`::error::${message}`);
  Deno.exit(1);
}

async function readGenerated(name: string): Promise<string> {
  try {
    return await Deno.readTextFile(new URL(name, staticURL));
  } catch {
    fail(`missing generated file: static/${name}`);
  }
}

function parseSitemap(xml: string) {
  try {
    return parse(xml, { ignoreWhitespace: true });
  } catch (error) {
    fail(`sitemap.xml is not valid XML: ${error}`);
  }
}

const robots = await readGenerated("robots.txt");
if (!robots.split(/\r?\n/).includes(`Sitemap: ${sitemapURL}`)) {
  fail(`robots.txt does not point at ${sitemapURL}`);
}

const sitemap = await readGenerated("sitemap.xml");
const document = parseSitemap(sitemap);

if (document.root.name.local !== "urlset") {
  fail(`sitemap.xml root is <${document.root.name.local}>, expected <urlset>`);
}

const locs: string[] = [];
for (const url of document.root.children) {
  if (!isElement(url) || url.name.local !== "url") {
    continue;
  }
  const loc = url.children.find(
    (child) => isElement(child) && child.name.local === "loc",
  );
  if (!loc || !isElement(loc)) {
    fail("sitemap.xml has a <url> without a <loc>");
  }
  const value = loc.children
    .filter(isText)
    .map((node) => node.text)
    .join("")
    .trim();
  if (!value) {
    fail("sitemap.xml has an empty <loc>");
  }
  locs.push(value);
}

if (locs.length === 0) {
  fail("sitemap.xml has no <loc> entries");
}
if (new Set(locs).size !== locs.length) {
  fail("sitemap.xml has duplicate <loc> entries");
}

const posts = await readPosts();
const expected = new Set(sitemapEntries(posts).map((entry) => entry.loc));

for (const loc of locs) {
  if (!expected.has(loc)) {
    fail(`sitemap.xml has an unexpected URL: ${loc}`);
  }
}
for (const loc of expected) {
  if (!locs.includes(loc)) {
    fail(`sitemap.xml is missing a URL: ${loc}`);
  }
}

for (const loc of locs) {
  const url = new URL(loc);
  if (url.origin !== origin) {
    continue;
  }
  const file = url.pathname.endsWith("/")
    ? `${url.pathname}index.html`
    : url.pathname;
  try {
    await Deno.stat(new URL(`.${file}`, staticURL));
  } catch {
    fail(`sitemap URL has no generated page: ${loc} (expected static${file})`);
  }
}

console.log(`sitemap.xml: ${locs.length} URLs, all present`);
console.log(`robots.txt: points at ${sitemapURL}`);
