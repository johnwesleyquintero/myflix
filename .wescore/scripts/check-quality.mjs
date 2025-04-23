// .wescore/scripts/check-quality.mjs
// Version: 2.0.0 (Flagship Refactor)
// Purpose: Executes configured quality checks (linting, testing, etc.)
//          sequentially or in parallel, reports results with rich visuals,
//          and exits with an appropriate status code reflecting check outcomes.

// === CORE NODE MODULES ===
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import process from 'node:process'; // Explicit import for clarity

// === EXTERNAL DEPENDENCIES ===
import boxen from 'boxen'; // For console data framing
import chalk from 'chalk'; // Essential for styling terminal output
import { Spinner } from 'cli-spinner'; // Visual feedback during operations
import { execa } from 'execa'; // The core execution engine
import figlet from 'figlet'; // For imposing ASCII headers

// === CONFIGURATION CONSTANTS ===
const CONFIG_FILENAME = '.wescore.json';
const CONFIG_PATH = path.resolve(process.cwd(), CONFIG_FILENAME);
const DEFAULT_LOG_LEVEL = 'INFO';
const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, SILENT: 4 }; // Added SILENT

// === DEFAULT CONFIGURATION STRUCTURE ===
const DEFAULT_CONFIG = {
  config: {
    runMode: 'parallel', // 'sequential' or 'parallel'
    failFast: false, // Stop on first failure if true (sequential mode only)
    commandTimeout: 300_000, // 5 minutes in milliseconds
    logLevel: DEFAULT_LOG_LEVEL,
    visuals: {
      useFiglet: true,
      useSpinners: true, // Automatically disabled in non-TTY environments
      useBoxen: true, // Automatically disabled in non-TTY environments
      spinnerStyle: 18, // Index from cli-spinner styles (0-28) or a custom string
      figletFont: 'Cybermedium', // e.g., Standard, Slant, Doom, Ghost, Cybermedium,
    },
  },
  checks: [], // Array of check objects: { name: string, command: string, enabled?: boolean, cwd?: string }
};

// === STATE VARIABLES ===
let config = structuredClone(DEFAULT_CONFIG); // Deep clone default config initially
let enabledChecks = [];
let currentLogLevel = LOG_LEVELS[DEFAULT_LOG_LEVEL];
let isTTY = process.stdout.isTTY; // Check if running in a TTY environment

// === STYLING & ICONS (CHALK INSTANCES) ===
const C = {
  error: chalk.hex('#ff4757').bold, // Vivid Red
  warn: chalk.hex('#ffa502'), // Orange
  success: chalk.hex('#2ed573').bold, // Bright Green
  info: chalk.hex('#5352ed'), // Indigo Blue
  debug: chalk.hex('#777777'), // Dim Grey
  header: chalk.hex('#1e90ff'), // Dodger Blue (more professional header)
  border: chalk.cyan, // Cyan borders
  checkName: chalk.whiteBright.bold, // Standout White for Check Names
  command: chalk.cyan, // Cyan for commands
  duration: chalk.hex('#ae00ff'), // Deep Purple for Timings
  timestamp: chalk.hex('#555555'), // Dark Grey Timestamp
  dim: chalk.gray,
  bold: chalk.bold,
  italic: chalk.italic,
  underline: chalk.underline,
  critical: chalk.bgRed.whiteBright.bold, // For catastrophic failures
  envVar: chalk.yellow, // For environment variables
  filePath: chalk.blue, // For file paths
};

// Consistent Icons
const ICONS = {
  success: C.success('✔'),
  failure: C.error('✖'),
  warning: C.warn('⚠'),
  info: C.info('ℹ'),
  debug: C.debug('⚙'),
  running: C.info('▶'),
  clock: '⏱',
  config: '⚙',
  error: C.error('ℹ'), // For script/execution errors
  boxTitle: (text) => C.bold.underline(text),
  check: '❯', // Simple chevron for check prefix
  commit: '✔',
  node: 'ℹ', // Node.js icon
  platform: '▶',
  timer: '⏱',
};

// === LOGGING UTILITY ===

