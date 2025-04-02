[Bun]: https:bun.sh/
[Electron]: https://www.electronjs.org/
[Tauri]: https://tauri.app/
[TypeDoc]: https://typedoc.org/
[TypeScript]: https://typescriptlang.org/
[API Documentation]: https://studiokeywi.github.io/banjo/api
[Examples]: https://studiokeywi.github.io/banjo/examples
[Guides]: https://studiokeywi.github.io/banjo/guides

# @studiokeywi/banjo

> The fast and plucky game framework from studioKeywi 🪕 Zero dependencies 🪕 Tree shakeable exports 🪕 Built with ❤️, [Bun], [TypeDoc], and [TypeScript].

`@studiokeywi/banjo` is a TypeScript game framework meant to be run in the browser or a similar web view (such as through [Electron] or [Tauri]) through the build process of your choice. While dependency free, `banjo` expects to have access to browser-provided functionality such as the `cancelAnimationFrame`/`requestAnimationFrame` functions, the `HTMLImageElement`/`Image` objects, and the `<canvas>` element. If you can provide these where your code will run, then `banjo` should run there as well!

- 🚫 Dependency Free  
  studioKeywi wants you to have confidence that the code we provide doesn't rely on outside vectors. We may not be the best choice, but we believe we are a transparent choice when it comes to understanding our functionality.
- 🌳 Tree Shakeable Exports  
  `banjo` exposes all of its functionality through its `exports` map, separated out by concern. That way, you can be sure that your games only contain the minimum code required for your final product.
- ⚡ Powered by Bun and TypeScript  
  Bun provides our development cycle with speed and built-in functionality that reduces our development load.  
  TypeScript provides our users with a better development experience and flexibility in their build patterns.

## Installation

`banjo` is published to the NPMJS registry and can be installed with any compatible package manager. Depending on your build process, you may be able to install as a development dependency instead.

### Bun

```shell
bun add @studiokeywi/banjo
# or
bun add -D @studiokeywi/banjo
```

### Deno

```shell
deno add npm:@studiokeywi/banjo
# or
deno add -D npm:@studiokeywi/banjo
```

### Node

```shell
npm install @studiokeywi/banjo
# or
npm install -D @studiokeywi/banjo
```

## Additional Links

- [API Documentation]
- [Examples]
- [Guides]
