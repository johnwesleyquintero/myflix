// c:\Users\johnw\OneDrive\Desktop\portfolio\.wescore\src\reporting\error-logger.mjs
// ===================================================================
// Wescore Issue Logging Module (Enhanced Robustness)
// ===================================================================
// Purpose:
// - Log internal tool errors and results from quality checks (e.g., ESLint).
// - Provides structured logging to 'logs/issue-report.log' with rotation.
// - Categorizes issues.
// - Maintains a summary in 'logs/issue-summary.json' with atomic writes.
// ===================================================================

import fs from 'fs';
import os from 'os'; // <-- Import os module
import path from 'path';

const DEFAULT_LOG_DIR = path.resolve(process.cwd(), '.wescore', 'logs'); // .wescore/logs/
const DEFAULT_MAX_LOG_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const DEFAULT_MAX_LOG_FILES = 5;

// Categories (Added LINTING)
const ISSUE_CATEGORIES = {
  BUILD: 'BUILD',
  DEPENDENCY: 'DEPENDENCY',
  CONFIGURATION: 'CONFIGURATION',
  EXPORT: 'EXPORT',
  FILESYSTEM: 'FILESYSTEM',
  PROCESS: 'PROCESS',
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  INTERNAL: 'INTERNAL',
  LINTING: 'LINTING', // For check results like ESLint
  UNKNOWN: 'UNKNOWN',
};

// Patterns for *internal* tool errors
const ERROR_PATTERNS = [
  // Keep existing patterns, but FS errors might be caught by code first
  {
    pattern:
      /(npm ERR!|yarn error|pnpm error|Cannot find module|Module not found)/i,
    category: ISSUE_CATEGORIES.DEPENDENCY,
  },
  {
    pattern:
      /(ENOENT|EPERM|EACCES|Failed to read|Failed to write|Cannot write to log file)/i,
    category: ISSUE_CATEGORIES.FILESYSTEM,
  }, // Fallback regex
  {
    pattern:
      /(next\.config\.js|wescore\.json|Invalid configuration|Failed to load config)/i,
    category: ISSUE_CATEGORIES.CONFIGURATION,
  },
  { pattern: /(next build|build failed)/i, category: ISSUE_CATEGORIES.BUILD },
  {
    pattern: /(export failed|static export)/i,
    category: ISSUE_CATEGORIES.EXPORT,
  },
  {
    pattern: /(SIGTERM|SIGINT|command failed|runner error)/i,
    category: ISSUE_CATEGORIES.PROCESS,
  },
  {
    pattern: /(ETIMEDOUT|ECONNREFUSED|fetch failed)/i,
    category: ISSUE_CATEGORIES.NETWORK,
  },
];

class IssueLogger {
  // <-- Renamed class
  /**
   * @param {object} [options={}]
   * @param {string} [options.logDir=DEFAULT_LOG_DIR]
   * @param {number} [options.maxLogSize=DEFAULT_MAX_LOG_SIZE_BYTES]
   * @param {number} [options.maxLogFiles=DEFAULT_MAX_LOG_FILES]
   */
  constructor(options = {}) {
    this.logDir = options.logDir || DEFAULT_LOG_DIR;
    this.maxLogSize = options.maxLogSize || DEFAULT_MAX_LOG_SIZE_BYTES;
    this.maxLogFiles = options.maxLogFiles || DEFAULT_MAX_LOG_FILES;
    this.logFilePath = path.join(this.logDir, 'issue-report.log'); // <-- Renamed log file
    this.summaryPath = path.join(this.logDir, 'issue-summary.json'); // <-- Renamed summary file
    this.summaryTmpPath = path.join(this.logDir, 'issue-summary.json.tmp'); // For atomic writes

    this.issueStats = {
      // <-- Renamed stats object
      totalIssues: 0,
      categoryCounts: {},
      recentIssues: [], // Stores { timestamp, category, message, details, context }
    };
    this.isInitialized = false;
    this._initializeLogger();
  }

