# hlogr

An opinionated drop-in request logger for Hapi.js servers. Supports custom formats and write targets.

## Install

```shell
npm install hlogr
```

## Quick Start

```ts
import Hapi from "@hapi/hapi";
import hlogr from "hlogr";

export let server: Server;

const init = async (): Promise<Server> => {
  server = Hapi.server({ /* config */ });
  await server.register(hlogr);
  // other setup
  return server;
};

init().then(() => server.start());
```

## Customizations

### Log Format

You can use the building blocks from [`FormatParams`](https://github.com/gouravkhunger/hlogr/blob/main/packages/hlogr/src/types.ts#L9) to define your own log structure.

```ts
await server.register({
  plugin: hlogr,
  options: {
    format: ({ time, method, path, statusCode, latency, remoteAddress }) =>
      `${time} | ${statusCode} | ${latency}ms | ${remoteAddress} | ${method} | ${path}\n`,
  },
});
```

This is useful when creating formatters for each of the parameter. See [`defaultFormat`](https://github.com/gouravkhunger/hlogr/blob/main/packages/hlogr/src/utils.ts#L3) for an example.

### Custom Write Target

By default, logs are written to `process.stdout`. You can provide your own write target by providing a callback for the writer.

```ts
await server.register({
  plugin: hlogr,
  options: {
    writer: (log) => {
      // write to a file, external service, etc.
      service.send(log);
    },
  },
});
```

### Control Logging

The plugin has a kill switch to disable logging.

```ts
await server.register({
  plugin: hlogr,
  options: {
    enabled: false,
  },
});
```

## Development

Tested with Node.js v20+.

```shell
git clone https://github.com/gouravkhunger/hlogr
cd hlogr
npm install

# run demo server
npm run dev

# other commands
npm run check-types lint test
```

## License

[MIT](https://github.com/gouravkhunger/hlogr/blob/main/LICENSE)
