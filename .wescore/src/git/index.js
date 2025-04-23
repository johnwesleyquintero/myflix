import { execSync } from 'child_process';
import fs from 'fs';

// Get list of staged files
export const getStagedFiles = () => {
  const output = execSync('git diff --cached --name-only').toString();
  return output.split('\n').filter((file) => file.endsWith('.md'));
};

// Update timestamp in markdown file
export const updateTimestamp = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  // Check if file already has a timestamp section
  const timestampRegex =
    /\n---\n(?:Last Updated|\[\/\/\]: # \(Documentation last updated).*$/s;
  const newTimestamp = `\n---\nLast Updated: ${timestamp}\n`;

  const updatedContent = content.match(timestampRegex)
    ? content.replace(timestampRegex, newTimestamp)
    : content + newTimestamp;

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  execSync(`git add ${filePath}`);
};

const gitUtils = { getStagedFiles, updateTimestamp };

export default gitUtils;
