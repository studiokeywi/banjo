# Quick Start

This example, using Bun, demonstrates Banjo in under 125 lines of code. All of these files can all be found within the [`quick-start` examples folder of the GitHub repo](https://github.com/studiokeywi/banjo/tree/primary/examples/quick-start). You can clone the repo, open a shell in the `examples/quick-start` folder, then use `bun server.ts` to run:

!!! info "Bun is not a requirement to use Banjo. It's just our favorite way to prototype and build"

=== "quick-start/index.html"

    This is a simple template to provide minimal styling and the elements used by the "game".

    ```html linenums="1"
    --8<-- "examples/quick-start/index.html"
    ```

=== "quick-start/game.ts"

    This contains the actual "game" logic. It updates a `<div>` with the current estimated engine FPS and TPS, animates a round `<div>` across the screen in a bouncing ball pattern, and uses a watcher to monitor the engine pause state separately from the engine itself.

    ```typescript linenums="1"
    --8<-- "examples/quick-start/game.ts"
    ```

=== "quick-start/server.ts"

    This contains a simple Bun server to host the HTML and transpile the "game" logic on the fly.

    ```typescript linenums="1"
    --8<-- "examples/quick-start/server.ts"
    ```
