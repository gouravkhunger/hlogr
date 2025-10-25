import type { FormatterFn, FormatTypes } from "hlogr/types";

export const LogFormats: Record<FormatTypes, FormatterFn> = {
  DEFAULT: (payload) => {
    const { ip, time, path, status, method, latency, error } = payload;
    return [time, status, latency, ip, method, path, error].join(" | ") + "\n";
  },
  COMMON: (payload) => {
    const { ip, time, path, protocol, status, method } = payload;
    return `${ip} - - [${time}] "${method} ${path} ${protocol}" ${status} bytesSent\n`;
  },
  COMBINED: (payload) => {
    const { ip, time, path, protocol, status, method, referer, userAgent } = payload;
    return `${ip} - - [${time}] "${method} ${path} ${protocol}" ${status} bytesSent "${referer}" "${userAgent}"\n`;
  },
  JSON: (payload) => {
    const { ip, time, path, status, method } = payload;
    return `{"time":"${time}","ip":"${ip}","method":"${method}","url":"${path}","status":${status},"bytesSent":\n`;
  },
  ECS: (payload) => {
    const { ip, time, path, protocol, status, method } = payload;
    return `{"@timestamp":"${time}","ecs":{"version":"1.6.0"},"client":{"ip":"${ip}"},"http":{"request":{"method":"${method}","url":"${path}","protocol":"${protocol}"},"response":{"status_code":${status},"body":{"bytes":}}},"log":{"level":"INFO","logger":"fiber"},"message":"${method} ${path} responded with ${status}"}\n`;
  }
};
