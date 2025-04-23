// .wescore/scripts/check-quality.mjs
// <<< WESCORE 90s EDITION - GET READY TO CHECK IT! >>>

import { execa } from 'execa';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
// Keep the original header generator for data, we'll wrap it

// --- 90s Vibe Configuration ---
const THEME_COLORS = {
  reset: '\x1b[0m',
  // Brighter, more distinct colors
  red: '\x1b[91m', // Bright Red
  green: '\x1b[92m', // Bright Green
  yellow: '\x1b[93m', // Bright Yellow
  blue: '\x1b[94m', // Bright Blue
  magenta: '\x1b[95m', // Bright Magenta
  cyan: '\x1b[96m', // Bright Cyan
  white: '\x1b[97m', // Bright White
  grey: '\x1b[90m', // Keep grey for subtle stuff
  blackBg: '\x1b[40m',
  cyanBg: '\x1b[46m',
  whiteBg: '\x1b[47m',
  blink: '\x1b[5m', // Use sparingly!
};

const ICONS = {
  success: `${THEME_COLORS.green}✅${THEME_COLORS.reset}`, // Checkmark
  failure: `${THEME_COLORS.red}❌${THEME_COLORS.reset}`, // Cross Mark
  error: `${THEME_COLORS.yellow}💥${THEME_COLORS.reset}`, // Explosion/Bang
  running: `${THEME_COLORS.cyan}▶${THEME_COLORS.reset}`, // Play Button
  info: `${THEME_COLORS.blue}ℹ️${THEME_COLORS.reset}`, // Info Symbol
  warn: `${THEME_COLORS.yellow}⚠️${THEME_COLORS.reset}`, // Warning Symbol
  debug: `${THEME_COLORS.grey}⚙️${THEME_COLORS.reset}`, // Gear/Settings
  clock: '⏱️',
  floppy: '💾', // For config loading
  modem: '📞', // For network/git stuff?
  skull: '💀', // For epic fails
};

// --- Configuration Loading ---
const CONFIG_PATH = path.resolve(process.cwd(), '.wescore.json');
let config = {
  config: {
    runMode: 'sequential',
    failFast: false,
    commandTimeout: 300000,
  },
  checks: [],
};
let allChecks = [];

async function loadConfig() {
  log(
    'INFO',
    `${ICONS.floppy} Accessing Configuration Matrix from ${THEME_COLORS.cyan}${CONFIG_PATH}${THEME_COLORS.reset}...`
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
          `Config Error! Check at index ${index} needs a valid 'name', dude!`
        );
      }
      if (!check.command || typeof check.command !== 'string') {
        throw new Error(
          `Config Error! Check "${check.name}" is missing a 'command'. Not cool!`
        );
      }
    });

    allChecks = config.checks.filter((check) => check.enabled !== false);
    log(
      'INFO',
      `${THEME_COLORS.green}Configuration Loaded!${THEME_COLORS.reset} Found ${THEME_COLORS.magenta}${allChecks.length}${THEME_COLORS.reset} enabled checks. Let's do this!`
    );
    log(
      'DEBUG',
      `Run Mode: ${config.config.runMode}, Fail Fast: ${config.config.failFast}, Timeout: ${config.config.commandTimeout}ms`
    );
  } catch (error) {
    log(
      'WARN',
      `${ICONS.warn} Whoa! Could not load or parse ${CONFIG_PATH}. No checks will run. Bummer! Error: ${error.message}`
    );
    allChecks = [];
  }
}

// --- Logger ---
const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
let currentLogLevel = LOG_LEVELS.INFO;

