[Bun]: https:bun.sh/
[Electron]: https://www.electronjs.org/
[Material for MkDocs]: https://squidfunk.github.io/mkdocs-material/
[Tauri]: https://tauri.app/
[TypeDoc]: https://typedoc.org/
[TypeScript]: https://typescriptlang.org/

# @studiokeywi/banjo

!!! abstract "The fast and plucky game framework from studioKeywi 🪕 Zero dependencies 🪕 Tree shakeable exports 🪕 Built with ❤️, [Bun], and [TypeScript]."

![NPM Version](https://img.shields.io/npm/v/@studiokeywi/banjo)
![NPM Type Definitions](https://img.shields.io/npm/types/@studiokeywi/banjo)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/@studiokeywi/banjo)
![NPM License](https://img.shields.io/npm/l/@studiokeywi/banjo)

`@studiokeywi/banjo` is a TypeScript game framework meant to be run in the browser or a similar web view (such as through [Electron] or [Tauri]) through the build process of your choice. While dependency free, `banjo` expects to have access to browser-provided functionality such as the `cancelAnimationFrame`/`requestAnimationFrame` functions, the `HTMLImageElement`/`Image` objects, and the `<canvas>` element. If you can provide these where your code will run, then `banjo` should run there as well!

!!! info "These docs are powered by [Material for MkDocs] and [TypeDoc]"

- 🚫 Dependency Free  
  studioKeywi wants you to have confidence that the code we provide doesn't rely on outside vectors. We may not be the best choice, but we believe we are a transparent choice when it comes to understanding our functionality.
- 🌳 Tree Shakeable Exports  
  `banjo` exposes all of its functionality through its `exports` map, separated out by concern. That way, you can be sure that your games only contain the minimum code required for your final product.
- ⚡ Powered by Bun and TypeScript  
  Bun provides our development cycle with speed and built-in functionality that reduces our development load.  
  TypeScript provides our users with a better development experience and flexibility in their build patterns.

## Installation

`banjo` is published to the NPMJS registry and can be installed with any compatible package manager. Depending on your build process, you may be able to install as a development dependency instead.

=== "Bun"

    ```shell
    bun add @studiokeywi/banjo
    # or
    bun add -D @studiokeywi/banjo
    ```

=== "Deno"

    ```shell
    deno add npm:@studiokeywi/banjo
    # or
    deno add -D npm:@studiokeywi/banjo
    ```

=== "Node"

    ```shell
    npm install @studiokeywi/banjo
    # or
    npm install -D @studiokeywi/banjo
    ```

## Quick Start

Check out the [quick start](./examples/quick-start.md) in the examples section of the docs for a project that demonstrates Banjo in under 150 lines of code

## Features

`banjo` provides exports across a wide variety of concerns. ⚠️ indicates an undeveloped/unfinished feature. 📋 indicates incomplete documentation:

??? warning "bootstrap 📋"

    Utilities to be run as part of a loading process, such as detecting the expected monitor refresh rate or loading audio/visual assets

    [API Docs](./api/modules/bootstrap.html)

??? success "chrono"

    A helper format to make it easier to translate different resolutions of time (such as milliseconds, minutes, and days) across `banjo` functions

    [API Docs](./api/modules/chrono.html)

??? success "emitter"

    A wrapper around the native `EventTarget` that provides the more modern `emit/off/on/once` API over `addEventListener/dispatchEvent/removeEventListener` as well as improved IntelliSense

    [API Docs](./api/modules/emitter.html)

??? abstract "engine"

    The core "game engine" in terms of responsibility. Features an `emitter` that can be used across game concerns, a `loop` that executes provided code, and an `input/keyboard` handler

    [API Docs](./api/modules/engine.html)

??? warning "fsm 📋"

    General purpose finite state machine pattern

    [API Docs](./api/modules/fsm.html)

??? abstract "hof"

    General purpose higher-order functions such as `debounce` and `throttle`

    [API Docs](./api/modules/hof.html)

??? success "index"

    Information about <code>banjo</code> itself

    [API Docs](./api/modules/index.html)

??? warning "input/controller 📋"

    Event handling for generic game controllers

    [API Docs](./api/modules/input_controller.html)

??? abstract "input/keyboard"

    Event handling for keyboards

    [API Docs](./api/modules/input_keyboard.html)

??? abstract "input/keys"

    Constant values related to keyboard events and utility functions to help with "meta" state for keyboard events

    [API Docs](./api/modules/input_keys.html)

??? warning "input/mouse 📋"

    Event handling for mice

    [API Docs](./api/modules/input_mouse.html)

??? abstract "loop"

    A rate-limited loop pattern. Designed to execute an "update" function at a provided tick rate, and a "render" function at the user's monitor's refresh rate

    [API Docs](./api/modules/loop.html)

??? success "math/constants"

    Frequently used mathematic constants, usually related to circular values such as fractions/multiples of tau and conversions between radians and degrees

    [API Docs](./api/modules/math_constants.html)

??? success "math/conversions"

    Functions to convert numeric values, such as circular conversions or value clamping

    [API Docs](./api/modules/math_conversions.html)

??? warning "math/easing"

    Easing or shaping functions that modify values between [0-1] in predictable ways

    [API Docs](./api/modules/math_easing.html)

??? warning "math/geometry"

    2D convex polygonal/circular representations and utilities for detecting and calculating various intersections and overlaps

    [API Docs](./api/modules/math_geometry.html)

??? warning "math/m3 📋"

    3D matrix math utilities

    [API Docs](./api/modules/math_m3.html)

??? warning "math/m4 📋"

    4D matrix math utilities

    [API Docs](./api/modules/math_m4.html)

??? success "math/random"

    Simple API wrapping around arbitrary pseudo-random number generation algorithms and their common utilizations (such as random integers and shuffling arrays)

    [API Docs](./api/modules/math_random.html)

??? success "math/v2"

    2D vector math utilities

    [API Docs](./api/modules/math_v2.html)

??? warning "math/v3 📋"

    3D vector math utilities

    [API Docs](./api/modules/math_v3.html)

??? success "pool"

    A utility for creating object pools that utilizes the proposed [explicit resource management :octicons-link-external-24:](https://github.com/tc39/proposal-explicit-resource-management){: title="Explicit Resource Management Proposal (opens in a new tab/window)" target="\_blank" rel="noopener" } API to clear and restore objects to the pool when unused

    [API Docs](./api/modules/pool.html)

??? warning "rendering/canvas 📋"

    Utilities for working with `<canvas>`, `OffscreenCanvas`, and web workers

    [API Docs](./api/modules/rendering_canvas.html)

??? warning "rendering/webgl 📋"

    Utilities for working with `WebGL2RenderingContext`

    [API Docs](./api/modules/rendering_webgl.html)

??? success "ringArray"

    A generator-wrapped view into an array that allows jumping and infinite stepping through its contents, as well as basic array-like functions such as insertion, removal, and viewing at an index

    [API Docs](./api/modules/ringArray.html)

??? success "timing"

    Utilities for viewing performance timeline entries during selected time periods

    [API Docs](./api/modules/timing.html)

??? success "types"

    General utility types for internal and external use

    [API Docs](./api/modules/types.html)

??? success "watcher"

    Configurable object that can manage executing functions under a variety of logical and/or timing constraints

    [API Docs](./api/modules/watcher.html)
