import type { Route } from "@std/http/unstable-route";
import { route } from "@std/http/unstable-route";

const GITHUB_URL = new URL("https://github.com/EthanThatOneKid");

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/" }),
    handler: () => Response.redirect(GITHUB_URL),
  },
];

function defaultHandler(_request: Request) {
  return new Response("Not found", { status: 404 });
}

if (import.meta.main) {
  Deno.serve(route(routes, defaultHandler));
}
