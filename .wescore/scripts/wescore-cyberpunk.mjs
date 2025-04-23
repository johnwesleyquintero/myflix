// .wescore/scripts/wescore-cyberpunk.mjs
// <<< WESCORE CYBERPUNK EDITION v2077.42 - SYSTEM INTEGRITY CHECK >>>
// Accessing the digital ghost... Beware the ICE.

// ==================================================================
// == SECTION 1: IMPORTS - LOADING THE DECK ========================
// ==================================================================
import boxen from 'boxen'; // For console data framing
import chalk from 'chalk'; // Essential for that neon glow
import { Spinner } from 'cli-spinner'; // Visual feedback during operations
import { execa } from 'execa'; // The core execution engine
import figlet from 'figlet'; // For imposing ASCII headers
import { promises as fs } from 'node:fs'; // Filesystem access (data shards)
import os from 'node:os'; // System hardware specs
import path from 'node:path'; // Navigating the data pathways
import { performance } from 'node:perf_hooks'; // Precision timing
import sound from 'sound-play'; // Auditory feedback interface

// ==================================================================
// == SECTION 2: CYBER CONFIG - TUNING THE RIG =====================
// ==================================================================
const CYBER_CONFIG = {
  enforceProtocols: true, // Strict adherence required
  abortOnGlitch: false, // Continue run despite anomalies? Or flatline early?
  maxOpTime: 300000, // Max duration per subroutine (ms). 5 mins.
  glitchDensity: 0.7, // Aesthetic glitch level (not functional)
  glitchTextMode: true, // Apply text corruption effect?
  soundEffects: {
    // REQUIRES USER-PROVIDED AUDIO FILES IN ./sounds/
    startup: 'sounds/cyber-startup.mp3', // e.g., Powering up cyberdeck
    error: 'sounds/system-alert-glitch.mp3', // e.g., Intrusion alert, static burst
    successSingle: 'sounds/data-packet-confirm.mp3', // e.g., Short synth confirmation
    successAll: 'sounds/netrun-success-ambient.mp3', // e.g., Uplifting synth sequence
    failReport: 'sounds/connection-severed.mp3', // e.g., Flatline tone, distorted voice
  },
  colors: {
    // Neon Noir Palette
    error: (text) => chalk.hex('#ff003c').bold(text), // Glaring Red Alert
    warn: (text) => chalk.hex('#ffae00')(text), // Caution Yellow/Orange
    success: (text) => chalk.hex('#00ffae').bold(text), // Cyan/Green Success Signal
    info: (text) => chalk.hex('#40c4ff')(text), // Electric Blue Data Stream
    debug: (text) => chalk.hex('#777777')(text), // Dim Grey System Internals
    header: (text) => chalk.hex('#ff00ff')(text), // Neon Magenta Header
    border: chalk.cyan, // Sharp Cyan Borders
    checkName: chalk.whiteBright.bold, // Standout White for Check Names
    duration: chalk.hex('#ae00ff'), // Deep Purple for Timings
    timestamp: chalk.hex('#555555'), // Dark Grey Timestamp
    asciiArt: chalk.hex('#39ff14'), // Classic Terminal Green
    critical: (text) => chalk.bgRed.whiteBright.bold(text), // For catastrophic failures
  },
  spinners: [
    // Digital / Glitchy Spinners
    '|/-\\|',
    '▖▘▝▗',
    '┤┘┴└├┌┬┐',
    '◢◣◤◥',
    '▉▊▋▌▍▎▏▎▍▌▋▊▉',
    '░▒▓█▓▒░',
    '◐◓◑◒',
  ],
};

// ==================================================================
// == SECTION 3: RESPONSE MATRIX - SYSTEM FEEDBACK ===============
// ==================================================================
const GLITCH_RESPONSES_FAIL = [
  'SYSTEM SHOCK! Critical error detected.',
  'ICE intrusion! Check protocols compromised.',
  'Memory leak detected. Data corruption probable.',
  'Signal lost in the noise. Check failed.',
  'De-rezzed! Subroutine terminated unexpectedly.',
  'Corp code detected! Non-compliance failure.',
  'Wetware conflict! Check integrity questionable.',
  'Just a glitch in the Matrix...',
  'ERROR: Segmentation Fault (Core Dumped)',
  'Black ICE countermeasure triggered!',
  'Packet loss exceeds threshold. Unstable.',
  'Resonance cascade failure!',
  'Trace program active... Anomaly logged.',
];

