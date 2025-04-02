const server = Bun.serve({
  async fetch({ url }) {
    const path = new URL(url).pathname;
    if (path === '/game.ts') {
      const [body] = (await Bun.build({ entrypoints: ['./game.ts'] })).outputs;
      return new Response(body);
    }
    if (path.startsWith('/src:')) {
      return new Response(Bun.file(path.slice(5)));
    }
    return new Response(Bun.file('./index.html'));
  },
});

console.log(`Now listening on http://${server.hostname}:${server.port}\n${'-'.repeat(25 + server.hostname.length + server.port.toString().length)}`);
