import { Server } from "@hapi/hapi";
import hlogr from "hlogr";

import { init } from "./setup";

describe("hlogr", () => {
  let server: Server;
  let logs: string[];

  beforeEach(async () => {
    logs = [];
    server = await init();
    await server.register({
      plugin: hlogr,
      options: {
        writer: (log) => logs.push(log),
      },
    });
  });

  afterEach(async () => {
    await server.stop();
  });

  it("formats with colors", async () => {
    const res = await server.inject({
        url: "/",
        method: "GET"
    });

    expect(res.statusCode).toEqual(200);
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("\x1b[");
  });
});
