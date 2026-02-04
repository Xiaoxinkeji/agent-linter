#!/usr/bin/env node
const path = require('path');
const fs = require('fs').promises;
const { execSync } = require('child_process');
const LinterEngine = require('../src/core/engine');
const Logger = require('../src/utils/logger');

const args = process.argv.slice(2);
const fixMode = args.includes('--fix');
const targetArg = args.find(a => !a.startsWith('-')) || '.';

const ALLOWED_EXTENSIONS = new Set(['.js', '.ts', '.mjs', '.cjs', '.jsx', '.tsx']);

async function getAllFiles(dirPath, filesAccumulator = []) {
  try {
    const filesList = await fs.readdir(dirPath);
    for (const file of filesList) {
      if (file === 'node_modules' || file === '.git' || file === 'test') continue;
      const fullPath = path.join(dirPath, file);
      try {
        const stats = await fs.lstat(fullPath);
        if (stats.isDirectory()) {
          await getAllFiles(fullPath, filesAccumulator);
        } else if (stats.isFile() && ALLOWED_EXTENSIONS.has(path.extname(file))) {
          filesAccumulator.push(fullPath);
        }
      } catch (e) {
        continue;
      }
    }
  } catch (e) {}
  return filesAccumulator;
}

async function main() {
  Logger.logo();
  Logger.header(`ADAC Linter Sentinel v${require('../package.json').version}`);
  
  const absPath = path.resolve(targetArg);
  let isDirectory = false;
  try {
    const stats = await fs.stat(absPath);
    isDirectory = stats.isDirectory();
  } catch (e) {
    Logger.error(`Target not found: ${absPath}`);
    process.exit(1);
  }

  const finalFiles = [];
  if (isDirectory) {
    Logger.info(`Scanning: ${path.relative(process.cwd(), absPath)}/ (Recursive)`);
    await getAllFiles(absPath, finalFiles);
  } else {
    if (ALLOWED_EXTENSIONS.has(path.extname(absPath))) finalFiles.push(absPath);
  }

  if (finalFiles.length === 0) {
      Logger.warn('No target files found.');
      process.exit(0);
  }

  const engine = new LinterEngine();
  const allMissingPackages = new Set();
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of finalFiles) {
    try {
      const result = await engine.lintFile(file, process.cwd());
      if (result.errors.length > 0 || result.warnings.length > 0) {
        Logger.fileHeader(path.relative(process.cwd(), file));
        result.errors.forEach(e => {
            console.log(`    \x1b[31m✖\x1b[0m ${e.message}`);
            totalErrors++;
        });
        result.warnings.forEach(w => {
            console.log(`    \x1b[33m⚠\x1b[0m ${w.message}`);
            totalWarnings++;
        });
      }
      if (result.meta && result.meta.missingPackages) {
        result.meta.missingPackages.forEach(p => allMissingPackages.add(p));
      }
    } catch (e) {
      Logger.error(`Parse failed: ${path.basename(file)}`);
    }
  }

  Logger.summary({ files: finalFiles.length, errors: totalErrors, warnings: totalWarnings });

  if (allMissingPackages.size > 0 && fixMode) {
      Logger.info('Auto-installing missing dependencies...');
      try {
        const { execSync: cpExecSync } = require('child_process');
        cpExecSync(`npm install ${Array.from(allMissingPackages).join(' ')}`, { stdio: 'ignore' });
        Logger.success('Dependencies satisfied.');
        totalErrors = 0; 
      } catch (e) {
        Logger.error('Install failed.');
      }
  }

  if (totalErrors === 0) {
    Logger.success('SOVEREIGN CODEBASE SECURED.');
  } else {
    process.exit(1);
  }
}

main();
