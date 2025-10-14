import type { StyliseFn } from "hlogr/types";

export const stylise: StyliseFn = (payload) => {
  const { ip, path, time, status, method, latency, error } = payload;
  return {
    path,
    time: formatTime(time),
    status: colorStatus(status, formatStatus(status)),
    method: colorMethod(method, formatMethod(method)),
    latency: colorLatency(latency, formatLatency(latency)),
    error: error ? color.red(error) : "-",
    ip: widthAlign(ip, { width: 15, align: "left" }),
  };
};

export const styliseNoColor: StyliseFn = (payload) => {
  const { ip, path, time, status, method, latency, error } = payload;
  return {
    path,
    time: formatTime(time),
    status: formatStatus(status),
    method: formatMethod(method),
    latency: formatLatency(latency),
    error: error || "-",
    ip: widthAlign(ip, { width: 15, align: "left" }),
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

const formatStatus = (status: number): string => {
  return status.toString();
};

const colorStatus = (status: number, formattedStatus: string): string => {
  if (status >= 500) return color.red(formattedStatus);
  if (status >= 400) return color.yellow(formattedStatus);
  if (status >= 300) return color.blue(formattedStatus);
  if (status >= 200) return color.green(formattedStatus);
  return formattedStatus;
};

const formatMethod = (method: string): string => {
  return widthAlign(method, { width: 7, align: "center" });
};

const colorMethod = (method: string, formattedMethod: string): string => {
  return (methodColor[method] ?? ((m: string) => m))(formattedMethod);
};

const formatLatency = (latency: number): string => {
  const aligned = widthAlign(latency, { width: 4, align: "right" });
  return aligned + "ms";
};

const colorLatency = (latency: number, formattedLatency: string): string => {
  let colored;
  const formattedLatencyWithoutMs = formattedLatency.slice(0, -2);
  if (latency > 1000) colored = color.red(formattedLatencyWithoutMs);
  else if (latency > 500) colored = color.yellow(formattedLatencyWithoutMs);
  else if (latency > 200) colored = color.orange(formattedLatencyWithoutMs);
  else colored = color.green(formattedLatencyWithoutMs);
  return colored + formattedLatency.slice(-2);
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
