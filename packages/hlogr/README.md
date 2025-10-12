# hlogr

[![CI](https://github.com/gouravkhunger/hlogr/actions/workflows/ci.yml/badge.svg)](https://github.com/gouravkhunger/hlogr/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/hlogr.svg)](https://www.npmjs.org/package/hlogr)

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

This will log requests in the following format by default:

```log
18:53:28 | 200 |   53ms | 192.168.1.10 |   GET   | /user/123 | -
19:15:33 | 200 |   46ms | 192.168.1.22 |   GET   | /health | -
19:45:33 | 500 |   53ms | 10.0.0.8     |   POST  | /api/upload | Invalid request
20:04:22 | 200 |  403ms | 172.17.0.1   |   GET   | /image/42 | -
20:10:19 | 404 |   10ms | 192.168.1.15 |   GET   | /icons/dev.png | Not Found
20:15:33 | 200 |   60ms | 10.0.0.2     |   GET   | /health | -
20:16:49 | 200 |    2ms | 192.168.1.30 |  DELETE | /users/999 | -
```

## Customizations

### Log Format

You can use the building blocks from [`FormatParams`](https://github.com/gouravkhunger/hlogr/blob/main/packages/hlogr/src/types.ts#L20) to define your own log structure.

```ts
await server.register({
  plugin: hlogr,
  options: {
    format: ({ time, method, path, statusCode, latency, remoteAddress }) =>
      `${time} | ${statusCode} | ${latency}ms | ${remoteAddress} | ${method} | ${path}\n`,
  },
});
```

This is useful when creating formatters for each of the parameter. See [`defaultFormat`](https://github.com/gouravkhunger/hlogr/blob/main/packages/hlogr/src/utils.ts#L4) for an example.

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

### IP Extraction

The `getIp` function can be used to manually extract request's origin IP address based on incoming headers or other properties.

```ts
// using a third-party library
// import { getClientIp } from "@supercharge/request-ip";

await server.register({
  plugin: hlogr,
  options: {
    // getIp: getClientIp, // or implement manually
    getIp: (request) => {
      return request.headers["x-real-ip"];
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
