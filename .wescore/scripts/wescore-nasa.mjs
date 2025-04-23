// .wescore/scripts/wescore-nasa.mjs
// <<< WESCORE MISSION CONTROL - QUALITY ASSURANCE PROTOCOL >>>

import { execa } from 'execa';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

// --- NASA Mission Control Theme Configuration ---
const THEME_COLORS = {
  reset: '\x1b[0m',
  // NASA-inspired palette
  red: '\x1b[91m', // Alert Red
  green: '\x1b[92m', // Go Green
  yellow: '\x1b[93m', // Warning Yellow
  blue: '\x1b[94m', // Deep Space Blue
  orange: '\x1b[38;5;208m', // Accent Orange (like flight suits)
  white: '\x1b[97m', // Bright White (stars, text)
  grey: '\x1b[90m', // Neutral Grey (telemetry, subtle info)
  blackBg: '\x1b[40m',
  blueBg: '\x1b[44m', // Blue background for headers
  whiteBg: '\x1b[47m',
  blink: '\x1b[5m', // Use for critical alerts only!
};

const ICONS = {
  success: `${THEME_COLORS.green}✅${THEME_COLORS.reset}`, // Nominal Check
  failure: `${THEME_COLORS.red}❌${THEME_COLORS.reset}`, // No-Go / Anomaly
  error: `${THEME_COLORS.red}❗${THEME_COLORS.reset}`, // Critical Alert
  running: `${THEME_COLORS.blue}🚀${THEME_COLORS.reset}`, // Launching Check
  info: `${THEME_COLORS.blue}📡${THEME_COLORS.reset}`, // Telemetry Info
  warn: `${THEME_COLORS.yellow}⚠️${THEME_COLORS.reset}`, // Warning Signal
  debug: `${THEME_COLORS.grey}⚙️${THEME_COLORS.reset}`, // System Internals
  clock: '⏱️', // Mission Elapsed Time
  config: '🛰️', // Configuration Uplink
  git: '🧭', // Navigation/Version Control
  anomaly: '💥', // Major Anomaly / Failure
};

// --- Configuration Loading ---
const CONFIG_PATH = path.resolve(process.cwd(), '.wescore.json');
let config = {
  config: {
    runMode: 'sequential', // Default: Staged burn
    failFast: false, // Default: Continue sequence on non-critical failure
    commandTimeout: 300000, // 5 minutes max per stage
  },
  checks: [],
};
let allChecks = []; // All enabled mission checks

async function loadConfig() {
  log(
    'INFO',
    `${ICONS.config} Accessing Mission Parameters from ${THEME_COLORS.blue}${CONFIG_PATH}${THEME_COLORS.reset}...`,
  );
  try {
    const configFileContent = await fs.readFile(CONFIG_PATH, 'utf-8');
    config = JSON.parse(configFileContent);

    config.config = config.config || {
      runMode: 'sequential',
      failFast: false,
      commandTimeout: 300000,
    };
    config.checks = config.checks || [];

    config.checks.forEach((check, index) => {
      if (!check.name || typeof check.name !== 'string') {
        throw new Error(
          `Configuration Anomaly! Check at index ${index} requires a valid 'name' designator.`,
        );
      }
      if (!check.command || typeof check.command !== 'string') {
        throw new Error(
          `Configuration Anomaly! Check "${check.name}" is missing a 'command' sequence.`,
        );
      }
    });

    allChecks = config.checks.filter((check) => check.enabled !== false); // Filter out scrubbed checks
    log(
      'INFO',
      `${THEME_COLORS.green}Mission Parameters Loaded!${THEME_COLORS.reset} Found ${THEME_COLORS.orange}${allChecks.length}${THEME_COLORS.reset} enabled checks. Ready for pre-flight sequence.`,
    );
    log(
      'DEBUG',
      `Execution Mode: ${config.config.runMode}, Abort on Failure: ${config.config.failFast}, Stage Timeout: ${config.config.commandTimeout}ms`,
    );
  } catch (error) {
    log(
      'WARN',
      `${ICONS.warn} Alert! Could not load or parse ${CONFIG_PATH}. No checks will run. Mission Hold! Error: ${error.message}`,
    );
    allChecks = [];
  }
}

