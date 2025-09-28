# hlogr

An opinionated drop-in request logger for Hapi.js servers. Supports custom formats and write targets.

## Install

```shell
npm install hlogr
```

## Usage

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

View the [full documentation](./packages/hlogr/README.md) for detailed API reference.

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

[MIT](./LICENSE)
