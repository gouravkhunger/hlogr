import { FormatterFn } from "hlogr/types";

export const defaultFormat: FormatterFn = (payload) => {
  const { time, pid, method } = payload;
  return `${time.toISOString()} | ${pid} | ${method}\n`;
}