/**
 * Logs a message to the console if the level is sufficient.
 * Automatically handles TTY detection for styling.
 * @param {'DEBUG' | 'INFO' | 'WARN' | 'ERROR'} level - The log level.
 * @param {string} message - The message to log.
 * @param {Error} [error] - Optional error object for stack trace (ERROR level).
 */
function log(level, message, error) {
  const targetLevel = LOG_LEVELS[level] ?? LOG_LEVELS.INFO;
  if (targetLevel < currentLogLevel) {
    return;
  }

  const timestamp = new Date().toISOString();
  let colorFn = C.info;
  let icon = ICONS.info;
  const levelStr = level.padEnd(5);

  switch (level) {
    case 'ERROR':
      colorFn = C.error;
      icon = ICONS.failure;
      break;
    case 'WARN':
      colorFn = C.warn;
      icon = ICONS.warning;
      break;
    case 'DEBUG':
      colorFn = C.debug;
      icon = ICONS.debug;
      break;
    case 'INFO': // Default case handled by initialization
      break;
  }

  // Construct prefix with consistent spacing
  const prefix = `${C.timestamp(`[${timestamp}]`)} ${icon} [${colorFn(levelStr)}]`;
  const logFn = level === 'ERROR' ? console.error : console.log; // Use console.error for ERROR level

  logFn(`${prefix} ${message}`); // Apply styling only to level, keep message neutral unless styled by caller

  // Log stack trace for errors if provided
  if (level === 'ERROR' && error?.stack) {
    console.error(C.debug(error.stack)); // Use debug color for stack trace
  }
}

/**
 * Sets the global log level based on environment variables or config file.
 * Priority: --debug flag > LOG_LEVEL env var > config file > default.
 */
function configureLogLevel() {
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  const configLevel = config.config?.logLevel?.toUpperCase();
  const debugFlags =
    process.argv.includes('--debug') || process.argv.includes('-d');

  let determinedLevel = DEFAULT_LOG_LEVEL; // Start with default

  if (configLevel && LOG_LEVELS[configLevel] !== undefined) {
    determinedLevel = configLevel;
  }
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    determinedLevel = envLevel; // Env var overrides config
  }
  if (debugFlags) {
    determinedLevel = 'DEBUG'; // Flag overrides everything else
  }

  currentLogLevel = LOG_LEVELS[determinedLevel];

  // Log the *final* level being used (only if not SILENT)
  if (currentLogLevel < LOG_LEVELS.SILENT) {
    log(
      'DEBUG',
      `Log level set to ${C.bold(determinedLevel)} (Value: ${currentLogLevel})`
    );
  }
}

// === CONFIGURATION LOADING & VALIDATION ===

/**
 * Loads, validates, and merges configuration from .wescore.json.
 * Handles file not found and JSON parsing errors gracefully.
 * @returns {Promise<boolean>} True if config loaded successfully (even if default), false on critical error.
 */