const SIGNAL_RESPONSES_SUCCESS = [
  'Signal Acquired. Check Nominal.',
  'ICE bypassed. Protocol Verified.',
  'Data Heist Complete. Check Passed.',
  'System Optimized. Integrity Confirmed.',
  'Clean Run. No anomalies detected.',
  'Ghost in the Machine approves.',
  'Jacked In & Nominal.',
  'Connection Stable. Check OK.',
  'Subroutine executed successfully.',
  'Biometrics Green. Check Passed.',
  'Neural Link Stable. Operation Success.',
];

// ==================================================================
// == SECTION 4: VISUAL INTERFACE - NEON & CHROME =================
// ==================================================================
// Utility to pick random stuff
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Play sound safely, logging debug info if fails
async function playSound(soundType) {
  const soundPath = CYBER_CONFIG.soundEffects[soundType];
  if (soundPath) {
    try {
      await fs.access(soundPath); // Check existence first
      await sound.play(soundPath);
    } catch (err) {
      const errorMsg =
        err.code === 'ENOENT'
          ? `Sound file not found: ${soundPath}`
          : `Failed to play sound '${soundType}' from ${soundPath}: ${err.message}`;
      log('DEBUG', `${errorMsg}. Cannot play '${soundType}' sound.`);
    }
  } else {
    log('DEBUG', `Sound type '${soundType}' not configured.`);
  }
}

// Generate imposing ASCII headers
function renderFiglet(text, font = 'Standard', colorFn = chalk.white) {
  try {
    // Fonts to try: Cybermedium, Doom, Ghost, Poison, Slant, Standard
    const rendered = figlet.textSync(text, { font });
    console.log(colorFn(rendered));
  } catch (error) {
    console.log(colorFn.bold(`\n>>> ${text} <<<\n`)); // Simple fallback
    log('DEBUG', `Figlet rendering failed (font: ${font}): ${error.message}`);
  }
}

function showCyberHeader() {
  renderFiglet('WESCORE', 'Cybermedium', CYBER_CONFIG.colors.header);
  console.log(
    CYBER_CONFIG.colors.header(
      '<<< CYBERPUNK EDITION // v2077.42 // SYSTEM CHECK INITIATED >>>'
    )
  );
  console.log(
    CYBER_CONFIG.colors.asciiArt(String.raw`
  ▄ .▄ ▄▄▄· ▄▄▌  ▪  ▄▄▄   ▄▄▄· .▄▄ · ▪   ▄▄▄·
 ██▪▐█▐█ ▀█ ██•  ██ ▀▄ █·▐█ ▀█ ▐█ ▀. ██ ▐█ ▀█
 ██▀▐█▄█▀▀█ ██▪  ▐█·▐▀▀▄ ▄█▀▀█ ▄▀▀▀█▄▐█·▄█▀▀█
 ██▌▐▀▐█ ▪▐▌▐█▌▐▌▐█▌▐█•█▌▐█ ▪▐▌▐█▄▪▐█▐█▌▐█ ▪▐▌
 ▀▀▀ · ▀  ▀ .▀▀▀ ▀▀▀.▀  ▀ ▀  ▀  ▀▀▀▀ ▀▀▀ ▀  ▀
 // System Integrity Scan Initializing... Standby. //
`)
  );
  playSound('startup');
}

