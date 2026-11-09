import { assertEquals, assertStringIncludes } from "@std/assert";
import type { Post } from "../lib/blog/posts.ts";
import { robotsTxt, sitemapEntries, sitemapXML } from "../lib/seo.ts";

const post: Post = {
  id: "hello-world",
  attrs: {
    title: "Hello World",
    description: "Test post",
    authors: [{ name: "Test", username: "test" }],
    topics: ["meta"],
    date: new Date("2026-10-01T00:00:00Z"),
  },
  html: "",
};

Deno.test("robotsTxt points at the sitemap", () => {
  const robots = robotsTxt("https://etok.me/sitemap.xml");
  assertStringIncludes(robots, "User-agent: *");
  assertStringIncludes(robots, "Allow: /");
  assertStringIncludes(robots, "Sitemap: https://etok.me/sitemap.xml");
});

Deno.test("sitemapEntries includes every post", () => {
  const entries = sitemapEntries([post]);
  assertEquals(entries.map((entry) => entry.loc), [
    "https://etok.me/",
    "https://etok.me/blog/",
    "https://etok.me/blog/hello-world/",
    "https://etok.me/for-agents/",
  ]);
  assertEquals(entries[2].lastmod, "2026-10-01");
});

Deno.test("sitemapXML escapes values", () => {
  const xml = sitemapXML([
    { loc: "https://etok.me/?a=1&b=2", lastmod: "2026-10-01" },
  ]);
  assertStringIncludes(xml, "<loc>https://etok.me/?a=1&amp;b=2</loc>");
  assertStringIncludes(xml, "<lastmod>2026-10-01</lastmod>");
});
