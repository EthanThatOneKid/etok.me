# [etok.me](https://etok.me/)

Ethan "[**@EthanThatOneKid**](https://etok.codes/)" Davidson's official
portfolio website.

## Development

1\. Install the Deno toolchain:
<https://deno.land/manual/getting_started/installation>

2\. Start the project:

```sh
deno task start
```

This will watch the project directory and restart as changes are made.

## Redirection & Shortlinks

This project utilizes a "404 page" gimmick to handle dynamic redirection and
shortlinks on GitHub Pages. When a requested path does not match a static file,
GitHub Pages serves the
[custom 404 page](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
located at `static/404.html`.

This 404 page uses the [`@fartlabs/go`](https://github.com/fartlabs/go) library
to parse the URL and redirect users to the appropriate destination as defined in
[`shortlinks.jsonc`](./shortlinks.jsonc).

This also enables subpath redirection, allowing for convenient self-links. For
example, [`etok.me/codes/etok.me`](https://etok.me/codes/etok.me) will redirect
to
[`github.com/EthanThatOneKid/etok.me`](https://github.com/EthanThatOneKid/etok.me).

---

Programmed with 💖 by [**@EthanThatOneKid**](https://etok.codes/)