// ==================================================================
// == SECTION 5: LOG STREAM - DATA FEED ===========================
// ==================================================================
function log(level, message, checkName = '') {
  const timestamp = new Date().toISOString(); // ISO for precision
  let colorFn = chalk.white;
  let prefixIcon = '»'; // Default info icon

  switch (level.toUpperCase()) {
    case 'ERROR':
      colorFn = CYBER_CONFIG.colors.error;
      prefixIcon = '☣️'; // Biohazard / Critical
      break;
    case 'WARN':
      colorFn = CYBER_CONFIG.colors.warn;
      prefixIcon = '⚠️'; // Warning
      break;
    case 'SUCCESS':
      colorFn = CYBER_CONFIG.colors.success;
      prefixIcon = '✓'; // Checkmark / Success
      break;
    case 'INFO':
      colorFn = CYBER_CONFIG.colors.info;
      prefixIcon = '»'; // Data stream arrow
      break;
    case 'DEBUG':
      colorFn = CYBER_CONFIG.colors.debug;
      prefixIcon = '🔧'; // Wrench / Internals
      break;
  }

  // Glitch Text transformation (optional)
  const transformText = (str) => {
    if (!CYBER_CONFIG.glitchTextMode) return str;
    // Simple glitch: occasional case swap, digit swap
    return str
      .split('')
      .map((char) => {
        if (Math.random() < CYBER_CONFIG.glitchDensity * 0.05) {
          // Lower probability
          if (char.match(/[a-z]/)) return char.toUpperCase();
          if (char.match(/[A-Z]/)) return char.toLowerCase();
          if (char === 'e') return '3';
          if (char === 'a') return '4';
          if (char === 'o') return '0';
          if (char === 's') return '5';
        }
        return char;
      })
      .join('');
  };

  const levelText = level.toUpperCase().padEnd(7); // Pad for alignment
  const prefix = `${CYBER_CONFIG.colors.timestamp(`[${timestamp}]`)} ${prefixIcon} ${chalk.bold(colorFn(`[${transformText(levelText)}]`))}`;
  const checkTag = checkName
    ? CYBER_CONFIG.colors.checkName(`[${checkName}]`)
    : '';

  // Handle multi-line messages with proper indentation, applying color and transform
  const messageLines = String(message).split('\n');
  const formattedMessage = messageLines
    .map((line, i) => {
      // Calculate length of prefix *without* ANSI codes for accurate indent
      const plainPrefixLength = stripAnsi(prefix).length;
      const indent = i === 0 ? '' : ' '.repeat(plainPrefixLength + 1);
      return `${indent}${colorFn(transformText(line))}`;
    })
    .join('\n');

  console.log(`${prefix} ${checkTag} ${formattedMessage}`);
}

// Helper to strip ANSI codes for length calculation
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// ==================================================================
// == SECTION 6: ANOMALY HANDLER - GLITCHES & ALERTS ==============
// ==================================================================
function handleGlitch(error, check) {
  const randomResponse = getRandom(GLITCH_RESPONSES_FAIL);
  const errorDetails = stripAnsi(
    error.stderr || error.stdout || error.message || 'Unknown Anomaly'
  ); // Strip ANSI from command output
  const exitCodeInfo = error.exitCode ? ` (Exit Code: ${error.exitCode})` : '';

  const errorBoxContent = `${CYBER_CONFIG.colors.error(randomResponse)}${exitCodeInfo}\n\n${chalk.white(errorDetails)}`;

  const errorBox = boxen(errorBoxContent, {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    title: `☣️ ANOMALY DETECTED: ${check.name} ☣️`,
    titleAlignment: 'center',
    borderStyle: 'double',
    borderColor: CYBER_CONFIG.colors.error(''), // Use the color function
  });

  console.error(errorBox); // Log semantic errors to stderr
  playSound('error');
}

// ==================================================================
// == SECTION 7: NOMINAL HANDLER - CLEAN SIGNALS ===================
// ==================================================================
function handleNominal(check, duration) {
  const randomResponse = getRandom(SIGNAL_RESPONSES_SUCCESS);
  log(
    'SUCCESS',
    `${randomResponse} (${CYBER_CONFIG.colors.duration(formatDuration(duration))})`,
    check.name
  );
  playSound('successSingle');
}

