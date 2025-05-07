import { parse } from "@std/jsonc";
import { go } from "go.fart.tools";

if (import.meta.main) {
  const output = Deno.args[0] ?? "./static";
  await Deno.mkdir(output, { recursive: true });
  await Deno.copyFile("./index.html", `${output}/index.html`);

  const shortlinks = parse(
    await Deno.readTextFile(new URL(import.meta.resolve("./shortlinks.jsonc")))
  ) as Record<string, string>;
  for (const alias of Object.keys(shortlinks)) {
    const url = go(new URL(`https://etok.me/${alias}`), shortlinks);
    await Deno.mkdir(`${output}/${alias}`, { recursive: true });
    await Deno.writeTextFile(
      `${output}/${alias}/index.html`,
      `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=${url}" />
  </head>
</html>`
    );
  }
}
