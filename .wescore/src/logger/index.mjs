import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const logfilePath = path.join(process.cwd(), '.task_tracker.log');

/**
 * Appends a message to the log file and optionally logs to console.
 * @param {string} message - The message to log.
 * @param {('info'|'error'|'warn'|'debug'|'raw')} type - Log type.
 * @param {boolean} [logToConsole=true] - Whether to also log to console.
 */
export function appendToLog(level, message, logToConsole = true) {
  const timestamp = new Date().toISOString();
  let color = (text) => text; // Default: no color

  switch (level.toUpperCase()) {
    case 'INFO':
      color = (text) => chalk.blue(text);
      break;
    case 'WARN':
      color = (text) => chalk.yellow(text);
      break;
    case 'ERROR':
      color = (text) => chalk.red(text);
      break;
    case 'SUCCESS':
      color = (text) => chalk.green(text);
      break;
  }

  const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;

  // Always write to log file
  try {
    fs.appendFileSync(logfilePath, logMessage);
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }

  // Optionally log to console with colors
  if (logToConsole) {
    console.log(color(`[${timestamp}] [${level.toUpperCase()}] ${message}`));
  }
}

export default appendToLog;
