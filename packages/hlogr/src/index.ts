import type { Server } from "@hapi/hapi";

import pkg from "hlogr/package.json";
import { PluginOptions } from "hlogr/types";
import { defaultFormat } from "hlogr/utils";

const register = async (server: Server, options?: PluginOptions) => {
  const {
    enabled = true,
    format = defaultFormat,
    writer = process.stdout.write.bind(process.stdout),
  } = options || {};

  if (!enabled) return;

  server.events.on("response", (request) => {
    const { method, path, info } = request;

    const payload = {
      path,
      method,
      time: new Date(),
      pid: process.pid,
      responseTime: info.responded - info.received
    };

    writer(format(payload));
  });
}

export default {
  pkg,
  register,
  once: true
};
