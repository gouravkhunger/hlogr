import { stylise, styliseNoColor } from "hlogr/stylise";
import type { FormatterFn } from "hlogr/types";

export const defaultFormat: FormatterFn = (payload) => {
  const { ip, time, path, status, method, latency, error } = stylise(payload);
  return [time, status, latency, ip, method, path, error].join(" | ") + "\n";
};

export const noColorFormat: FormatterFn = (payload) => {
  const { ip, time, path, status, method, latency, error } = styliseNoColor(payload);
  return [time, status, latency, ip, method, path, error].join(" | ") + "\n";
};