async function loadConfig() {
  log(
    'INFO',
    `${ICONS.config} Loading configuration from ${C.filePath(CONFIG_PATH)}...`
  );
  try {
    const configFileContent = await fs.readFile(CONFIG_PATH, 'utf-8');
    let parsedConfig;
    try {
      parsedConfig = JSON.parse(configFileContent);
    } catch (parseError) {
      log(
        'ERROR',
        `${ICONS.error} Failed to parse ${C.filePath(CONFIG_PATH)}. Invalid JSON: ${parseError.message}`
      );
      return false; // Critical error, cannot proceed safely
    }

    // Deep merge parsed config with defaults
    config = {
      config: {
        ...DEFAULT_CONFIG.config,
        ...(parsedConfig.config || {}),
        visuals: {
          ...DEFAULT_CONFIG.config.visuals,
          ...((parsedConfig.config || {}).visuals || {}),
        },
      },
      checks: parsedConfig.checks || DEFAULT_CONFIG.checks,
    };

    // --- Comprehensive Validation ---
    if (!config || typeof config !== 'object') {
      throw new Error('Root configuration object is invalid.');
    }
    if (
      !config.config ||
      typeof config.config !== 'object' ||
      !config.config.visuals ||
      typeof config.config.visuals !== 'object'
    ) {
      throw new Error(
        'Core `config` or `config.visuals` structure is missing or invalid.'
      );
    }
    if (!Array.isArray(config.checks)) {
      throw new Error(`Configuration 'checks' property must be an array.`);
    }

    // Validate individual checks
    config.checks.forEach((check, index) => {
      const checkId = `Check at index ${index}${check?.name ? ` ('${check.name}')` : ''}`;
      if (!check || typeof check !== 'object') {
        throw new Error(`${checkId}: Invalid definition (must be an object).`);
      }
      if (!check.name || typeof check.name !== 'string' || !check.name.trim()) {
        throw new Error(`${checkId}: Requires a non-empty 'name' string.`);
      }
      if (
        !check.command ||
        typeof check.command !== 'string' ||
        !check.command.trim()
      ) {
        throw new Error(`${checkId}: Requires a non-empty 'command' string.`);
      }
      if (
        check.cwd !== undefined &&
        (typeof check.cwd !== 'string' || !check.cwd.trim())
      ) {
        throw new Error(
          `${checkId}: 'cwd' must be a non-empty string if provided.`
        );
      }
      if (check.enabled !== undefined && typeof check.enabled !== 'boolean') {
        throw new Error(`${checkId}: 'enabled' must be a boolean if provided.`);
      }
    });

    // Filter enabled checks *after* validation
    enabledChecks = config.checks.filter((check) => check.enabled !== false);

    log(
      'INFO',
      `${C.success('Configuration loaded and validated.')} Found ${C.checkName(enabledChecks.length)} enabled checks.`
    );
    log(
      'DEBUG',
      `Run Mode: ${C.bold(config.config.runMode)}, Fail Fast: ${C.bold(config.config.failFast)}, Timeout: ${C.bold(config.config.commandTimeout)}ms`
    );
    log(
      'DEBUG',
      `Visuals - Figlet: ${C.bold(config.config.visuals.useFiglet)}, Spinners: ${C.bold(config.config.visuals.useSpinners)}, Boxen: ${C.bold(config.config.visuals.useBoxen)}`
    );
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      log(
        'WARN',
        `${ICONS.warning} Config file not found at ${C.filePath(CONFIG_PATH)}. Using default settings. No checks defined in default.`
      );
      config = structuredClone(DEFAULT_CONFIG); // Ensure clean default state
      enabledChecks = [];
      return true; // Not a critical error, proceed with defaults
    } else {
      // Handle validation errors or other file system errors
      log(
        'ERROR',
        `${ICONS.error} Error loading or validating configuration: ${error.message}`,
        error
      );
      enabledChecks = []; // Prevent running checks with bad config
      return false; // Indicate critical failure
    }
  }
}

// === UTILITY FUNCTIONS ===

/**
 * Formats duration in milliseconds to a human-readable string (ms, s, or min).
 * @param {number} ms - Duration in milliseconds.
 * @returns {string} Formatted duration string.
 */
