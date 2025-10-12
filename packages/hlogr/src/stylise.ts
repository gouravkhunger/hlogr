import type { StyliseFn } from "hlogr/types";

export const stylise: StyliseFn = (payload) => {
  const { ip, time, status, method, latency, error } = payload;
  return {
    ...payload,
    time: formatTime(time),
    status: formatStatus(status),
    method: formatMethod(method),
    latency: formatLatency(latency),
    error: error ? color.red(error) : "-",
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
  if (status >= 500) return color.red(status.toString());
  if (status >= 400) return color.yellow(status.toString());
  if (status >= 300) return color.blue(status.toString());
  if (status >= 200) return color.green(status.toString());
  return status.toString();
};

const formatMethod = (method: string): string => {
  const aligned = widthAlign(method, { width: 7, align: "center" });
  return (methodColor[method] ?? ((m: string) => m))(aligned);
};

const formatLatency = (latency: number): string => {
  let colored;
  const aligned = widthAlign(latency, { width: 4, align: "right" });
  if (latency > 1000) colored = color.red(aligned);
  else if (latency > 500) colored = color.yellow(aligned);
  else if (latency > 200) colored = color.orange(aligned);
  else colored = color.green(aligned);
  return colored + "ms";
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
