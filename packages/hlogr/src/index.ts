import Boom from "@hapi/boom";
import type { Server, ResponseObject } from "@hapi/hapi";

import pkg from "hlogr/package.json";
import { LogFormats } from "hlogr/formats";
import { getBytesSent } from "hlogr/utils";
import type { PluginOptions } from "hlogr/types";

const register = async (server: Server, options?: PluginOptions) => {
  const {
    getIp,
    colors = true,
    enabled = true,
    format = LogFormats.DEFAULT,
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
    const { method, path, info, route, query, headers, response, hlogrError } =
      request;

    const status = hlogrError
      ? hlogrError.output.statusCode
      : (response as ResponseObject).statusCode;

    if (typeof status === "undefined") return;

    const payload = {
      path,
      query,
      status,
      colors,
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
      responseHeaders: hlogrError
        ? hlogrError.output.headers
        : (response as ResponseObject).headers,
      bytesSent: hlogrError
        ? getBytesSent(hlogrError.output.payload)
        : getBytesSent((response as ResponseObject).source),
    };

    writer(format(payload));
  });
};

export { LogFormats };
export default {
  pkg,
  register,
  once: true,
};
