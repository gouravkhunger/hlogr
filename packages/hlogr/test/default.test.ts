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
      }
    });
  });

  afterEach(async () => {
    await server.stop();
  });

  it("runs with a default logger", async () => {
    let res = await server.inject({
      url: "/",
      method: "GET"
    });

    expect(res.statusCode).toEqual(200);
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("200");
    expect(logs[0]).toContain("GET");

    res = await server.inject({
      url: "/",
      method: "POST",
      payload: {
        key: "value"
      }
    });

    expect(res.statusCode).toEqual(200);
    expect(logs.length).toBe(2);
    expect(logs[1]).toContain("200");
    expect(logs[1]).toContain("POST");

    res = await server.inject({
      url: "/404",
      method: "GET"
    });

    expect(res.statusCode).toEqual(404);
    expect(logs.length).toBe(3);
    expect(logs[2]).toContain("404");
    expect(logs[2]).toContain("GET");
  });
});