// --- Logger ---
const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
let currentLogLevel = LOG_LEVELS.INFO; // Default log verbosity

function log(level, message) {
  if (LOG_LEVELS[level] === undefined || LOG_LEVELS[level] < currentLogLevel) {
    return; // Filter logs below current level
  }
  const timestamp = new Date().toISOString(); // ISO format for precision
  let color = THEME_COLORS.reset;
  let icon = '';
  let prefixText = level.padEnd(5);

  switch (level) {
    case 'ERROR':
      color = THEME_COLORS.red;
      icon = ICONS.failure;
      prefixText = 'ERROR';
      break;
    case 'WARN':
      color = THEME_COLORS.yellow;
      icon = ICONS.warn;
      prefixText = 'WARN ';
      break;
    case 'INFO':
      color = THEME_COLORS.white; // White for standard comms
      icon = ICONS.info;
      prefixText = 'INFO ';
      break;
    case 'DEBUG':
      color = THEME_COLORS.grey;
      icon = ICONS.debug;
      prefixText = 'DEBUG';
      break;
  }

  // Indent multi-line messages for readability
  const prefix = `${THEME_COLORS.grey}[${timestamp}]${THEME_COLORS.reset} ${icon} [${color}${prefixText}${THEME_COLORS.reset}] `;
  const indentedMessage = message
    .split('\n')
    .map((line, index) =>
      index === 0 ? line : `                       ${line}`,
    ) // Align with prefix end
    .join('\n');
  console.log(prefix + indentedMessage);
}

// --- Helper Functions ---
function formatDuration(ms) {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(2);
  return `${minutes}m ${seconds}s`;
}

function truncateOutput(output, maxLines = 15) {
  if (!output) return '<No Telemetry Captured>';
  const lines = output.trim().split('\n');
  if (lines.length <= maxLines) {
    return output.trim();
  }
  return (
    lines.slice(0, maxLines).join('\n') +
    `\n${THEME_COLORS.grey}... (Telemetry Stream Truncated)${THEME_COLORS.reset}`
  );
}

async function getGitCommitHash() {
  try {
    const { stdout } = await execa('git', ['rev-parse', '--short', 'HEAD'], {
      reject: false, // Don't throw on non-zero exit
      stderr: 'ignore', // Suppress git errors if not a repo
    });
    return stdout.trim() || 'N/A (No Git Telemetry)';
  } catch (error) {
    log('DEBUG', `Could not retrieve Git commit hash: ${error.message}`);
    return 'N/A (Error)';
  }
}

// --- ASCII Art & Styling ---
function printSeparator(char = '-', length = 70) {
  console.log(THEME_COLORS.blue + char.repeat(length) + THEME_COLORS.reset);
}

function printHeader(text) {
  printSeparator('=', 70);
  const padding = Math.floor((64 - text.length) / 2);
  const remainder = (64 - text.length) % 2;
  console.log(
    `${THEME_COLORS.blueBg}${THEME_COLORS.white}===${' '.repeat(padding)}${text}${' '.repeat(padding + remainder)}===${THEME_COLORS.reset}`,
  );
  printSeparator('=', 70);
}

function printSubHeader(text) {
  console.log(`\n${THEME_COLORS.orange}>>> ${text} <<<\n${THEME_COLORS.reset}`);
}

