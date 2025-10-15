import { stylise, styliseWithColors } from "hlogr/stylise";
import type { FormatterFn } from "hlogr/types";

export const defaultFormat = (colors: boolean): FormatterFn => {
  const style = colors ? styliseWithColors : stylise;
  return (payload) => {
    const { ip, time, path, status, method, latency, error } = style(payload);
    return [time, status, latency, ip, method, path, error].join(" | ") + "\n";
  };
};