// ==================================================================
// == SECTION 8: SUBROUTINE EXECUTOR - RUNNING THE CODE ===========
// ==================================================================
async function runSubroutine(check, index, total) {
  const spinner = new Spinner(
    `${chalk.yellow(`[${index}/${total}]`)} %s ${CYBER_CONFIG.colors.checkName(check.name)}... ${chalk.gray('Establishing connection...')}`
  );
  spinner.setSpinnerString(getRandom(CYBER_CONFIG.spinners));
  spinner.start();

  const startTime = performance.now();
  let resultData = {
    ...check,
    status: 'pending', // Initial state
    duration: 0,
    stdout: '',
    stderr: '',
    exitCode: null,
    error: null, // Store actual error object if execa fails
  };

  try {
    const result = await execa(check.command, {
      shell: true, // Allow complex commands, pipes, etc.
      timeout: CYBER_CONFIG.maxOpTime,
      reject: false, // We handle exit codes manually
      all: true, // Capture interleaved stdout/stderr if needed (useful for some tools)
      env: { ...process.env, FORCE_COLOR: '1' }, // Attempt to force color output in subprocesses
    });

    const duration = performance.now() - startTime;
    spinner.stop(true); // Clear the spinner line

    resultData = {
      ...resultData,
      duration,
      stdout: result.stdout || '', // Prefer stdout/stderr separation
      stderr: result.stderr || '',
      exitCode: result.exitCode,
      // 'all' property contains interleaved output if needed: result.all
    };

    if (result.exitCode === 0) {
      resultData.status = 'nominal'; // Use 'nominal' for success
      handleNominal(check, duration);
    } else {
      resultData.status = 'glitched'; // Use 'glitched' for failure
      // Create an error-like object for the handler
      const failureError = new Error(
        `Subroutine failed with exit code ${result.exitCode}`
      );
      failureError.stdout = result.stdout;
      failureError.stderr = result.stderr;
      failureError.exitCode = result.exitCode;
      handleGlitch(failureError, check);
    }
  } catch (execaError) {
    // Catch errors from execa itself (timeout, command not found, etc.)
    const duration = performance.now() - startTime;
    spinner.stop(true);
    resultData = {
      ...resultData,
      status: 'critical_error', // Distinct status for runner errors
      duration,
      exitCode: execaError.exitCode ?? 1, // Best guess at exit code
      error: execaError, // Store the actual error
    };
    handleGlitch(execaError, check); // Use the same handler for consistency
  }
  return resultData;
}

// ==================================================================
// == SECTION 9: MAIN RUNTIME - JACKING IN =========================
// ==================================================================
async function runCyberCheck() {
  const scriptStartTime = performance.now();
  showCyberHeader();
  log('INFO', 'Powering up the cyberdeck... Initializing protocols...');

  try {
    const config = await loadConfig(); // Load and validate config
    const checks = config.checks; // Filtered in loadConfig

    if (checks.length === 0) {
      log(
        'WARN',
        'No active protocols found in .wescore.json. System idle. 🤷'
      );
      process.exit(0); // Exit normally if no checks defined
    }

    log(
      'INFO',
      `Located ${chalk.magenta(checks.length)} protocols. Mode: ${chalk.yellow(config.runMode)}. Abort on Glitch: ${chalk.yellow(config.abortOnGlitch)}. Engaging...`
    );
    log('INFO', 'Scanning the Net... Seeking targets...');

    const results = [];
    let nominalCount = 0;
    const totalChecks = checks.length;

    const executeProtocols = async () => {
      if (config.runMode === 'parallel') {
        log(
          'INFO',
          'Engaging parallel processing cores... Maximum bandwidth! 🔥'
        );
        const promises = checks.map((check, i) =>
          runSubroutine(check, i + 1, totalChecks)
        );
        // Use allSettled to ensure all promises complete, even if some reject
        const settledResults = await Promise.allSettled(promises);

        settledResults.forEach((settledResult) => {
          if (settledResult.status === 'fulfilled') {
            results.push(settledResult.value);
            if (settledResult.value.status === 'nominal') nominalCount++;
          } else {
            // This indicates an error *within* runSubroutine wasn't caught, which is unlikely but possible
            log(
              'ERROR',
              `CRITICAL RUNNER FAILURE: ${settledResult.reason?.message || settledResult.reason}`
            );
            // Create a placeholder result for reporting
            results.push({
              name: 'Unknown Protocol',
              command: 'Runner Malfunction',
              status: 'critical_error',
              duration: 0,
              error: settledResult.reason,
            });
          }
        });
      } else {
        // Sequential Mode
        log('INFO', 'Executing protocols sequentially... Maintaining stealth.');
        for (let i = 0; i < totalChecks; i++) {
          const check = checks[i];
          const result = await runSubroutine(check, i + 1, totalChecks);
          results.push(result);
          if (result.status === 'nominal') {
            nominalCount++;
          } else if (config.abortOnGlitch) {
            // Check if we need to abort early
            log(
              'WARN',
              `🚨 ABORT TRIGGERED! Protocol '${check.name}' glitched. Disconnecting! 🚨`
            );
            playSound('failReport'); // Play alert sound
            break; // Exit the loop immediately
          }
        }
      }
    };

    await executeProtocols();

    const scriptEndTime = performance.now();
    const totalDuration = scriptEndTime - scriptStartTime;

    showFinalSitrep(results, nominalCount, totalChecks, totalDuration);

    // Determine final exit code: 0 if all nominal, 1 otherwise
    const anomalyCount = results.filter((r) => r.status !== 'nominal').length;
    process.exit(anomalyCount > 0 ? 1 : 0);
  } catch (error) {
    // Catch top-level errors (e.g., config loading failed)
    log('ERROR', `FATAL SYSTEM ERROR! Connection unstable! 💥`);
    console.error(CYBER_CONFIG.colors.critical('>> KERNEL PANIC <<'));
    console.error(error); // Log the raw error object
    playSound('error');
    process.exit(2); // Distinct exit code for script/config errors
  }
}

