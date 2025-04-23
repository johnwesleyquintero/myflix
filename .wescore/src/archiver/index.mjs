import archiver from 'archiver'; // Use archiver for zipping
import fs from 'fs';
import path from 'path';

/**
 * Creates a zip archive from the contents of a source directory.
 * @param {string} sourceDir - The directory whose contents should be zipped.
 * @param {string} outputZipPath - The full path for the output zip file.
 * @returns {Promise<void>} A promise that resolves when zipping is complete or rejects on error.
 */
export function createZipFromDirectory(sourceDir, outputZipPath) {
  return new Promise((resolve, reject) => {
    console.log('INFO', `Creating ZIP file: ${path.basename(outputZipPath)}`);

    // Ensure the output directory for the zip file exists
    const zipOutputDir = path.dirname(outputZipPath);
    try {
      if (!fs.existsSync(zipOutputDir)) {
        fs.mkdirSync(zipOutputDir, { recursive: true });
        console.log(
          'INFO',
          `Created releases directory: ${path.basename(zipOutputDir)}`
        );
      }
    } catch (err) {
      console.log('ERROR', `Error creating releases directory: ${err.message}`);
      return reject(err); // Reject the promise
    }

    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } }); // Max compression

    output.on('close', () => {
      console.log(
        'SUCCESS',
        `Successfully created ZIP: ${path.basename(outputZipPath)} (${(
          archive.pointer() /
          1024 /
          1024
        ).toFixed(2)} MB)`
      );
      resolve(); // Resolve the promise on successful close
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.log('WARN', `Archiver warning: ${err.message}`); // File not found etc.
      } else {
        console.log('ERROR', `Archiver warning: ${err.message}`);
        reject(err); // Reject on critical warnings
      }
    });

    archive.on('error', (err) => {
      console.log('ERROR', `Archiver error: ${err.message}`);
      reject(err); // Reject the promise on error
    });

    archive.pipe(output);

    // Add the *contents* of sourceDir to the root of the zip
    // The second argument `false` prevents creating a top-level folder in the zip
    archive.directory(sourceDir, false);

    // Finalize the archive (writes the central directory)
    archive.finalize();
  });
}

export default createZipFromDirectory;
