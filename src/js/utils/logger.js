/**
 * Logger utility for consistent logging across the application
 * @module utils/logger
 */

const DEBUG = false;

/**
 * Log levels
 * @enum {string}
 */
export const LogLevel = {
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
  PERFORMANCE: 'performance',
};

/**
 * Logs a message with the specified level
 * @param {string} message - The message to log
 * @param {LogLevel} level - The log level
 */
export const log = (message, level = LogLevel.INFO) => {
  if (!DEBUG) return;

  const timestamp = new Date().toISOString();
  const prefix = `[Bella Africa ${timestamp}] ${level.toUpperCase()}:`;

  switch (level) {
    case LogLevel.ERROR:
      console.error(prefix, message);
      break;
    case LogLevel.WARN:
      console.warn(prefix, message);
      break;
    default:
      console.log(prefix, message);
  }
};

/**
 * Handles and logs errors
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 */
export const handleError = (error, context) => {
  log(`Error in ${context}: ${error.message}`, LogLevel.ERROR);
  if (DEBUG) {
    console.error(error);
  }
};

/**
 * Logs performance metrics
 * @param {string} metric - The metric name
 * @param {number} value - The metric value
 */
export const logPerformance = (metric, value) => {
  log(`${metric}: ${value}ms`, LogLevel.PERFORMANCE);
};