// ==================================================================
// == SECTION 10: SITREP - POST-RUN ANALYSIS =======================
// ==================================================================
function showFinalSitrep(results, nominal, totalRun, totalDuration) {
  const anomalies = results.filter((r) => r.status !== 'nominal').length;
  const allNominal = nominal === totalRun && anomalies === 0;

  console.log('\n' + CYBER_CONFIG.colors.border('='.repeat(80)));
  if (allNominal) {
    renderFiglet('SYSTEM NOMINAL', 'Doom', CYBER_CONFIG.colors.success);
    log(
      'SUCCESS',
      'All protocols executed without anomaly. Clean run, netrunner. 😎'
    );
    playSound('successAll');
  } else {
    renderFiglet('ANOMALY DETECTED', 'Bloody', CYBER_CONFIG.colors.error);
    log(
      'ERROR',
      `Run incomplete or corrupted: ${anomalies} protocol(s) reported anomalies.`
    );
    playSound('failReport');
  }
  console.log(CYBER_CONFIG.colors.border('='.repeat(80)) + '\n');

  const summaryBox = boxen(
    [
      `${chalk.bold('// RUN ANALYSIS //')}`,
      ``,
      `Protocols Executed: ${chalk.yellow(results.length)} / ${chalk.yellow(totalRun)}`,
      `Nominal: ${CYBER_CONFIG.colors.success(nominal)}`,
      `Anomalies: ${anomalies > 0 ? CYBER_CONFIG.colors.error(anomalies) : chalk.gray(0)}`,
      `Total Op Time: ${CYBER_CONFIG.colors.duration(formatDuration(totalDuration))}`,
      ``,
      `System: ${chalk.blue(os.platform())} (${chalk.blue(os.arch())}) // Node: ${chalk.green(process.version)}`,
    ].join('\n'),
    {
      padding: 1,
      margin: 1,
      borderStyle: allNominal ? 'double' : 'classic',
      borderColor: allNominal
        ? CYBER_CONFIG.colors.success('')
        : CYBER_CONFIG.colors.error(''),
      title: '[ SITREP ]',
      titleAlignment: 'center',
      backgroundColor: '#111111', // Dark background for the box
    }
  );
  console.log(summaryBox);

  if (anomalies > 0) {
    log('WARN', 'Anomaly Details Logged:');
    results
      .filter((r) => r.status !== 'nominal')
      .forEach((check) => {
        const statusColor =
          check.status === 'critical_error'
            ? CYBER_CONFIG.colors.error
            : CYBER_CONFIG.colors.warn;
        const statusIcon = check.status === 'critical_error' ? '☣️' : '❗';
        const exitInfo = check.exitCode ? ` (Exit: ${check.exitCode})` : '';
        const errorMsg = check.error
          ? `: ${check.error.shortMessage || check.error.message}`
          : ''; // Show execa error message if present
        console.log(
          `  ${statusColor(statusIcon)} ${CYBER_CONFIG.colors.checkName(check.name)} ${statusColor(`[${check.status.toUpperCase()}]`)}${exitInfo}${errorMsg}`
        );
        // Optionally log truncated output for quick review
        // if (check.stderr) console.log(chalk.gray(`    Stderr: ${truncateOutput(check.stderr)}`));
      });
    log(
      'ERROR',
      'Review the logs above for detailed anomaly reports. Patch the system, choom.'
    );
  }

  log(
    'INFO',
    `Wescore Cyberpunk Edition disconnecting... ${allNominal ? 'Stay low.' : 'Watch your back.'}`
  );
}