function log(level, message) {
  if (LOG_LEVELS[level] === undefined || LOG_LEVELS[level] < currentLogLevel) {
    return;
  }
  const timestamp = new Date().toLocaleTimeString(); // Shorter timestamp
  let color = THEME_COLORS.reset;
  let icon = '';
  let prefixText = level.padEnd(5);

  switch (level) {
    case 'ERROR':
      color = THEME_COLORS.red;
      icon = ICONS.failure;
      prefixText = 'ERROR'; // Keep it clear
      break;
    case 'WARN':
      color = THEME_COLORS.yellow;
      icon = ICONS.warn;
      prefixText = 'ALERT'; // More 90s?
      break;
    case 'INFO':
      color = THEME_COLORS.white; // Use white for general info
      icon = ICONS.info;
      prefixText = 'INFO ';
      break;
    case 'DEBUG':
      color = THEME_COLORS.grey;
      icon = ICONS.debug;
      prefixText = 'DEBUG';
      break;
  }

  const prefix = `${THEME_COLORS.grey}[${timestamp}]${THEME_COLORS.reset} ${icon} [${color}${prefixText}${THEME_COLORS.reset}] `;
  const indentedMessage = message
    .split('\n')
    .map((line, index) => (index === 0 ? line : `        ${line}`)) // More indent
    .join('\n');
  console.log(prefix + indentedMessage);
}

