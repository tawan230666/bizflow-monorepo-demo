const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const timestamp = () => new Date().toISOString();

export const logger = {
  info: (msg: string, meta?: unknown) =>
    console.log(`${colors.cyan}[${timestamp()}] INFO:${colors.reset} ${msg}`, meta || ""),
  warn: (msg: string, meta?: unknown) =>
    console.warn(`${colors.yellow}[${timestamp()}] WARN:${colors.reset} ${msg}`, meta || ""),
  error: (msg: string, error?: unknown) =>
    console.error(`${colors.red}[${timestamp()}] ERROR:${colors.reset} ${msg}`, error || ""),
  success: (msg: string) =>
    console.log(`${colors.green}[${timestamp()}] OK:${colors.reset} ${msg}`),
};