function formatDuration(ms) {
  if (ms < 0 || typeof ms !== 'number') return C.dim('N/A');
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(1)}min`;
}

/**
 * Truncates multi-line output to a maximum number of lines.
 * @param {string | undefined | null} output - The string to truncate.
 * @param {number} [maxLines=15] - Maximum number of lines to keep.
 * @returns {string} Truncated string or placeholder.
 */
function truncateOutput(output, maxLines = 15) {
  if (!output) return C.dim('<No Output Captured>');
  const lines = String(output).trim().split('\n');
  if (lines.length <= maxLines) {
    return lines.join('\n'); // Return trimmed original if within limit
  }
  return (
    lines.slice(0, maxLines).join('\n') +
    `\n${C.dim(`... (Output truncated - ${lines.length - maxLines} more lines)`)}`
  );
}

/**
 * Gets the short Git commit hash of the current HEAD.
 * @returns {Promise<string>} Short commit hash or 'N/A'.
 */
async function getGitCommitHash() {
  try {
    // Use --quiet to suppress errors like "not a git repository" to stderr
    const { stdout, failed } = await execa(
      'git',
      ['rev-parse', '--short=7', 'HEAD'],
      { reject: false, stderr: 'ignore', timeout: 5000 } // Add timeout
    );
    if (failed || !stdout.trim()) {
      return C.dim('N/A (Not a Git repo or no commits)');
    }
    return stdout.trim();
  } catch (error) {
    log('DEBUG', `Failed to get Git commit hash: ${error.message}`);
    return C.dim('N/A (Error)');
  }
}

/**
 * Renders text using Figlet if enabled and in a TTY.
 * @param {string} text - Text to render.
 * @param {chalk.Chalk} [colorFn=C.header] - Chalk function for coloring.
 */
function renderFiglet(text, colorFn = C.header) {
  const useFiglet = config.config.visuals.useFiglet && isTTY;
  if (!useFiglet) {
    console.log(colorFn(C.bold(`\n=== ${text.toUpperCase()} ===\n`))); // Simple fallback
    return;
  }
  try {
    const rendered = figlet.textSync(text, {
      font: config.config.visuals.figletFont || 'Standard', // Fallback font
    });
    console.log(colorFn(rendered));
  } catch (error) {
    log(
      'WARN',
      `Figlet rendering failed (font: ${config.config.visuals.figletFont}): ${error.message}. Falling back to simple header.`
    );
    console.log(colorFn(C.bold(`\n=== ${text.toUpperCase()} ===\n`))); // Fallback
  }
}

// === CHECK EXECUTION ENGINE ===

/**
 * Executes a single check command using execa.
 * Provides visual feedback via spinner (if TTY and enabled).
 * Captures output, duration, and status.
 * @param {object} check - The check object { name, command, cwd? }.
 * @param {number} index - The index of the check (0-based).
 * @param {number} total - The total number of checks being run.
 * @returns {Promise<object>} Result object { name, command, status: 'success'|'failed', durationMs, exitCode, stdout, stderr, error?, output }.
 */
async function executeCheck(check, index, total) {
  const checkProgress = `[${index + 1}/${total}]`;
  const startTime = performance.now();
  const checkResult = {
    name: check.name,
    command: check.command,
    status: 'failed', // Default to failed, explicitly set success later
    durationMs: -1,
    exitCode: null,
    stdout: '',
    stderr: '',
    output: '', // Combined output
    error: null, // Store actual Error object if execa fails
  };

  const useSpinner = config.config.visuals.useSpinners && isTTY;
  let spinner = null;
  const spinnerPrefix = `${C.info(checkProgress)} %s ${C.checkName(check.name)} ${C.dim(`(${C.command(check.command)})`)}`;

  if (useSpinner) {
    spinner = new Spinner(spinnerPrefix);
    spinner.setSpinnerString(config.config.visuals.spinnerStyle);
    spinner.start();
  } else {
    log(
      'INFO',
      `${checkProgress} ${ICONS.running} Starting: ${C.checkName(check.name)} ${C.dim(`(${C.command(check.command)})`)}`
    );
  }

  try {
    // Execute the command
    const result = await execa(check.command, {
      shell: true, // Allows complex commands, pipes, etc.
      timeout: config.config.commandTimeout,
      cwd: check.cwd || process.cwd(),
      reject: false, // Handle exit codes manually
      all: true, // Capture interleaved stdout/stderr in 'all' property
      env: { ...process.env, FORCE_COLOR: '1' }, // Attempt to force color output
      stripFinalNewline: false, // Keep final newline if present
    });

    const endTime = performance.now();
    if (spinner) spinner.stop(true); // Stop and clear spinner line

    // Populate result object
    checkResult.durationMs = endTime - startTime;
    checkResult.exitCode = result.exitCode;
    checkResult.stdout = result.stdout ?? '';
    checkResult.stderr = result.stderr ?? '';
    checkResult.output = result.all ?? ''; // Prefer 'all' for combined output

    const durationStr = C.duration(formatDuration(checkResult.durationMs));

    // Determine status based on exit code
    if (result.exitCode === 0) {
      checkResult.status = 'success';
      log(
        'INFO',
        `${checkProgress} ${ICONS.success} Passed:   ${C.checkName(check.name)} ${durationStr}`
      );
      // Log stderr as a warning even on success if it's not empty
      if (checkResult.stderr?.trim()) {
        log(
          'WARN',
          `${checkProgress} ${ICONS.warning} Check "${C.checkName(check.name)}" passed but produced stderr output:`
        );
        console.warn(C.dim(truncateOutput(checkResult.stderr))); // Use console.warn directly
      }
    } else {
      // Status remains 'failed' (default)
      log(
        'ERROR',
        `${checkProgress} ${ICONS.failure} Failed:   ${C.checkName(check.name)} ${C.error(`(Exit Code: ${checkResult.exitCode})`)} ${durationStr}`
      );
      // Log combined output on failure for context (at DEBUG level to avoid noise)
      log(
        'DEBUG',
        `Output for failed check "${check.name}":\n${truncateOutput(checkResult.output)}`
      );
    }
  } catch (error) {
    // Catch errors from execa itself (e.g., command not found, timeout, setup issues)
    const endTime = performance.now();
    if (spinner) spinner.stop(true); // Ensure spinner stops

    checkResult.durationMs = endTime - startTime;
    checkResult.error = error; // Store the actual error object
    checkResult.exitCode = error.exitCode ?? 1; // Assign exit code if available
    checkResult.stderr = error.stderr || error.shortMessage || error.message; // Prioritize stderr
    checkResult.stdout = error.stdout || '';
    checkResult.output =
      error.all || `${checkResult.stdout}\n${checkResult.stderr}`;
    // Status remains 'failed'

    const durationStr = C.duration(formatDuration(checkResult.durationMs));
    log(
      'ERROR',
      `${checkProgress} ${ICONS.error} Error executing: ${C.checkName(check.name)} ${durationStr}`
    );
    // Log the specific error message and potentially truncated output
    log('ERROR', `  Reason: ${error.shortMessage || error.message}`, error); // Include error object for stack trace
    if (checkResult.output?.trim()) {
      log(
        'DEBUG',
        `Output during execution error for "${check.name}":\n${truncateOutput(checkResult.output)}`
      );
    }
  }

  return checkResult;
}

// === REPORTING FUNCTIONS ===

/**
 * Prints a separator line spanning the terminal width.
 */
function printSeparator() {
  console.log(C.border('─'.repeat(process.stdout.columns || 80)));
}

/**
 * Generates and prints the final summary report using Boxen (if TTY and enabled).
 * @param {object[]} results - Array of check result objects.
 * @param {number} startTime - The performance.now() timestamp when checks started.
 * @param {number} endTime - The performance.now() timestamp when checks ended.
 * @param {string} gitCommitHash - The git commit hash.
 */
async function printSummary(results, startTime, endTime, gitCommitHash) {
  const totalDurationMs = endTime - startTime;
  const passedChecks = results.filter((r) => r.status === 'success');
  const failedChecks = results.filter((r) => r.status === 'failed');
  const totalExecuted = results.length;
  const allPassed = failedChecks.length === 0 && totalExecuted > 0;
  const checksSkipped = enabledChecks.length - totalExecuted; // Due to failFast

  const statusText = allPassed
    ? C.success('ALL CHECKS PASSED')
    : C.error('CHECKS FAILED');
  const statusIcon = allPassed ? ICONS.success : ICONS.failure;
  const boxBorderColor = allPassed ? 'green' : 'red';

  renderFiglet(
    allPassed ? 'Checks Passed' : 'Checks Failed',
    allPassed ? C.success : C.error
  );

  const summaryLines = [
    C.bold('Run Details:'),
    `  ${ICONS.timer} Timestamp:       ${C.timestamp(new Date().toISOString())}`,
    `  ${ICONS.commit} Git Commit:      ${C.info(gitCommitHash)}`,
    `  ${ICONS.node} Node Version:    ${C.info(process.version)}`,
    `  ${ICONS.platform} Platform:        ${C.info(`${os.platform()} (${os.arch()})`)}`,
    `  ${ICONS.config} Run Mode:        ${C.info(config.config.runMode)}`,
    ``,
    C.bold('Execution Summary:'),
    `  Checks Executed: ${C.checkName(totalExecuted)} / ${C.dim(enabledChecks.length)}`,
    ...(checksSkipped > 0
      ? [
          `  Checks Skipped:  ${C.warn(checksSkipped)} ${C.dim('(due to failFast)')}`,
        ]
      : []),
    `  Total Duration:  ${C.duration(formatDuration(totalDurationMs))} ${ICONS.clock}`,
    `  Final Result:    ${statusIcon} ${statusText}`,
    `    - Passed:      ${C.success(passedChecks.length)}`,
    `    - Failed:      ${failedChecks.length > 0 ? C.error(failedChecks.length) : C.dim(0)}`,
  ];

  const useBoxen = config.config.visuals.useBoxen && isTTY;
  if (useBoxen) {
    console.log(
      boxen(summaryLines.join('\n'), {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        title: ICONS.boxTitle('Quality Check Summary'),
        titleAlignment: 'center',
        borderStyle: 'double',
        borderColor: boxBorderColor,
        backgroundColor: '#111111', // Dark background for contrast
      })
    );
  } else {
    // Simple text fallback for non-TTY or disabled Boxen
    printSeparator();
    console.log(ICONS.boxTitle('Quality Check Summary'));
    console.log(summaryLines.join('\n'));
    printSeparator();
  }
}

/**
 * Prints detailed information for failed checks using Boxen (if TTY and enabled).
 * @param {object[]} failedChecks - Array of failed check result objects.
 */
function printFailureDetails(failedChecks) {
  if (failedChecks.length === 0) return;

  console.log(
    `\n${C.error.bold(`${ICONS.failure} Failure Details & Troubleshooting`)}`
  );
  printSeparator();

  const useBoxen = config.config.visuals.useBoxen && isTTY;

  failedChecks.forEach((check, index) => {
    // Prioritize showing stderr if it exists, otherwise combined output
    const primaryOutput = check.stderr?.trim() ? check.stderr : check.output;
    const outputToShow = truncateOutput(primaryOutput, 20); // Show more lines for details

    const detailLines = [
      `${C.bold(`${index + 1}. Check Failed: ${C.checkName(check.name)}`)}`,
      `   Command:   ${C.command(check.command)}`,
      `   Exit Code: ${C.error(check.exitCode ?? 'N/A')}`,
      `   Duration:  ${C.duration(formatDuration(check.durationMs))}`,
      ...(check.error // Show execa error message if it exists
        ? [
            `   Error:     ${C.error(check.error.shortMessage || check.error.message)}`,
          ]
        : []),
      ``,
      `   ${C.warn('Relevant Output (Truncated):')}`,
      `${C.dim('   --------------------')}`,
      // Indent output lines for readability
      outputToShow
        .split('\n')
        .map((line) => `   ${C.dim(line)}`)
        .join('\n'),
      `${C.dim('   --------------------')}`,
    ];

    if (useBoxen) {
      console.log(
        boxen(detailLines.join('\n'), {
          padding: { left: 1, right: 1, top: 0, bottom: 0 },
          margin: { top: 0, bottom: 1 },
          title: `${ICONS.failure} ${check.name}`,
          titleAlignment: 'left',
          borderStyle: 'round',
          borderColor: 'red',
        })
      );
    } else {
      // Simple text fallback
      console.log(detailLines.join('\n') + '\n');
    }
  });

  // Print next steps guidance after all details
  console.log(`\n${C.bold('Next Steps:')}`);
  console.log(
    `1. Review the ${C.warn('Relevant Output')} for each failed check above.`
  );
  console.log(
    `2. Identify the root cause (e.g., lint errors, test failures, command issues).`
  );
  console.log(
    `3. Fix the underlying issues in your codebase or configuration.`
  );
  console.log(
    `4. Re-run checks using your designated command (e.g., ${C.command('npm run cq')}).`
  );
  console.log(`5. Commit your fixes once all checks pass successfully.`);
  printSeparator();
}

// === MAIN EXECUTION ORCHESTRATOR ===

/**
 * Main function to orchestrate the loading, execution, and reporting of quality checks.
 */
async function runQualityChecks() {
  const scriptStartTime = performance.now();
  let exitCode = 0; // Default to success

  try {
    // 1. Load Configuration (Critical Step)
    if (!(await loadConfig())) {
      log(
        'ERROR',
        `${ICONS.error} Exiting due to critical configuration loading errors.`
      );
      process.exit(1); // Exit immediately on critical config failure
    }

    // 2. Configure Logging Level (Based on loaded config/env)
    configureLogLevel(); // Set log level *after* config is loaded

    // 3. Display Header
    renderFiglet('Wescore Checks', C.header);
    log('INFO', `Wescore Quality Check Runner Initialized (v2.0.0).`);
    printSeparator();

    // 4. Handle No Checks Enabled Case
    if (enabledChecks.length === 0) {
      log(
        'WARN',
        `${ICONS.warning} No enabled checks found in configuration. Nothing to execute.`
      );
      printSeparator();
      const gitHash = await getGitCommitHash();
      await printSummary([], scriptStartTime, performance.now(), gitHash); // Show empty summary
      process.exit(0); // Clean exit
    }

    // 5. Execute Checks
    const checksStartTime = performance.now();
    log(
      'INFO',
      `Executing ${C.checkName(enabledChecks.length)} checks in ${C.info(`'${config.config.runMode}'`)} mode...`
    );
    log(
      'DEBUG',
      `[System Stats] Start - Heap Used: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
    );

    const results = [];
    let checksFailedCount = 0;

    if (config.config.runMode === 'parallel') {
      log('DEBUG', 'Executing checks in parallel.');
      const checkPromises = enabledChecks.map((check, i) =>
        executeCheck(check, i, enabledChecks.length)
      );
      // Wait for all promises to settle (resolve or reject)
      const settledResults = await Promise.allSettled(checkPromises);

      // Process settled results
      settledResults.forEach((settledResult, i) => {
        if (settledResult.status === 'fulfilled') {
          results.push(settledResult.value);
        } else {
          // This indicates an unexpected error *within* executeCheck itself
          log(
            'ERROR',
            `Critical error during execution of check "${enabledChecks[i]?.name || `index ${i}`}". Reason: ${settledResult.reason}`,
            settledResult.reason
          );
          // Create a placeholder failure result
          results.push({
            name: enabledChecks[i]?.name || `Unknown Check (Index ${i})`,
            command: enabledChecks[i]?.command || 'Unknown',
            status: 'failed',
            durationMs: -1,
            exitCode: null,
            stdout: '',
            stderr: `Runner Error: ${settledResult.reason?.message || settledResult.reason}`,
            output: `Runner Error: ${settledResult.reason?.message || settledResult.reason}`,
            error: settledResult.reason,
          });
        }
      });
    } else {
      // Sequential execution (default)
      log('DEBUG', 'Executing checks sequentially.');
      for (let i = 0; i < enabledChecks.length; i++) {
        const check = enabledChecks[i];
        const checkResult = await executeCheck(check, i, enabledChecks.length);
        results.push(checkResult);

        if (checkResult.status === 'failed') {
          checksFailedCount++;
          if (config.config.failFast) {
            log(
              'WARN',
              `${ICONS.warning} Fail Fast enabled: Check '${C.checkName(check.name)}' failed. Aborting remaining checks.`
            );
            break; // Stop processing further checks
          }
        }
      }
    }

    const checksEndTime = performance.now();

    // 6. Process Results & Report
    checksFailedCount = results.filter((r) => r.status === 'failed').length; // Recalculate for accuracy
    exitCode = checksFailedCount > 0 ? 1 : 0; // Determine final exit code

    log(
      'DEBUG',
      `[System Stats] End - Heap Used: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
    );
    log(
      'INFO',
      `Finished running ${results.length} checks. Failures: ${checksFailedCount}.`
    );

    const gitCommitHash = await getGitCommitHash();
    await printSummary(results, checksStartTime, checksEndTime, gitCommitHash);

    const failedCheckDetails = results.filter((r) => r.status === 'failed');
    printFailureDetails(failedCheckDetails);

    // 7. Exit
    log(
      'INFO',
      `Exiting with status code ${exitCode === 0 ? C.success(exitCode) : C.error(exitCode)}.`
    );
    process.exit(exitCode);
  } catch (error) {
    // Catch unexpected errors in the main script runner itself
    printSeparator();
    console.error(
      C.critical('\n! C R I T I C A L   R U N N E R   E R R O R !')
    );
    log(
      'ERROR',
      `${ICONS.error} An uncaught error occurred in the main script execution:`,
      error // Log the error object for stack trace
    );
    printSeparator();
    process.exit(2); // Use a distinct exit code for runner errors
  }
}

// === SCRIPT ENTRY POINT ===
runQualityChecks(); // Initiate the process
