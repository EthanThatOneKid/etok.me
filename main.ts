import type { Route } from "@std/http/unstable-route";
import { route } from "@std/http/unstable-route";
import { serveDir } from "@std/http/file-server";
import { parse } from "@std/jsonc";
import { go } from "go.fart.tools";

export default {
  fetch(request) {
    return router(request);
  },
} satisfies Deno.ServeDefaultExport;

export const routes: Route[] = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/:path*" }),
    handler(request) {
      const destinationURL = go(new URL(request.url), shortlinks);
      return new Response(
        null,
        {
          status: 301,
          headers: {
            "Location": destinationURL.toString(),
          },
        },
      );
    },
  },
  {
    method: "GET",
    handler(_request) {
      // https://deno.com/blog/deploy-cache-api
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/*" }),
    handler(request) {
      return serveDir(
        request.clone(),
        {
          fsRoot: "./static",
          showIndex: true,
        },
      );
    },
  },
];

export function defaultHandler(_request: Request) {
  return new Response("Not found", { status: 404 });
}

export const router = route(routes, defaultHandler);

export const shortlinks = parse(
  await Deno.readTextFile(
    new URL("./static/shortlinks.jsonc", import.meta.url),
  ),
);
