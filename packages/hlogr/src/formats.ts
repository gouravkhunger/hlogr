import type { FormatterFn } from "hlogr/types";

const DEFAULT: FormatterFn = (payload) => {
  const { ip, time, path, status, method, latency, error } = payload;
  return [time, status, latency, ip, method, path, error].join(" | ") + "\n";
};

const COMMON: FormatterFn = (payload) => {
  const { ip, time, path, protocol, status, method } = payload;
  return `${ip} - - [${time}] "${method} ${path} ${protocol}" ${status} bytesSent\n`;
};

const COMBINED: FormatterFn = (payload) => {
  const { ip, time, path, protocol, status, method, referer, userAgent } = payload;
  return `${ip} - - [${time}] "${method} ${path} ${protocol}" ${status} bytesSent "${referer}" "${userAgent}"\n`;
};

const JSON: FormatterFn = (payload) => {
  const { ip, time, path, status, method } = payload;
  return `{"time":"${time}","ip":"${ip}","method":"${method}","url":"${path}","status":${status},"bytesSent":\n`;
};

const ECS: FormatterFn = (payload) => {
  const { ip, time, path, protocol, status, method } = payload;
  return `{"@timestamp":"${time}","ecs":{"version":"1.6.0"},"client":{"ip":"${ip}"},"http":{"request":{"method":"${method}","url":"${path}","protocol":"${protocol}"},"response":{"status_code":${status},"body":{"bytes":}}},"log":{"level":"INFO","logger":"fiber"},"message":"${method} ${path} responded with ${status}"}\n`;
};

export const LogFormats = { DEFAULT, COMMON, COMBINED, JSON, ECS };
