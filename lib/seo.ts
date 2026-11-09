export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  priority?: string;
}

export function robotsTxt(sitemapURL: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL}\n`;
}

export function sitemapXML(entries: SitemapEntry[]): string {
  const urls = entries.map((entry) => {
    const fields = [`    <loc>${escapeXML(entry.loc)}</loc>`];
    if (entry.lastmod) {
      fields.push(`    <lastmod>${escapeXML(entry.lastmod)}</lastmod>`);
    }
    if (entry.priority) {
      fields.push(`    <priority>${escapeXML(entry.priority)}</priority>`);
    }
    return `  <url>\n${fields.join("\n")}\n  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function escapeXML(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
