export type PluginOptions = {
  enabled?: boolean;
  format?: FormatterFn;
  writer?: (log: string) => unknown;
}

export type FormatterFn = (params: FormatParams) => string;

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
}
