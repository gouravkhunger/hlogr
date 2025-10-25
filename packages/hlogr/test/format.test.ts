import { Server } from "@hapi/hapi";
import hlogr, { Formats } from "hlogr";

import { init } from "./setup";

describe("hlogr", () => {
  let server: Server;
  let logs: string[];

  beforeEach(async () => {
    logs = [];
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("uses an in-built log formatter", async () => {
    await server.register({
      plugin: hlogr,
      options: {
        format: Formats.COMMON,
        writer: (log) => logs.push(log),
      }
    });

    const res = await server.inject({
      url: "/",
      method: "GET"
    });

    expect(res.statusCode).toEqual(200);
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain(" - - ");
  });

  it("has a custom log formatter", async () => {
    await server.register({
      plugin: hlogr,
      options: {
        writer: (log) => logs.push(log),
        format: ({ port, path, userAgent }) => `${port} | ${path} | ${userAgent}\n`
      }
    });

    const port = server.info.port;
    let res = await server.inject({
      url: "/",
      method: "GET"
    });

    expect(res.statusCode).toEqual(200);
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain(port);

    res = await server.inject({
      url: "/404",
      method: "GET",
      headers: {
        "User-Agent": "CustomAgent/1.0"
      }
    });

    expect(res.statusCode).toEqual(404);
    expect(logs.length).toBe(2);
    expect(logs[1]).toEqual(`${port} | /404 | CustomAgent/1.0\n`);
  });
});
