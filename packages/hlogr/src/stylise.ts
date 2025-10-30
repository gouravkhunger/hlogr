import type { FormatParams } from "hlogr/types";
import { noop, transform } from "hlogr/utils";

export const stylise = (payload: FormatParams, tabs = false) => {
  const { ip, colors, time, status, method, latency, error } = payload;
  return transform(payload, {
    time: [time, { fn: formatTime }],
    status: [status, { fn: colorStatus, disabled: !colors }],
    error: [error || "-", { fn: color.red, disabled: !colors || !error }],
    ip: [ip, { fn: widthAlign, disabled: !tabs, args: [{ width: 15, align: "left" }] }],
    latency: [
      latency,
      { fn: formatLatency, disabled: !tabs },
      { fn: colorLatency, disabled: !colors },
    ],
    method: [
      method.toUpperCase(),
      { fn: formatMethod, disabled: !tabs },
      { fn: colorMethod, disabled: !colors },
    ],
  });
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

const formatMethod = (method: string): string =>
  widthAlign(method, { width: 7, align: "center" });

const formatLatency = (latency: string): string =>
  widthAlign(latency, { width: 4, align: "right" }) + "ms";

const formatTime = (date: Date) =>
  date.toISOString().split("T")[1]?.replace("Z", "").split(".")[0] || "-";

export const colorStatus = (status: number): string => {
  const _status = status.toString();
  if (status >= 500) return color.red(_status);
  if (status >= 400) return color.yellow(_status);
  if (status >= 300) return color.blue(_status);
  if (status >= 200) return color.green(_status);
  return _status;
};

const colorMethod = (method: string): string =>
  (methodColor[method.trim()] ?? noop)(method);

const colorLatency = (latency: number): string => {
  if (latency > 1000) return color.red(latency);
  else if (latency > 500) return color.yellow(latency);
  else if (latency > 200) return color.orange(latency);
  else return color.green(latency);
};

const color = {
  red: (text: string | number) => `\x1b[91m${text}\x1b[0m`,
  green: (text: string | number) => `\x1b[92m${text}\x1b[0m`,
  yellow: (text: string | number) => `\x1b[93m${text}\x1b[0m`,
  blue: (text: string | number) => `\x1b[38;5;111m${text}\x1b[0m`,
  orange: (text: string | number) => `\x1b[38;5;214m${text}\x1b[0m`,
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
