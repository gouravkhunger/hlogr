import type { Response, String, FormatParams, TransformFn } from "hlogr/types";

export const noop = <T>(m: T): T => m;

export const transform: TransformFn = (payload, transforms) => {
  const result: Record<string, typeof payload[keyof FormatParams]> = {};
  for (const key in payload) {
    const transform = transforms[key as keyof FormatParams];
    if (!Array.isArray(transform) || transform.length < 2) {
      result[key] = payload[key as keyof FormatParams];
      continue;
    }
    const [initial, ...rest] = transform;
    result[key] = initial;
    for (const { fn, args, disabled } of rest) {
      if (disabled === true) continue;
      result[key] = fn(result[key], ...(args || []));
    }
  }
  return result as String<FormatParams>;
};

export const widthAlign = (
  value: number | string,
  { width, align }: { width: number; align: "left" | "right" | "center" }
): string => {
  const str = value.toString();
  const maxW = Math.max(width - str.length, 0);
  const end = Math.floor(maxW / 2), start = maxW - end;
  if (align === "right") return " ".repeat(maxW) + str;
  if (align === "left") return str + " ".repeat(maxW);
  return " ".repeat(start) + str + " ".repeat(end);
};

export const getBytesSent = (response: Response): number => {
  if (typeof response === "string") {
    return Buffer.byteLength(response);
  } else if (Buffer.isBuffer(response)) {
    return response.length;
  } else if (typeof response === "object") {
    const json = JSON.stringify(response);
    return Buffer.byteLength(json);
  }
  return 0;
};
