import type { Route } from "@std/http/unstable-route";
import { route } from "@std/http/unstable-route";
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
    handler(request, _info) {
      const url = new URL(request.url);
      const destinationURL = go(
        url,
        {
          "and": "https://and.etok.me",
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
];

export function defaultHandler(_request: Request) {
  return new Response("Not found", { status: 404 });
}

export const router = route(routes, defaultHandler);
