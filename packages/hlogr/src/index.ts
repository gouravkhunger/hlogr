import Boom from "@hapi/boom";
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
    const { settings, info: serverInfo } = server;
    const { method, path, info, route, query, headers, response } = request;

    const isBoom = Boom.isBoom(response);

    const payload = {
      path,
      query,
      host: info.host,
      time: new Date(),
      pid: process.pid,
      route: route.path,
      port: settings.port,
      ip: info.remoteAddress,
      referer: info.referrer,
      hostname: info.hostname,
      requestHeaders: headers,
      remotePort: info.remotePort,
      method: method.toUpperCase(),
      protocol: serverInfo.protocol,
      userAgent: headers["user-agent"] || "",
      latency: info.responded - info.received,
      error: isBoom ? response.message : undefined,
      status: isBoom ? response.output.statusCode : response.statusCode,
      responseHeaders: isBoom ? response.output.headers : response.headers,
    };

    writer(format(payload));
  });
}

export default {
  pkg,
  register,
  once: true
};
