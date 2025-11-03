import type { FormatParams } from "hlogr/types";
import { noop, transform, widthAlign } from "hlogr/utils";

export const stylise = (payload: FormatParams, tabs = false) => {
  const { colors, error, latency } = payload;
  return transform(payload, {
    time: [{ fn: formatTime }],
    status: [{ fn: colorStatus, skip: !colors }],
    ip: [{ fn: widthAlign, skip: !tabs, args: [{ width: 15, align: "left" }] }],
    error: [
      { fn: (err) => err || "-" },
      { fn: color.red, skip: !colors || !error },
    ],
    latency: [
      { fn: formatLatency, skip: !tabs },
      { fn: colorLatency, skip: !colors, args: [{ latency }] },
    ],
    method: [
      { fn: formatMethod, skip: !tabs },
      { fn: colorMethod, skip: !colors },
    ],
  });
};

const formatMethod = (method: string): string =>
  widthAlign(method, { width: 7, align: "center" });

const formatLatency = (latency: number): string =>
  widthAlign(latency, { width: 4, align: "right" }) + "ms";

const formatTime = (date: Date) =>
  date.toISOString().split("T")[1]?.replace("Z", "").split(".")[0] || "-";

const colorMethod = (method: string): string =>
  (methodColor[method.trim()] ?? noop)(method);

const colorLatency = (
  _latency: string,
  { latency }: { latency: number }
): string => {
  if (latency > 1000) return color.red(_latency);
  else if (latency > 500) return color.orange(_latency);
  else if (latency > 200) return color.yellow(_latency);
  else return color.green(_latency);
};

const colorStatus = (status: number): string => {
  if (status >= 500) return color.red(status);
  if (status >= 400) return color.yellow(status);
  if (status >= 300) return color.blue(status);
  if (status >= 200) return color.green(status);
  return status.toString();
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
