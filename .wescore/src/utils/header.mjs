// .wescore/src/utils/header.mjs
import os from 'os';
import process from 'process';

/**
 * @typedef {object} HeaderData
 * @property {Date} [startTime] - The time the process started. Defaults to new Date().
 * @property {string} [logfilePath] - Path to the log file being generated. Defaults to '.task_tracker.log'.
 * @property {string} [commandExecuted] - The command that initiated the script (e.g., 'npm run cq'). Defaults to 'N/A'.
 * @property {number} [totalChecks] - Total number of checks planned or executed.
 * @property {number} [passedChecks] - Number of checks that passed.
 * @property {number} [failedChecks] - Number of checks that failed.
 * @property {string[]} [failedCheckNames] - An array of names for the checks that failed.
 * @property {number} [durationSeconds] - The total duration of the run in seconds.
 * @property {string} [gitCommitHash] - The current Git commit hash (if available).
 * @property {string} [nodeVersion] - The version of Node.js being used.
 * @property {string} [platform] - The operating system platform.
 */

/**
 * Generates a concise, data-driven summary header for the run.
 *
 * @param {HeaderData} [data={}] - An object containing dynamic data about the current run.
 * @returns {string} The formatted header string.
 */
export function generateHeader(data = {}) {
  const {
    startTime = new Date(),
    // Remove or use 'logfilePath' if it's not needed
    // const logfilePath = 'some/path'; // Example of removing an unused variable
    commandExecuted = process.argv.slice(2).join(' ') || 'N/A',
    totalChecks = 0, // Default to 0 if not provided
    passedChecks = 0,
    failedChecks = 0,
    failedCheckNames = [],
    durationSeconds,
    gitCommitHash,
    nodeVersion = process.version,
    platform = `${os.platform()} ${os.release()}`,
  } = data;

  const formattedTimestamp = startTime.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // timeZoneName: 'short', // Keep it shorter
  });

  const labelPadding = 18; // Adjust as needed for alignment

  // --- Build Concise Summary ---
  let summary = `
========================================================
                WESCORE - RUN SUMMARY
========================================================
${'Timestamp:'.padEnd(labelPadding)}${formattedTimestamp}
${'Platform:'.padEnd(labelPadding)}${platform}
${'Node Version:'.padEnd(labelPadding)}${nodeVersion}`;

  if (gitCommitHash) {
    summary += `\n${'Git Commit:'.padEnd(labelPadding)}${gitCommitHash}`;
  }

  summary += `\n${'Command:'.padEnd(labelPadding)}${commandExecuted || 'N/A'}`;

  if (typeof durationSeconds === 'number') {
    summary += `\n${'Duration:'.padEnd(labelPadding)}${durationSeconds.toFixed(2)}s`;
  }

  summary += `\n--------------------------------------------------------`; // Separator

  // Determine overall status
  const status =
    failedChecks > 0 ? `❌ FAILURE (${failedChecks} failed)` : `✅ SUCCESS`;
  summary += `\n${'Status:'.padEnd(labelPadding)}${status}`;

  summary += `\n${'Total Checks:'.padEnd(labelPadding)}${totalChecks}`;
  summary += `\n${'Passed:'.padEnd(labelPadding)}${passedChecks}`;
  summary += `\n${'Failed:'.padEnd(labelPadding)}${failedChecks}`;

  if (failedCheckNames.length > 0) {
    summary += `\n\nFailed Checks:`;
    failedCheckNames.forEach((name) => {
      summary += `\n  - ${name}`; // List failed checks concisely
    });
  }

  summary += `\n========================================================`;

  return summary.trim(); // Trim leading/trailing whitespace
}
