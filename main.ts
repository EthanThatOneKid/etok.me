import type { Route } from "@std/http/unstable-route";
import { route } from "@std/http/unstable-route";
import { serveDir } from "@std/http/file-server";
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
      const url = new URL(request.url);
      const destinationURL = go(
        url,
        {
          "and": "https://and.etok.me",
          "and/buster": "/and/buster",
          "and/dad": "/and/dad",
          "and/mom": "/and/mom",
          "codes": "https://etok.codes",
          "id": "https://id.etok.me",
        },
      );
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
