import type { HTTP_METHODS } from "@hapi/hapi";

export type FormatParams = {
  time: Date;
  pid: number;
  method: Lowercase<HTTP_METHODS>;
}

export type FormatterFn = (params: FormatParams) => string;

export type PluginOptions = {
  enabled?: boolean;
  format?: FormatterFn;
}
