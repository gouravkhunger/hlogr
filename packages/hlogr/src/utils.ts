import type { Payload } from "@hapi/boom";
import type { ResponseObject } from "@hapi/hapi";

export const getBytesSent = (response: ResponseObject["source"] | Payload): number => {
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