// Generates the final mission report summary
function generateMissionReport(data) {
  const border = `${THEME_COLORS.blue}+${'-'.repeat(68)}+${THEME_COLORS.reset}`;
  const emptyLine = `${THEME_COLORS.blue}|${' '.repeat(68)}|${THEME_COLORS.reset}`;
  const textLine = (label, value, valueColor = THEME_COLORS.white) => {
    // Basic ANSI stripping for length calculation
    const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');
    const cleanValue = stripAnsi(value);
    const formattedValue =
      cleanValue.length > 45 ? cleanValue.slice(0, 42) + '...' : cleanValue;
    const line = ` ${label}: ${valueColor}${formattedValue}${THEME_COLORS.reset}`; // Apply color only to value
    const cleanLine = stripAnsi(line);
    const padding = 68 - cleanLine.length;
    return `${THEME_COLORS.blue}|${THEME_COLORS.white}${line}${' '.repeat(Math.max(0, padding))}${THEME_COLORS.blue}|${THEME_COLORS.reset}`;
  };

  const failedChecksLines = data.failedCheckNames.map(
    (name) => textLine('  - Anomaly', name, THEME_COLORS.red), // Color the failed check name red
  );

  return `
${border}
${emptyLine}
${THEME_COLORS.blue}|  ${THEME_COLORS.orange}${THEME_COLORS.blink}W E S C O R E   M I S S I O N   R E P O R T${THEME_COLORS.reset}${THEME_COLORS.blue}                         |${THEME_COLORS.reset}
${emptyLine}
${border}
${textLine('Mission Start (UTC)', data.startTime.toISOString())}
${textLine('Executed Command', data.commandExecuted)}
${textLine('Node Version', data.nodeVersion)}
${textLine('Platform', data.platform)}
${textLine('Git Commit Hash', data.gitCommitHash || 'N/A')}
${emptyLine}
${textLine('Total Checks Planned', `${data.totalChecks}`)}
${textLine('Checks Nominal', `${data.passedChecks}`, THEME_COLORS.green)}
${textLine('Checks Anomaly', `${data.failedChecks}`, data.failedChecks > 0 ? THEME_COLORS.red : THEME_COLORS.green)}
${failedChecksLines.join('\n')}
${emptyLine}
${textLine('Mission Elapsed Time', `${formatDuration(data.durationSeconds * 1000)} ${ICONS.clock}`)}
${border}
  `;
}

