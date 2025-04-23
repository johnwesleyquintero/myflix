/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import path from 'path';

/**
 * Removes a directory or file recursively and safely.
 * @param {string} targetPath - Path to the directory or file to remove
 * @param {string} targetDesc - Description for logging (e.g., "'out' directory")
 */
export function cleanTarget(targetPath, targetDesc) {
  if (fs.existsSync(targetPath)) {
    console.log('INFO', `Removing existing ${targetDesc}...`);
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log('SUCCESS', `${targetDesc} removed.`);
    } catch (error) {
      console.log(
        'ERROR',
        `Failed to remove ${targetDesc}. Check permissions or if files are in use.`
      );
      console.log('ERROR', error.message);
      process.exit(1);
    }
  } else {
    console.log('INFO', `${targetDesc} does not exist. Skipping removal.`);
  }
}

/**
 * Gets project name and version from package.json.
 * @returns {{name: string, version: string}}
 */
export function getProjectInfo() {
  try {
    const pkgPath = path.join(PROJECT_ROOT, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const name = (pkg.name || 'project').replace(/[^a-z0-9_-]/gi, '_');
    const version = pkg.version || 'local';
    return { name, version };
  } catch (error) {
    console.warn(
      'Could not read package.json for naming. Using default "project-local".'
    );
    return { name: 'project', version: 'local' };
  }
}

/**
 * Formats a date as YYYYMMDD.
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

const PROJECT_ROOT = process.cwd(); // Define PROJECT_ROOT

const utils = { cleanTarget, getProjectInfo, formatDate, PROJECT_ROOT };
export default utils;
