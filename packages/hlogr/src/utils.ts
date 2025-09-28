import { FormatterFn } from "hlogr/types";

export const defaultFormatter: FormatterFn = (payload) => {
  const { time, pid, method } = payload;
  return `${time.toISOString()} | ${pid} | ${method}`;
}
