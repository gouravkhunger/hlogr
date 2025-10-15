import Boom from "@hapi/boom";
import type { Server, ResponseObject } from "@hapi/hapi";

import pkg from "hlogr/package.json";
import { PluginOptions } from "hlogr/types";
import { defaultFormat } from "hlogr/utils";

const register = async (server: Server, options?: PluginOptions) => {
  const {
    getIp,
    colors = true,
    enabled = true,
    format = defaultFormat(colors),
    writer = process.stdout.write.bind(process.stdout),
  } = options || {};

  if (!enabled) return;

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (Boom.isBoom(response)) request.hlogrError = response;
    return h.continue;
  });

  server.events.on("response", (request) => {
    const { settings, info: serverInfo } = server;
    const { method, path, info, route, query, headers, response, hlogrError } = request;

    const payload = {
      path,
      query,
      host: info.host,
      time: new Date(),
      pid: process.pid,
      route: route.path,
      port: settings.port,
      referer: info.referrer,
      hostname: info.hostname,
      requestHeaders: headers,
      remotePort: info.remotePort,
      method: method.toUpperCase(),
      protocol: serverInfo.protocol,
      userAgent: headers["user-agent"] || "",
      latency: info.responded - info.received,
      ip: getIp?.(request) || info.remoteAddress,
      error: hlogrError ? hlogrError.message : undefined,
      status: hlogrError ? hlogrError.output.statusCode : (response as ResponseObject).statusCode,
      responseHeaders: hlogrError ? hlogrError.output.headers : (response as ResponseObject).headers,
    };

    writer(format(payload));
  });
};

export default {
  pkg,
  register,
  once: true
};
