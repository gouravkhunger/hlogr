import type { StyliseFn } from "hlogr/types";

export const stylise: StyliseFn = (payload) => {
  const { ip, path, time, status, method, latency, error } = payload;
  return {
    ...payload,
    path,
    error: error || "-",
    time: formatTime(time),
    status: status.toString(),
    method: formatMethod(method),
    latency: formatLatency(latency),
    ip: widthAlign(ip, { width: 15, align: "left" }),
  };
};

export const styliseWithColors: StyliseFn = (payload) => {
  const { ip, path, time, status, method, latency, error } = payload;
  return {
    ...payload,
    path,
    time: formatTime(time),
    status: colorStatus(status),
    error: error ? color.red(error) : "-",
    ip: widthAlign(ip, { width: 15, align: "left" }),
    method: colorMethod(method, formatMethod(method)),
    latency: colorLatency(latency, formatLatency(latency)),
  };
};

const widthAlign = (
  value: number | string,
  { width, align }: { width: number; align: "left" | "right" | "center" }
): string => {
  const str = value.toString();
  const maxW = Math.max(width - str.length, 0);
  const end = Math.floor(maxW / 2), start = maxW - end;
  if (align === "right") return " ".repeat(maxW) + str;
  if (align === "left") return str + " ".repeat(maxW);
  return " ".repeat(start) + str + " ".repeat(end);
};

const formatTime = (date: Date) =>
  date.toISOString().split("T")[1]?.replace("Z", "").split(".")[0] || "-";

const colorStatus = (status: number): string => {
  const _status = status.toString();
  if (status >= 500) return color.red(_status);
  if (status >= 400) return color.yellow(_status);
  if (status >= 300) return color.blue(_status);
  if (status >= 200) return color.green(_status);
  return _status;
};

const formatMethod = (method: string): string =>
  widthAlign(method, { width: 7, align: "center" });

const colorMethod = (method: string, formattedMethod: string): string =>
  (methodColor[method] ?? ((m: string) => m))(formattedMethod);

const formatLatency = (latency: number): string =>
  widthAlign(latency, { width: 4, align: "right" }) + "ms";

const colorLatency = (latency: number, formattedLatency: string): string => {
  if (latency > 1000) return color.red(formattedLatency);
  else if (latency > 500) return color.yellow(formattedLatency);
  else if (latency > 200) return color.orange(formattedLatency);
  else return color.green(formattedLatency);
};

const color = {
  red: (text: string) => `\x1b[91m${text}\x1b[0m`,
  green: (text: string) => `\x1b[92m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[93m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[38;5;111m${text}\x1b[0m`,
  orange: (text: string) => `\x1b[38;5;214m${text}\x1b[0m`,
};

const methodColor: Record<string, typeof color.red> = {
  GET: color.green,
  HEAD: color.green,
  POST: color.yellow,
  PUT: color.orange,
  PATCH: color.orange,
  DELETE: color.red,
  OPTIONS: color.blue,
};
