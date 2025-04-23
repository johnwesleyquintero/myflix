/**
 * Removes ANSI escape codes from a string.
 * @param {string} str The string to clean.
 * @returns {string} The cleaned string.
 */
export function stripAnsiCodes(str) {
  // Regular expression to match ANSI escape codes
  const ansiRegex =
    /[\\u001b\\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
  return str.replace(ansiRegex, '');
}

/**
 * Analyzes log data (stdout/stderr) to extract specific error/warning lines based on provided patterns.
 * Version 5: Uses patterns from config, keeps ANSI stripping.
 * @param {string} logData - The combined stdout and stderr output of a task.
 * @param {string} [taskId='unknown'] - The ID or type of the task (e.g., 'Format', 'Lint').
 * @param {string[]} [errorPatterns=[]] - Array of regex strings for errors.
 * @param {string[]} [warningPatterns=[]] - Array of regex strings for warnings.
 * @returns {{errors: number, errorLines: string[], warnings: number, warningLines[]}} - Counts and specific lines.
 */
export function categorizeLogOutput(
  logData,
  taskId = 'unknown',
  errorPatterns = [],
  warningPatterns = [],
) {
  const lines = logData ? logData.split(/\r?\n/) : [];
  let errorCount = 0;
  let warningCount = 0;
  const errorLines = [];
  const warningLines = [];

  // Compile regex patterns once
  const compiledErrorPatterns = errorPatterns.map(
    (pattern) => new RegExp(pattern, 'i'),
  );
  const compiledWarningPatterns = warningPatterns.map(
    (pattern) => new RegExp(pattern, 'i'),
  );

  lines.forEach((line) => {
    const cleanedLine = stripAnsiCodes(line).trim();
    if (!cleanedLine) return; // Skip empty lines after cleaning

    let lineMatchedAsError = false;

    // Check for Errors using the *cleaned* line
    for (const pattern of compiledErrorPatterns) {
      if (pattern.test(cleanedLine)) {
        // Add the CLEANED line for consistency in the summary.
        errorLines.push(`[${taskId.toUpperCase()}] ${cleanedLine}`);
        errorCount++;
        lineMatchedAsError = true;
        break; // Stop checking error patterns for this line
      }
    }

    // If not matched as an error, check for Warnings using the *cleaned* line
    if (!lineMatchedAsError) {
      for (const pattern of compiledWarningPatterns) {
        if (pattern.test(cleanedLine)) {
          // Add the CLEANED line
          warningLines.push(`[${taskId.toUpperCase()}] ${cleanedLine}`);
          warningCount++;
          // Don't break here for warnings, a line might match multiple warnings?
          // Or break if only the first warning match is desired. Let's break for simplicity.
          break;
        }
      }
    }
  });

  return {
    errors: errorCount,
    errorLines,
    warnings: warningCount,
    warningLines,
  };
}

const analyzerObject = {
  // properties and methods
};

export default analyzerObject;
