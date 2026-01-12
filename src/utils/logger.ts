/**
 * Simple structured logger
 */

export const logger = {
  info: (message: string) => {
    console.error(`[INFO] ${message}`);
  },

  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error || '');
  },

  warn: (message: string) => {
    console.error(`[WARN] ${message}`);
  },

  success: (message: string) => {
    console.error(`[SUCCESS] ${message}`);
  },
};
