import { FormatterFn } from "hlogr/types";

export const defaultFormat: FormatterFn = (payload) => {
  const { ip, time, path, status, method, latency, error } = payload;
  return (
    [
      formatTime(time),
      status,
      `${widthAlign(latency, { width: 4, align: "right" })}ms`,
      widthAlign(ip, { width: 15, align: "left" }),
      widthAlign(method, { width: 7, align: "center" }),
      path,
      error || "-",
    ].join(" | ") + "\n"
  );
};

const widthAlign = (
  value: number | string,
  { width, align }: { width: number; align: "left" | "right" | "center" }
): string => {
  const str = value.toString();
  const maxW = Math.max(width - str.length, 0);
  const start = Math.floor(maxW / 2), end = maxW - start;
  if (align === "right") return " ".repeat(maxW) + str;
  if (align === "left") return str + " ".repeat(maxW);
  return " ".repeat(start) + str + " ".repeat(end);
};

const formatTime = (date: Date) =>
  date.toISOString().split("T")[1]?.replace("Z", "").split(".")[0] || "-";
