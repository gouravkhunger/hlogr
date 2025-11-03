import type { Boom, Payload } from "@hapi/boom";
import type { Request, ResponseObject } from "@hapi/hapi";

declare module "@hapi/hapi" {
  interface Request {
    hlogrError?: Boom;
  }
}

export type PluginOptions = {
  colors?: boolean;
  enabled?: boolean;
  format?: FormatterFn;
  writer?: (log: string) => unknown;
  getIp?: (request: Request) => string | undefined;
};

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
  colors?: boolean;
  userAgent: string;
  bytesSent: number;
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
    | "bytesSent"
    | "query"
    | "port"
    | "pid"
    ? FormatParams[K]
    : string;
};

export type Response = ResponseObject["source"] | Payload;
export type FormatterFn = (params: FormatParams) => string;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TransformFn = (
  payload: FormatParams,
  transforms: Partial<{
    [K in keyof FormatParams]:
      {
        args?: any[];
        skip?: boolean;
        fn: (...args: any[]) => string;
      }[];
  }>
) => String<FormatParams>;
