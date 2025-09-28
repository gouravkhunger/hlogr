import { FormatterFn } from "hlogr/types";

export const defaultFormat: FormatterFn = (payload) => {
  const { ip, time, path, status, method, latency, error } = payload;
  return [
    formatTime(time),
    status,
    `${widthAlign(latency, 4, "right")}ms`,
    ip,
    widthAlign(method, 7, "center"),
    path,
    error || "-"
  ].join(" | ") + "\n";
}

const widthAlign = (value: number | string, length: number, align: "right" | "center"): string => {
  const str = value.toString();
  const width = Math.max(length - str.length, 0);
  const start = Math.floor(width / 2), end = width - start;
  if (align === "right") return " ".repeat(width) + str;
  return " ".repeat(start) + str + " ".repeat(end);
};

const formatTime = (date: Date) => date.toISOString().split("T")[1]?.replace("Z", "").split(".")[0] || "-";
