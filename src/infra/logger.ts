export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? "info";

function shouldLog(level: LogLevel) {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[CURRENT_LEVEL];
}

function formatMessage(level: LogLevel, message: string, meta?: unknown) {
  const prefix = {
    debug: "🧠",
    info: "ℹ️",
    warn: "⚠️",
    error: "❌",
  }[level];

  return [
    `${prefix} [${level.toUpperCase()}] ${message}`,
    meta ? JSON.stringify(meta, null, 2) : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export const logger = {
  debug(message: string, meta?: unknown) {
    if (!shouldLog("debug")) return;
    console.debug(formatMessage("debug", message, meta));
  },
  info(message: string, meta?: unknown) {
    if (!shouldLog("info")) return;
    console.info(formatMessage("info", message, meta));
  },
  warn(message: string, meta?: unknown) {
    if (!shouldLog("warn")) return;
    console.warn(formatMessage("warn", message, meta));
  },
  error(message: string, meta?: unknown) {
    if (!shouldLog("error")) return;
    console.error(formatMessage("error", message, meta));
  },
};
