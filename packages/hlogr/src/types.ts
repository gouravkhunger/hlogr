import type { Boom } from "@hapi/boom";
import type { Request } from "@hapi/hapi";

declare module "@hapi/hapi" {
  interface Request {
    hlogrError?: Boom;
  }
}

export type PluginOptions = {
  enabled?: boolean;
  format?: FormatterFn;
  writer?: (log: string) => unknown;
  getIp?: (request: Request) => string | undefined;
};

export type FormatterFn = (params: FormatParams) => string;
export type StyliseFn = (params: FormatParams) => String<FormatParams>;

export type FormatParams = {
  ip: string;
  time: Date;
  pid: number;
  host: string;
  path: string;
  route: string;
  method: string;
  status: number;
  error?: string;
  latency: number;
  referer: string;
  protocol: string;
  hostname: string;
  userAgent: string;
  remotePort: string;
  port?: string | number;
  requestHeaders: Record<string, string>;
  query: Record<string, string | string[]>;
  responseHeaders?: Record<string, string | number | string[] | undefined>;
};

export type String<FormatParams> = {
  [K in keyof FormatParams]: K extends
    | "responseHeaders"
    | "requestHeaders"
    | "query"
    | "port"
    | "pid"
    ? FormatParams[K]
    : string;
};