  _initializeLogger() {
    if (this.isInitialized) return true; // Already initialized

    try {
      // 1. Ensure log directory exists
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
        console.log(`[IssueLogger] Created log directory: ${this.logDir}`);
      }

      // 2. Handle Log Rotation
      this._rotateLogFileIfNeeded();

      // 3. Initialize log file with header if it's new (after potential rotation)
      if (!fs.existsSync(this.logFilePath)) {
        const systemInfo = `OS: ${os.platform()} ${os.release()} | Node: ${process.version} | Wescore Logger Init`;
        fs.writeFileSync(
          this.logFilePath,
          `========================================\nWescore Issue Log\nStarted: ${new Date().toISOString()}\n${systemInfo}\n========================================\n\n`,
          'utf8'
        );
      }

      // 4. Load existing summary stats if available
      if (fs.existsSync(this.summaryPath)) {
        const statsContent = fs.readFileSync(this.summaryPath, 'utf8');
        if (statsContent) {
          this.issueStats = JSON.parse(statsContent);
          // Ensure essential keys exist after loading
          this.issueStats.totalIssues = this.issueStats.totalIssues || 0;
          this.issueStats.categoryCounts = this.issueStats.categoryCounts || {};
          this.issueStats.recentIssues = this.issueStats.recentIssues || [];
        }
      } else {
        // Initialize summary file if it doesn't exist
        this._writeSummaryFile();
      }

      this.isInitialized = true;
      return true; // Initialization successful
    } catch (initError) {
      this.isInitialized = false;
      const errorMsg = `[IssueLogger] CRITICAL: Failed to initialize logger! ${initError.message}\nStack: ${initError.stack}\n`;
      console.error(errorMsg);
      try {
        process.stderr.write(errorMsg);
      } catch {
        /* Ignore stderr write errors */
      }
      return false; // Initialization failed
    }
  }

  _rotateLogFileIfNeeded() {
    try {
      if (fs.existsSync(this.logFilePath)) {
        const stats = fs.statSync(this.logFilePath);
        if (stats.size >= this.maxLogSize) {
          console.log(
            `[IssueLogger] Log file size (${stats.size} bytes) exceeds limit (${this.maxLogSize} bytes). Rotating.`
          );
          this._rotateLogs();
        }
      }
    } catch (rotateError) {
      this._handleRotationError(rotateError);
    }
  }

  _rotateLogs() {
    let rotationNum = this._determineRotationNumber();
    if (rotationNum >= this.maxLogFiles) {
      this._deleteOldestLog();
      rotationNum = this.maxLogFiles - 1; // Overwrite the last one
    }
    this._shiftExistingLogs(rotationNum);
    this._renameCurrentLog();
  }

  _determineRotationNumber() {
    let rotationNum = 1;
    while (
      rotationNum < this.maxLogFiles &&
      fs.existsSync(`${this.logFilePath}.${rotationNum}`)
    ) {
      rotationNum++;
    }
    return rotationNum;
  }

  _deleteOldestLog() {
    const oldestLog = `${this.logFilePath}.${this.maxLogFiles - 1}`;
    console.log(
      `[IssueLogger] Max log files reached. Deleting oldest: ${oldestLog}`
    );
    try {
      fs.unlinkSync(oldestLog);
    } catch (e) {
      console.error(`[IssueLogger] Failed to delete oldest log: ${e.message}`);
    }
  }

  _shiftExistingLogs(rotationNum) {
    for (let i = rotationNum - 1; i >= 1; i--) {
      try {
        fs.renameSync(
          `${this.logFilePath}.${i}`,
          `${this.logFilePath}.${i + 1}`
        );
      } catch (e) {
        console.error(`[IssueLogger] Failed to rename log ${i}: ${e.message}`);
      }
    }
  }

  _renameCurrentLog() {
    try {
      fs.renameSync(this.logFilePath, `${this.logFilePath}.1`);
      console.log(`[IssueLogger] Log rotated to ${this.logFilePath}.1`);
    } catch (e) {
      console.error(`[IssueLogger] Failed to rename current log: ${e.message}`);
    }
  }

  _handleRotationError(rotateError) {
    const errorMsg = `[IssueLogger] ERROR: Failed during log rotation! ${rotateError.message}\n`;
    console.error(errorMsg);
    try {
      process.stderr.write(errorMsg);
    } catch {
      /* Ignore stderr write failures */
    }
  }

  /**
   * Categorizes an *internal tool error*.
   * @param {Error} error - The error object.
   * @returns {string} The determined issue category.
   */
  categorizeInternalError(error) {
    // Keep specific name for internal errors
    const message = error.message || error.toString();
    const stack = error.stack || '';
    const code = error.code; // <-- Get error code

    // Prioritize specific error codes
    if (code) {
      switch (code) {
        case 'ENOENT':
        case 'EACCES':
        case 'EPERM':
        case 'EISDIR':
        case 'ENOTDIR':
          return ISSUE_CATEGORIES.FILESYSTEM;
        // Add more specific codes if needed (e.g., network codes)
        case 'ECONNREFUSED':
        case 'ETIMEDOUT':
        case 'ENOTFOUND':
          return ISSUE_CATEGORIES.NETWORK;
      }
    }

    // Fallback to regex patterns
    const combined = `${message}\n${stack}`;
    for (const { pattern, category } of ERROR_PATTERNS) {
      if (pattern.test(combined)) {
        return category;
      }
    }

    // Avoid mis-categorizing Linting summaries if they somehow reach here
    if (message.includes('ESLint found')) return ISSUE_CATEGORIES.UNKNOWN;

    return ISSUE_CATEGORIES.UNKNOWN;
  }

  _formatInternalErrorEntry(error, category, context = {}) {
    // ... (Formatting logic remains the same as before, using 'details' for stack)
    const timestamp = new Date().toISOString();
    const issueDetail = {
      timestamp,
      category,
      message: error.message || error.toString(),
      details: error.stack || 'No stack trace available', // Use 'details' field
      context: { ...(context || {}), errorCode: error.code }, // Add error code to context
      isInternalError: true,
    };
    // ... (rest of formatting logic generating logEntry string)
    let contextString = '';
    if (Object.keys(issueDetail.context).length > 0) {
      contextString = ` | Context: ${JSON.stringify(issueDetail.context)}`;
    }
    const logEntry = `[${timestamp}] [${category}]${contextString}\nMessage: ${issueDetail.message}\nStack:\n${issueDetail.details}\n----------------------------------------\n`;
    return { logEntry, issueDetail };
  }

  _formatLintResultEntry(result, category, context = {}) {
    // ... (Formatting logic remains the same as the previous version, generating CLI-like output)
    const timestamp = new Date().toISOString();
    let cliFormattedMessages = '';
    if (result.messages.length > 0) {
      cliFormattedMessages = result.messages
        .map(
          (msg) =>
            `  ${msg.line}:${msg.column}  ${msg.severity === 2 ? 'Error' : 'Warning'}: ${msg.message}  ${msg.ruleId || 'core'}`
        )
        .join('\n');
    }
    const logFileContent = `${result.filePath}\n${cliFormattedMessages}\n`;
    let contextString = '';
    if (Object.keys(context).length > 0) {
      contextString = ` | Context: ${JSON.stringify(context)}`;
    }
    const logEntry = `[${timestamp}] [${category}]${contextString}\n${logFileContent}\n----------------------------------------\n`;
    const summaryMessage = `Lint: ${result.errorCount} error(s), ${result.warningCount} warning(s) in ${result.filePath}`;
    const issueDetail = {
      timestamp,
      category,
      message: summaryMessage,
      details: cliFormattedMessages,
      context: {
        ...context,
        file: result.filePath,
        errorCount: result.errorCount,
        warningCount: result.warningCount,
      },
      isLintIssue: true,
    };
    return { logEntry, issueDetail };
  }

  /**
   * Logs an issue (internal error or check result)
   * @param {string} category - The issue category.
   * @param {string} logEntry - The pre-formatted string for the log file.
   * @param {object} issueDetail - The structured object for the summary.
   */
  _logIssue(category, logEntry, issueDetail) {
    if (!this.isInitialized) {
      // Attempt recovery if not initialized (might happen if constructor failed partially)
      console.error(
        '[IssueLogger] Warning: Logger not initialized when trying to log. Attempting recovery.'
      );
      if (!this._initializeLogger()) {
        const criticalMsg =
          '[IssueLogger] CRITICAL: Cannot log issue, logger failed to initialize.\n';
        console.error(criticalMsg, issueDetail);
        try {
          process.stderr.write(
            criticalMsg + JSON.stringify(issueDetail) + '\n'
          );
        } catch {
          /* Intentional no-op */
        }
        return; // Stop if initialization failed
      }
    }

    try {
      // Update stats
      this.issueStats.totalIssues++;
      this.issueStats.categoryCounts[category] =
        (this.issueStats.categoryCounts[category] || 0) + 1;
      this.issueStats.recentIssues.unshift(issueDetail);
      this.issueStats.recentIssues = this.issueStats.recentIssues.slice(0, 100); // Keep last 100

      // Write to log file (append) - Check rotation *before* writing
      this._rotateLogFileIfNeeded();
      fs.appendFileSync(this.logFilePath, logEntry, 'utf8');

      // Write summary file (atomic)
      this._writeSummaryFile();
    } catch (logWriteError) {
      const errorMsg = `[IssueLogger] CRITICAL: Failed to write to log or summary file! ${logWriteError.message}\n`;
      console.error(errorMsg);
      console.error('[IssueLogger] Original Issue Detail:', issueDetail);
      try {
        process.stderr.write(errorMsg + JSON.stringify(issueDetail) + '\n');
      } catch {
        /* Ignore stderr write failures */
      }
    }
  }

  /** Safely writes the summary file using atomic rename */
  _writeSummaryFile() {
    try {
      const summaryJson = JSON.stringify(this.issueStats, null, 2);
      fs.writeFileSync(this.summaryTmpPath, summaryJson, 'utf8');
      fs.renameSync(this.summaryTmpPath, this.summaryPath);
    } catch (summaryWriteError) {
      // If atomic write fails, log error but don't crash the main process
      const errorMsg = `[IssueLogger] ERROR: Failed to write summary file! ${summaryWriteError.message}\n`;
      console.error(errorMsg);
      try {
        process.stderr.write(errorMsg);
      } catch {
        /* Ignore stderr write failures */
      }
      // Attempt to clean up temp file if it exists
      try {
        if (fs.existsSync(this.summaryTmpPath))
          fs.unlinkSync(this.summaryTmpPath);
      } catch {
        /* Ignore stderr write failures */
      }
    }
  }

  /**
   * Logs an *internal tool error*.
   * @param {Error} error - The error object to log.
   * @param {object} [context={}] - Optional additional context.
   * @returns {string} The category the error was assigned to.
   */
  logInternalError(error, context = {}) {
    // <-- Renamed method
    const category = this.categorizeInternalError(error);
    const { logEntry, issueDetail } = this._formatInternalErrorEntry(
      error,
      category,
      context
    );
    this._logIssue(category, logEntry, issueDetail); // Use the common internal log method
    return category;
  }

  /**
   * Logs ESLint results.
   * @param {Array<import('eslint').ESLint.LintResult>} eslintResults - Array of results.
   * @param {object} [context={}] - Optional context.
   */
  logLintResults(eslintResults, context = {}) {
    const category = ISSUE_CATEGORIES.LINTING;

    for (const result of eslintResults) {
      if (result.errorCount > 0 || result.warningCount > 0) {
        const { logEntry, issueDetail } = this._formatLintResultEntry(
          result,
          category,
          context
        );
        this._logIssue(category, logEntry, issueDetail); // Use the common internal log method
        // Remove loggedCount as it's not used
      }
    }
  }

  // --- Getter methods (using 'Issue') ---

  getIssueSummary() {
    if (!this.isInitialized) this._initializeLogger(); // Ensure initialized before returning stats
    return this.issueStats;
  }

  getRecentIssues(limit = 10) {
    if (!this.isInitialized) this._initializeLogger();
    return this.issueStats.recentIssues.slice(0, limit);
  }

  getCategoryStats() {
    if (!this.isInitialized) this._initializeLogger();
    return this.issueStats.categoryCounts;
  }
}

// Export singleton instance and categories
export const issueLogger = new IssueLogger(); // <-- Renamed exported instance
export { ISSUE_CATEGORIES }; // <-- Renamed exported categories

/*
// --- Example Usage ---
import { issueLogger } from './issue-logger.mjs'; // <-- Use new name

try {
  // ... some operation that might fail ...
  throw new Error("Something went wrong during file processing");
} catch (error) {
  console.error("An internal error occurred:", error.message);
  // Use the specific method for internal errors
  issueLogger.logInternalError(error, { script: 'my-script.mjs', phase: 'processing' });
}

// Linting example remains the same, calling issueLogger.logLintResults(...)
*/