// --- Main Execution Logic ---
// eslint-disable-next-line sonarjs/cognitive-complexity
async function runChecks() {
  // --- Mission Control Intro ---
  console.log(THEME_COLORS.blue);
  console.log(String.raw`
        /\
       /  \
      /____\
     / \  / \
    /  /  \  \
   /  /____\  \
  /__/______\__\
  |            |
 /|------------|\
 \|____________|/
  |   WESCORE  |
  |____NASA____|
      ----
     /    \
    /______\
   (________)
    ||    ||
   /__\  /__\
  (____)(____)
  `);
  console.log(THEME_COLORS.reset);
  printHeader('WESCORE QUALITY ASSURANCE - MISSION CONTROL');
  log('INFO', 'Powering up systems... Stand by for initialization...');

  const scriptStartTime = performance.now();
  await loadConfig(); // Load mission parameters

  if (allChecks.length === 0) {
    log(
      'ERROR',
      `${ICONS.anomaly} No enabled checks found! Mission Aborted. Verify ${THEME_COLORS.blue}.wescore.json${THEME_COLORS.reset}!`,
    );
    process.exit(1); // Exit code 1 for configuration errors
  }

  const checksExecutionStart = performance.now();
  log('INFO', 'Systems online. Initiating pre-flight checks...');
  log(
    'DEBUG',
    `[System Telemetry - Start] Heap Used: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
  );
  log(
    'INFO',
    `${THEME_COLORS.orange}🚀 All systems go!${THEME_COLORS.reset} Executing ${THEME_COLORS.blue}${allChecks.length}${THEME_COLORS.reset} checks in ${THEME_COLORS.yellow}${config.config.runMode}${THEME_COLORS.reset} sequence.`,
  );

  const results = []; // Store results of each check
  let checksPassed = 0;
  let checksFailed = 0;

  // Function to execute a single check
  const executeCheck = async (check, index, total) => {
    const checkIndex = index + 1;
    log(
      'INFO',
      `\n[${checkIndex}/${total}] ${ICONS.running} Initiating Check: ${THEME_COLORS.yellow}${check.name}${THEME_COLORS.reset} (${THEME_COLORS.blue}${check.command}${THEME_COLORS.reset})`,
    );
    const checkStart = performance.now();
    let checkResult = {
      name: check.name,
      command: check.command,
      status: 'failed', // Default to failed
      durationMs: 0,
      exitCode: null,
      stdout: '',
      stderr: '',
    };

    try {
      // Execute the command using execa
      const result = await execa(check.command, {
        shell: true, // Allow shell syntax (pipes, etc.)
        timeout: config.config.commandTimeout, // Apply timeout
        cwd: check.cwd || process.cwd(), // Set working directory if specified
        reject: false, // Don't throw error on non-zero exit code
      });

      const checkEnd = performance.now();
      checkResult.durationMs = checkEnd - checkStart;
      checkResult.stdout = result.stdout || '';
      checkResult.stderr = result.stderr || '';
      checkResult.exitCode = result.exitCode;

      // Evaluate result based on exit code
      if (result.exitCode === 0) {
        checkResult.status = 'success';
        log(
          'INFO',
          `[${checkIndex}/${total}] ${ICONS.success} ${THEME_COLORS.green}Nominal!${THEME_COLORS.reset} Check PASSED: ${check.name} (${formatDuration(checkResult.durationMs)})`,
        );
        // Log stderr as a warning even on success, if present
        if (checkResult.stderr && checkResult.stderr.trim()) {
          log(
            'WARN',
            `  ${ICONS.warn} Minor Telemetry Anomaly (stderr) on success:\n${truncateOutput(checkResult.stderr, 5)}`,
          );
        }
      } else {
        checkResult.status = 'failed';
        log(
          'ERROR',
          `[${checkIndex}/${total}] ${ICONS.failure} ${THEME_COLORS.red}Anomaly Detected!${THEME_COLORS.reset} Check FAILED (Exit Code ${checkResult.exitCode}): ${check.name} (${formatDuration(checkResult.durationMs)})`,
        );
        log(
          'ERROR',
          `  ${THEME_COLORS.red}Failure Telemetry:${THEME_COLORS.reset}\n--- Error Log Start ---`,
        );
        if (checkResult.stderr && checkResult.stderr.trim()) {
          log(
            'ERROR',
            `  ${THEME_COLORS.yellow}Stderr:${THEME_COLORS.reset}\n${checkResult.stderr}`,
          );
        }
        if (checkResult.stdout && checkResult.stdout.trim()) {
          log(
            'ERROR',
            `  ${THEME_COLORS.yellow}Stdout:${THEME_COLORS.reset}\n${checkResult.stdout}`,
          );
        }
        log('ERROR', `--- Error Log End ---`);
      }
    } catch (error) {
      // Catch execution errors (e.g., command not found, timeout)
      const checkEnd = performance.now();
      checkResult.durationMs = checkEnd - checkStart;
      checkResult.status = 'failed';
      checkResult.exitCode = error.exitCode ?? error.code ?? 1; // Capture exit code if available
      checkResult.stdout = error.stdout || '';
      checkResult.stderr = error.stderr || error.message; // Capture error message

      log(
        'ERROR',
        `[${checkIndex}/${total}] ${ICONS.error} ${THEME_COLORS.red}Critical Failure!${THEME_COLORS.reset} Execution Error: ${check.name} (${formatDuration(checkResult.durationMs)}) - ${error.shortMessage || error.message}`,
      );
      if (checkResult.stderr && checkResult.stderr.trim()) {
        log('ERROR', `  Stderr:\n${checkResult.stderr}`);
      }
      if (checkResult.stdout && checkResult.stdout.trim()) {
        log('ERROR', `  Stdout:\n${checkResult.stdout}`);
      }
    }
    return checkResult;
  };

  // --- Check Execution Loop ---
  if (config.config.runMode === 'parallel') {
    log('INFO', 'Engaging parallel thrusters... Maximum Q!');
    const checkPromises = allChecks.map((check, i) =>
      executeCheck(check, i, allChecks.length),
    );
    const completedResults = await Promise.all(checkPromises);
    results.push(...completedResults);
    checksPassed = results.filter((r) => r.status === 'success').length;
    checksFailed = results.filter((r) => r.status === 'failed').length;
  } else {
    // --- Sequential Execution (Staged Burn) ---
    log('INFO', 'Initiating sequential check stages...');
    for (let i = 0; i < allChecks.length; i++) {
      const check = allChecks[i];
      const checkResult = await executeCheck(check, i, allChecks.length);
      results.push(checkResult);

      if (checkResult.status === 'success') {
        checksPassed++;
      } else {
        checksFailed++;
        // Check if failFast (abort sequence) is enabled
        if (config.config.failFast) {
          log(
            'WARN',
            `${ICONS.warn} ${THEME_COLORS.yellow}FAIL FAST TRIGGERED!${THEME_COLORS.reset} Check '${check.name}' reported anomaly. Aborting sequence!`,
          );
          break; // Exit the loop
        }
      }
    }
  }

  const checksExecutionEnd = performance.now();
  const checksDurationMs = checksExecutionEnd - checksExecutionStart;
  const overallDurationMs = checksExecutionEnd - scriptStartTime;

  log(
    'DEBUG',
    `[System Telemetry - End] Heap Used: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
  );
  printSubHeader('Check Sequence Complete');
  log(
    'INFO',
    `Executed ${results.length}/${allChecks.length} checks in ${formatDuration(checksDurationMs)} (Total script duration: ${formatDuration(overallDurationMs)})`,
  );

  // --- Generate and Print Mission Report ---
  const gitCommitHash = await getGitCommitHash();
  const failedChecksData = results.filter((r) => r.status === 'failed');

  const reportData = {
    startTime: new Date(checksExecutionStart),
    commandExecuted: `node ${path.relative(process.cwd(), process.argv[1])}`,
    totalChecks: allChecks.length,
    passedChecks: checksPassed,
    failedChecks: checksFailed,
    failedCheckNames: failedChecksData.map(
      (check) =>
        `${check.name} ${THEME_COLORS.red}(Exit: ${check.exitCode ?? 'N/A'})${THEME_COLORS.reset}`, // Add exit code to failed check names
    ),
    durationSeconds: checksDurationMs / 1000,
    gitCommitHash: gitCommitHash,
    nodeVersion: process.version,
    platform: `${os.platform()} ${os.release()} (${os.arch()})`, // Add architecture
  };

  // Use the NASA-themed report generator
  const summaryOutput = generateMissionReport(reportData);
  console.log(summaryOutput);

  // --- Anomaly Analysis & Recommendations Section ---
  if (failedChecksData.length > 0) {
    printHeader(
      `${THEME_COLORS.red}${ICONS.anomaly} ANOMALY ANALYSIS & CORRECTIVE ACTION ${ICONS.anomaly}${THEME_COLORS.reset}`,
    );
    log(
      'ERROR',
      `Detected ${THEME_COLORS.red}${failedChecksData.length}${THEME_COLORS.reset} check(s) with anomalies:`,
    );
    failedChecksData.forEach((check) => {
      log(
        'ERROR',
        `  ${THEME_COLORS.orange}↳ ${check.name}${THEME_COLORS.reset}`,
      );
    });

    console.log(
      `\n${THEME_COLORS.yellow}==================[ ATTENTION: CORRECTIVE ACTION REQUIRED ]==================${THEME_COLORS.reset}`,
    );

    failedChecksData.forEach((check) => {
      console.log(
        `\n${THEME_COLORS.blue}• Anomaly Source: ${check.name}${THEME_COLORS.reset}`,
      );
      const errorOutput = (
        check.stderr ||
        check.stdout ||
        'No specific telemetry captured for this anomaly.'
      ).trim();
      console.log(
        `  ${THEME_COLORS.grey}Review relevant telemetry snippet below:${THEME_COLORS.reset}`,
      );
      console.log(
        `${THEME_COLORS.red}----------[ Telemetry Snippet Start ]----------${THEME_COLORS.reset}`,
      );
      // Indent snippet lines for clarity
      console.log(
        `  ${truncateOutput(errorOutput, 15).split('\n').join('\n  ')}`,
      );
      console.log(
        `${THEME_COLORS.red}----------[  Telemetry Snippet End  ]----------${THEME_COLORS.reset}`,
      );
      console.log(
        `  ${THEME_COLORS.grey}Command Sequence:${THEME_COLORS.reset} ${THEME_COLORS.blue}${check.command}${THEME_COLORS.reset}`,
      );
    });

    // Updated Debug Protocol
    console.log(`
${THEME_COLORS.yellow}====================[ FAILURE ANALYSIS PROTOCOL ]====================${THEME_COLORS.reset}

${THEME_COLORS.red}MISSION CONTROL ALERT:${THEME_COLORS.reset} Wescore detected quality anomalies!

${THEME_COLORS.white}Corrective Action Procedure:${THEME_COLORS.reset}
1. Analyze the ${THEME_COLORS.blue}WESCORE Mission Report${THEME_COLORS.reset} above. Focus on ${THEME_COLORS.red}ANOMALY${THEME_COLORS.reset} checks.
2. Examine the ${THEME_COLORS.yellow}Telemetry Snippets${THEME_COLORS.reset} for each anomaly. Identify:
    - Specific error messages or codes.
    - File paths and line numbers indicating the source.
3. Implement necessary code corrections to resolve the identified issues.

${THEME_COLORS.white}Post-Correction Verification:${THEME_COLORS.reset}
1. Re-run the full diagnostic sequence: ${THEME_COLORS.green}npm run cq${THEME_COLORS.reset}
2. Confirm all checks report ${THEME_COLORS.green}Nominal${THEME_COLORS.reset} status.
3. If anomalies persist, repeat the analysis and correction cycle. Ensure mission readiness.

${THEME_COLORS.white}Documentation & Version Control:${THEME_COLORS.reset}
- Log corrective actions clearly (e.g., in commit messages).
- Commit the verified, corrected code to version control.

${THEME_COLORS.yellow}=====================================================================${THEME_COLORS.reset}
`);
  } else {
    // Success message
    log(
      'INFO',
      `${THEME_COLORS.green}${THEME_COLORS.blink}*** All checks nominal! Mission Success! ✨🚀 ***${THEME_COLORS.reset}`,
    );
  }

  // Exit with appropriate code (0 for success, 1 for check failures)
  log(
    'INFO',
    `Mission Control signing off... Exiting with status code ${checksFailed > 0 ? 1 : 0}.`,
  );
  process.exit(checksFailed > 0 ? 1 : 0);
}

// --- Script Entry Point ---
// Enable debug logging via environment variable or command-line flag
if (
  process.env.LOG_LEVEL === 'DEBUG' ||
  process.argv.includes('--debug') ||
  process.argv.includes('-d')
) {
  currentLogLevel = LOG_LEVELS.DEBUG;
  // Log debug activation after the header for cleaner startup
}

// Initiate the main check sequence
runChecks().catch((error) => {
  // Catch unexpected errors within the runner script itself
  console.error(
    `\n${THEME_COLORS.red}${THEME_COLORS.blink}*** CATASTROPHIC SYSTEM FAILURE ***${THEME_COLORS.reset}`,
  );
  console.error(
    `${THEME_COLORS.red}A major malfunction occurred within the Wescore Mission Control runner!${THEME_COLORS.reset}`,
  );
  console.error(error.stack);
  process.exit(2); // Use a distinct exit code (2) for runner errors
});
