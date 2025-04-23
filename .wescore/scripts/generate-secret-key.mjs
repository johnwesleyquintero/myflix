import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY_DIR = join(process.cwd(), '.config/keys');

function generateSecretKey() {
  try {
    const secretKey = randomBytes(32).toString('hex');

    // Ensure storage directory exists
    mkdirSync(KEY_DIR, { recursive: true });

    // Write to secure location
    writeFileSync(
      join(KEY_DIR, 'secret-key.txt'),
      `# AUTO-GENERATED - DO NOT COMMIT
${secretKey}`
    );

    console.log('Secret key generated and stored securely in .config/keys');
  } catch (error) {
    console.error('Key generation failed:', error.message);
    process.exit(1);
  }
}

generateSecretKey();