// ==================================================================
// == SECTION 11: UTILITIES - TOOLKIT =============================
// ==================================================================
function formatDuration(ms) {
  if (ms < 0) return 'ERR'; // Error state
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(1)}min`; // Use 'min'
}

// Enhanced Config Loader with Cyberpunk Flavor
async function loadConfig() {
  const CONFIG_PATH = path.resolve(process.cwd(), '.wescore.json');
  log('DEBUG', `Accessing data shard: ${CONFIG_PATH}`);

  try {
    const rawConfig = await fs.readFile(CONFIG_PATH, 'utf-8');
    let configData;
    try {
      configData = JSON.parse(rawConfig);
    } catch (parseError) {
      throw new Error(
        `Data corruption in ${CONFIG_PATH}! JSON syntax error detected. Rogue AI interference?\n  ${parseError.message}`
      );
    }

    // Validate core structure
    if (!configData || typeof configData !== 'object') {
      throw new Error('Config shard empty or invalid structure.');
    }
    if (!configData.checks || !Array.isArray(configData.checks)) {
      throw new Error(
        "Config shard missing 'checks' array protocol. Data incomplete."
      );
    }

    const enabledChecks = configData.checks.filter((c, index) => {
      if (typeof c !== 'object' || c === null) {
        log(
          'WARN',
          `Protocol at index ${index} is corrupted (not an object). Skipping.`
        );
        return false;
      }
      if (!c.name || typeof c.name !== 'string') {
        log(
          'WARN',
          `Protocol at index ${index} lacks 'name' identifier. Skipping.`
        );
        return false;
      }
      if (!c.command || typeof c.command !== 'string') {
        log(
          'WARN',
          `Protocol "${c.name}" lacks 'command' subroutine. Skipping.`
        );
        return false;
      }
      // Default to enabled unless explicitly 'enabled: false'
      return c.enabled !== false;
    });

    log('DEBUG', `Loaded ${enabledChecks.length} active protocols.`);

    return {
      runMode: ['parallel', 'sequential'].includes(configData.config?.runMode)
        ? configData.config.runMode
        : 'sequential', // Default: sequential
      abortOnGlitch: configData.config?.failFast === true, // Use failFast from config
      checks: enabledChecks,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `Config shard not found at ${CONFIG_PATH}. Did the corpos wipe it? 🏢 Create one!`
      );
    }
    // Re-throw other validation/parse errors
    throw new Error(
      `Failed to load or validate config shard: ${error.message}`
    );
  }
}

// Helper to truncate output for display
function truncateOutput(output, maxLines = 10) {
  if (!output) return '<No Telemetry>';
  const lines = stripAnsi(output).trim().split('\n'); // Strip ANSI before truncating
  if (lines.length <= maxLines) {
    return lines.join('\n');
  }
  return (
    lines.slice(0, maxLines).join('\n') +
    `\n${CYBER_CONFIG.colors.debug('... (Telemetry Stream Truncated)')}`
  );
}

// ==================================================================
// == SECTION 12: IGNITION - FIRE IN THE HOLE! =====================
// ==================================================================
runCyberCheck().catch((e) => {
  // Final safety net for uncaught exceptions in the runner itself
  console.error(
    '\n' +
      CYBER_CONFIG.colors.critical(
        '! C A T A S T R O P H I C   M A L F U N C T I O N !'
      )
  );
  console.error(
    CYBER_CONFIG.colors.error(
      'The Wescore runner flatlined! Core meltdown imminent! 🔥'
    )
  );
  console.error(e); // Log the raw error
  process.exit(3); // Unique exit code for runner failure
});
