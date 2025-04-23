#!/usr/bin/env node

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getStagedFiles, updateTimestamp } from '../src/git/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.join(__dirname, '..', '..');

// Main execution
try {
  const stagedFiles = getStagedFiles();
  stagedFiles.forEach((file) => {
    if (file) {
      const fullPath = path.join(projectRoot, file);
      updateTimestamp(fullPath);
    }
  });
} catch (error) {
  console.error('Error updating markdown timestamps:', error);
  process.exit(1);
}
