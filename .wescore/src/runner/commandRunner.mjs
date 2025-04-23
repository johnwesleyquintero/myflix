import chalk from 'chalk';
import { spawn } from 'child_process';

// Define log levels locally for comparison if needed, or rely on passed level number
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
};

// --- MODIFIED: Added effectiveLogLevel parameter ---
export function runCommand(check, defaultTimeout, effectiveLogLevel) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const timeoutMs = check.timeout ?? defaultTimeout;
    // --- MODIFIED: Separate stdout and stderr ---
    let stdoutData = '';
    let stderrData = '';
    // --- END MODIFIED ---
    let timedOut = false;

    const shell = process.platform === 'win32' ? 'cmd' : '/bin/sh';
    const args =
      process.platform === 'win32'
        ? ['/c', check.command]
        : ['-c', check.command];

    const child = spawn(shell, args, {
      stdio: ['ignore', 'pipe', 'pipe'], // stdin, stdout, stderr
      encoding: 'utf8',
      windowsHide: true,
    });

    // --- MODIFIED: Capture streams separately ---
    child.stdout.on('data', (data) => (stdoutData += data));
    child.stderr.on('data', (data) => (stderrData += data));
    // --- END MODIFIED ---

    const timer = setTimeout(() => {
      timedOut = true;
      // --- MODIFIED: Check log level for timeout warning (treat as warn) ---
      if (effectiveLogLevel >= LOG_LEVELS.warn) {
        console.warn(
          chalk.yellow(`⏳ ${check.name} timeout after ${timeoutMs / 1000}s`),
        );
      }
      // --- END MODIFIED ---
      child.kill('SIGTERM');
      // Force kill after a grace period if SIGTERM didn't work
      setTimeout(() => !child.killed && child.kill('SIGKILL'), 2000);
    }, timeoutMs);

    let spawnError = null;
    child.on('error', (err) => {
      spawnError = err;
      // Always add spawn errors to stderr
      stderrData += `\nSpawn Error: ${err.message}`;
      clearTimeout(timer);
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const success = code === 0 && !spawnError;

      // --- MODIFIED: Removed direct logging of output ---
      // console.log(chalk.blue(`✅ ${check.name} finished with code ${code}`)); // Reporter handles success/fail messages
      // console.log(chalk.gray(output.trim())); // Reporter will handle logging output based on level
      // --- END MODIFIED ---

      resolve({
        success: success,
        // --- MODIFIED: Return separated streams ---
        stdout: stdoutData.trim(),
        stderr: stderrData.trim(),
        // Keep combined output for potential use by errorCategorizer
        output: (stdoutData + stderrData).trim(),
        // --- END MODIFIED ---
        exitCode: code,
        signal,
        timedOut: timedOut || ['SIGTERM', 'SIGKILL'].includes(signal),
        duration: Date.now() - startTime,
      });
    });
  });
}
