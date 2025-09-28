import { FormatterFn } from "hlogr/types";

export const defaultFormat: FormatterFn = (payload) => {
  const { ip, time, path, status, latency, method, error } = payload;
  return `${_time(time)} | ${status} | ${_latency(latency)} | ${ip} | ${method} | ${path} | ${error || "-"}\n`;
}

const _latency = (latency: number) => latency.toString().padStart(4, " ") + "ms";
const _time = (date: Date) => date.toISOString().split("T")[1]?.replace("Z", "").split(".")[0] || "-";