// --- Helper Functions ---
function formatDuration(ms) {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

function truncateOutput(output, maxLines = 10) {
  if (!output) return '<No Output Captured>';
  const lines = output.trim().split('\n');
  if (lines.length <= maxLines) {
    return output.trim();
  }
  return (
    lines.slice(0, maxLines).join('\n') +
    `\n${THEME_COLORS.grey}... (Output Truncated - Too much text, man!)${THEME_COLORS.reset}`
  );
}

async function getGitCommitHash() {
  try {
    const { stdout } = await execa('git', ['rev-parse', '--short', 'HEAD'], {
      reject: false,
      stderr: 'ignore',
    });
    return stdout.trim() || 'N/A (Not a Git Repo?)';
  } catch (error) {
    log('DEBUG', `Couldn't get Git hash: ${error.message}`);
    return 'N/A (Error)';
  }
}

// --- ASCII Art & Styling ---
function printSeparator(char = '=', length = 60) {
  console.log(THEME_COLORS.magenta + char.repeat(length) + THEME_COLORS.reset);
}

function printHeader(text) {
  printSeparator('=', 60);
  console.log(
    `${THEME_COLORS.cyanBg}${THEME_COLORS.blackBg}>> ${text.padEnd(54)} <<${THEME_COLORS.reset}`
  );
  printSeparator('=', 60);
}

function printSubHeader(text) {
  console.log(`\n${THEME_COLORS.cyan}--- ${text} ---${THEME_COLORS.reset}`);
}

function generateRetroSummary(data) {
  const border = `${THEME_COLORS.magenta}*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*${THEME_COLORS.reset}`;
  const emptyLine = `${THEME_COLORS.magenta}*${' '.repeat(58)}*${THEME_COLORS.reset}`;
  const textLine = (label, value) => {
    const formattedValue =
      value.length > 40 ? value.slice(0, 37) + '...' : value; // Truncate long values
    const line = ` ${label}: ${formattedValue}`;
    return `${THEME_COLORS.magenta}*${THEME_COLORS.white}${line.padEnd(58)}${THEME_COLORS.magenta}*${THEME_COLORS.reset}`;
  };

  const failedChecksLines = data.failedCheckNames.map((name) =>
    textLine('  - Failed', name)
  );

  return `
${border}
${emptyLine}
${THEME_COLORS.magenta}*  ${THEME_COLORS.yellow}${THEME_COLORS.blink}W E S C O R E   R U N   S U M M A R Y${THEME_COLORS.reset}${THEME_COLORS.magenta}                     *${THEME_COLORS.reset}
${emptyLine}
${border}
${textLine('Start Time', data.startTime.toLocaleString())}
${textLine('Command', data.commandExecuted)}
${textLine('Node Version', data.nodeVersion)}
${textLine('Platform', data.platform)}
${textLine('Git Commit', data.gitCommitHash || 'N/A')}
${emptyLine}
${textLine('Total Checks', `${data.totalChecks}`)}
${textLine('Passed', `${THEME_COLORS.green}${data.passedChecks}${THEME_COLORS.reset}`)}
${textLine('Failed', `${data.failedChecks > 0 ? THEME_COLORS.red : THEME_COLORS.green}${data.failedChecks}${THEME_COLORS.reset}`)}
${failedChecksLines.join('\n')}
${emptyLine}
${textLine('Duration', `${formatDuration(data.durationSeconds * 1000)} ${ICONS.clock}`)}
${border}
  `;
}

// --- Main Execution Logic ---
// eslint-disable-next-line sonarjs/cognitive-complexity
async function runChecks() {
  // --- 90s Intro ---
  console.log(THEME_COLORS.cyan);
  console.log(String.raw`
█░█░█ █▀▀ █▀ █▀▀ █▀█ █▀█ █▀▀   ▄▀█ █▄░█ █▀▄   █▀▀ █░█ █ █░░ █░░ 
▀▄▀▄▀ ██▄ ▄█ █▄▄ █▄█ █▀▄ ██▄   █▀█ █░▀█ █▄▀   █▄▄ █▀█ █ █▄▄ █▄▄ 
  `);
  console.log(THEME_COLORS.reset);
  printHeader('WESCORE QUALITY CHECK - 90s EDITION');
  log('INFO', 'Initializing subsystems... Stand by...');

  const scriptStartTime = performance.now();
  await loadConfig(); // Load config first

  if (allChecks.length === 0) {
    log(
      'ERROR',
      `${ICONS.skull} No enabled checks found! Cannot proceed. Check your ${THEME_COLORS.cyan}.wescore.json${THEME_COLORS.reset}!`
    );
    process.exit(1);
  }

  const checksExecutionStart = performance.now();
  log('INFO', 'Boot sequence complete. Engaging quality checks...');
  log(
    'DEBUG',
    `[Sys Stats - Start] Heap Used: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
  );
  log(
    'INFO',
    `${THEME_COLORS.magenta}⚡ Go Go Go!${THEME_COLORS.reset} Running ${THEME_COLORS.cyan}${allChecks.length}${THEME_COLORS.reset} checks in ${THEME_COLORS.yellow}${config.config.runMode}${THEME_COLORS.reset} mode!`
  );

  const results = [];
  let checksPassed = 0;
  let checksFailed = 0;

  const executeCheck = async (check, index, total) => {
    const checkIndex = index + 1;
    log(
      'INFO',
      `\n[${checkIndex}/${total}] ${ICONS.running} Engaging: ${THEME_COLORS.yellow}${check.name}${THEME_COLORS.reset} (${THEME_COLORS.cyan}${check.command}${THEME_COLORS.reset})`
    );
    const checkStart = performance.now();
    let checkResult = {
      name: check.name,
      command: check.command,
      status: 'failed',
      durationMs: 0,
      exitCode: null,
      stdout: '',
      stderr: '',
    };

    try {
      const result = await execa(check.command, {
        shell: true,
        timeout: config.config.commandTimeout,
        cwd: check.cwd || process.cwd(),
        reject: false, // Don't throw, we handle exit codes
      });

      const checkEnd = performance.now();
      checkResult.durationMs = checkEnd - checkStart;
      checkResult.stdout = result.stdout || '';
      checkResult.stderr = result.stderr || '';
      checkResult.exitCode = result.exitCode;

      if (result.exitCode === 0) {
        checkResult.status = 'success';
        log(
          'INFO',
          `[${checkIndex}/${total}] ${ICONS.success} ${THEME_COLORS.green}Rad!${THEME_COLORS.reset} Check PASSED: ${check.name} (${formatDuration(checkResult.durationMs)})`
        );
        if (checkResult.stderr && checkResult.stderr.trim()) {
          log(
            'WARN',
            `  ${ICONS.warn} Hmm, stderr output on success:\n${truncateOutput(checkResult.stderr, 5)}`
          );
        }
      } else {
        checkResult.status = 'failed';
        log(
          'ERROR',
          `[${checkIndex}/${total}] ${ICONS.failure} ${THEME_COLORS.red}Bummer!${THEME_COLORS.reset} Check FAILED (Exit Code ${checkResult.exitCode}): ${check.name} (${formatDuration(checkResult.durationMs)})`
        );
        log(
          'ERROR',
          `  ${THEME_COLORS.red}Output Log:${THEME_COLORS.reset}\n--- Error Output ---`
        );
        if (checkResult.stderr && checkResult.stderr.trim()) {
          log(
            'ERROR',
            `  ${THEME_COLORS.yellow}Stderr:${THEME_COLORS.reset}\n${checkResult.stderr}`
          );
        }
        if (checkResult.stdout && checkResult.stdout.trim()) {
          log(
            'ERROR',
            `  ${THEME_COLORS.yellow}Stdout:${THEME_COLORS.reset}\n${checkResult.stdout}`
          );
        }
        log('ERROR', `--- End Error Output ---`);
      }
    } catch (error) {
      const checkEnd = performance.now();
      checkResult.durationMs = checkEnd - checkStart;
      checkResult.status = 'failed';
      checkResult.exitCode = error.exitCode ?? error.code ?? 1;
      checkResult.stdout = error.stdout || '';
      checkResult.stderr = error.stderr || error.message;

      log(
        'ERROR',
        `[${checkIndex}/${total}] ${ICONS.error} ${THEME_COLORS.red}Crash and Burn!${THEME_COLORS.reset} Execution Error: ${check.name} (${formatDuration(checkResult.durationMs)}) - ${error.shortMessage || error.message}`
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
    log('INFO', 'Firing up parallel processors... Warp speed!');
    const checkPromises = allChecks.map((check, i) =>
      executeCheck(check, i, allChecks.length)
    );
    const completedResults = await Promise.all(checkPromises);
    results.push(...completedResults);
    checksPassed = results.filter((r) => r.status === 'success').length;
    checksFailed = results.filter((r) => r.status === 'failed').length;
  } else {
    // --- Sequential Execution ---
    log('INFO', 'Running checks one by one... Patience, young grasshopper.');
    for (let i = 0; i < allChecks.length; i++) {
      const check = allChecks[i];
      const checkResult = await executeCheck(check, i, allChecks.length);
      results.push(checkResult);

      if (checkResult.status === 'success') {
        checksPassed++;
      } else {
        checksFailed++;
        if (config.config.failFast) {
          log(
            'WARN',
            `${ICONS.warn} ${THEME_COLORS.yellow}FAIL FAST!${THEME_COLORS.reset} Check '${check.name}' failed. Aborting mission!`
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
    `[Sys Stats - End] Heap Used: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
  );
  printSubHeader('Checks Complete');
  log(
    'INFO',
    `Ran ${results.length}/${allChecks.length} checks in ${formatDuration(checksDurationMs)} (Total script time: ${formatDuration(overallDurationMs)})`
  );

  // --- Generate and Print Summary ---
  const gitCommitHash = await getGitCommitHash();
  const failedChecksData = results.filter((r) => r.status === 'failed');

  const headerData = {
    startTime: new Date(checksExecutionStart),
    commandExecuted: `node ${path.relative(process.cwd(), process.argv[1])}`,
    totalChecks: allChecks.length,
    passedChecks: checksPassed,
    failedChecks: checksFailed,
    failedCheckNames: failedChecksData.map(
      (check) =>
        `${check.name} ${THEME_COLORS.red}(Exit: ${check.exitCode || 'N/A'})${THEME_COLORS.reset}`
    ),
    durationSeconds: checksDurationMs / 1000,
    gitCommitHash: gitCommitHash,
    nodeVersion: process.version,
    platform: `${os.platform()} ${os.release()}`,
  };

  // Use the new retro summary generator
  const summaryOutput = generateRetroSummary(headerData);
  console.log(summaryOutput);

  // --- Recommendations Section ---
  if (failedChecksData.length > 0) {
    printHeader(
      `${THEME_COLORS.red}${ICONS.skull} TROUBLESHOOTING ZONE ${ICONS.skull}${THEME_COLORS.reset}`
    );
    log(
      'ERROR',
      `Detected ${THEME_COLORS.red}${failedChecksData.length}${THEME_COLORS.reset} failed check(s):`
    );
    failedChecksData.forEach((check) => {
      log(
        'ERROR',
        `  ${THEME_COLORS.magenta}▼ ${check.name}${THEME_COLORS.reset}`
      );
    });

    console.log(
      `\n${THEME_COLORS.yellow}=====================[ Action Required! ]=====================${THEME_COLORS.reset}`
    );

    failedChecksData.forEach((check) => {
      console.log(
        `\n${THEME_COLORS.cyan}• Check Failed: ${check.name}${THEME_COLORS.reset}`
      );
      const errorOutput = (
        check.stderr ||
        check.stdout ||
        'No specific output captured.'
      ).trim();
      console.log(
        `  ${THEME_COLORS.grey}Review the error log snippet below:${THEME_COLORS.reset}`
      );
      console.log(
        `${THEME_COLORS.red}----------[ Error Snippet Start ]----------${THEME_COLORS.reset}`
      );
      // Indent snippet lines
      console.log(
        `  ${truncateOutput(errorOutput, 15).split('\n').join('\n  ')}`
      );
      console.log(
        `${THEME_COLORS.red}----------[  Error Snippet End  ]----------${THEME_COLORS.reset}`
      );
      console.log(
        `  ${THEME_COLORS.grey}Command was:${THEME_COLORS.reset} ${THEME_COLORS.cyan}${check.command}${THEME_COLORS.reset}`
      );
    });

    console.log(`
${THEME_COLORS.yellow}=====================[ Debug Protocol ]=====================${THEME_COLORS.reset}

${THEME_COLORS.red}SYSTEM ALERT:${THEME_COLORS.reset} Wescore detected quality issues!

${THEME_COLORS.white}Instructions, Dude:${THEME_COLORS.reset}
1. Peep the ${THEME_COLORS.cyan}WESCORE Run Summary${THEME_COLORS.reset} above. Focus on the ${THEME_COLORS.red}FAILED${THEME_COLORS.reset} checks.
2. Scope out the ${THEME_COLORS.yellow}Error Snippets${THEME_COLORS.reset} for each failed check. Look for clues like:
    - File paths & Line numbers
    - Gnarly error messages
3. Fix the busted code! Make it righteous!

${THEME_COLORS.white}After Fixing:${THEME_COLORS.reset}
1. Re-run the checks: ${THEME_COLORS.green}npm run cq${THEME_COLORS.reset}
2. Make sure everything is ${THEME_COLORS.green}Totally Tubular${THEME_COLORS.reset} (all checks pass).
3. If it's still messed up, repeat the process. Don't be a poser!

${THEME_COLORS.white}Documentation:${THEME_COLORS.reset}
- Log your changes (like in a commit message).
- Commit the awesome, fixed code.

${THEME_COLORS.yellow}============================================================${THEME_COLORS.reset}
`);
  } else {
    // Success message
    log(
      'INFO',
      `${THEME_COLORS.green}${THEME_COLORS.blink}*** All checks passed! Excellent! ✨ ***${THEME_COLORS.reset}`
    );
  }

  // Exit with appropriate code
  log(
    'INFO',
    `Shutdown sequence initiated... Exiting with code ${checksFailed > 0 ? 1 : 0}.`
  );
  process.exit(checksFailed > 0 ? 1 : 0);
}

// --- Script Entry Point ---
if (
  process.env.LOG_LEVEL === 'DEBUG' ||
  process.argv.includes('--debug') ||
  process.argv.includes('-d')
) {
  currentLogLevel = LOG_LEVELS.DEBUG;
  // Don't log debug enabling message until after the header
}

// Run the main function
runChecks().catch((error) => {
  // Catch unexpected script errors
  console.error(
    `\n${THEME_COLORS.red}${THEME_COLORS.blink}*** FATAL SYSTEM ERROR ***${THEME_COLORS.reset}`
  );
  console.error(
    `${THEME_COLORS.red}A major glitch occurred in the Wescore runner itself!${THEME_COLORS.reset}`
  );
  console.error(error.stack);
  process.exit(2); // Different exit code for runner errors
});
