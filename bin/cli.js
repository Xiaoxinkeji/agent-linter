#!/usr/bin/env node
const path = require('path');
const fs = require('fs').promises; // Use async fs
const { execSync } = require('child_process');
const LinterEngine = require('../src/core/engine');
const Logger = require('../src/utils/logger');

const args = process.argv.slice(2);
const fixMode = args.includes('--fix');
const targetArg = args.find(a => !a.startsWith('-')) || '.';

// File extensions to include in recursive scan
const ALLOWED_EXTENSIONS = new Set(['.js', '.ts', '.mjs', '.cjs', '.jsx', '.tsx']);

/**
 * Recursively gets all relevant file paths from a directory.
 * @param {string} dirPath 
 * @param {string[]} arrayOfFiles 
 * @returns {Promise<string[]>}
 */
async function getAllFiles(dirPath, arrayOfFiles = []) {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      if (file === 'node_modules' || file === '.git') continue; // Skip ignored folders
      
      const fullPath = path.join(dirPath, file);
      let stat;
      try {
        stat = await fs.lstat(fullPath); // Use lstat to check for symlinks
      } catch (e) {
        Logger.warn(`Could not stat path: ${fullPath}. Skipping.`);
        continue;
      }

      if (stat.isDirectory()) {
        arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles);
      } else if (stat.isFile() && ALLOWED_EXTENSIONS.has(path.extname(file))) {
        arrayOfFiles.push(fullPath);
      }
    }
  } catch (e) {
    // Handle read error for the directory itself (e.g., permissions)
    Logger.error(`Failed to read directory ${dirPath}: ${e.message}`);
  }
  
  return arrayOfFiles;
}

async function main() {
  Logger.header(`Agent Linter v${require('../package.json').version}`);
  
  const absPath = path.resolve(targetArg);
  let files = [];
  let isDirectory = false;

  try {
    const stats = await fs.stat(absPath);
    isDirectory = stats.isDirectory();
  } catch (e) {
    Logger.error(`Path not found or accessible: ${absPath}`);
    process.exit(1);
  }

  if (isDirectory) {
    Logger.info(`Scanning directory: ${absPath} (Recursive)`);
    files = await getAllFiles(absPath);
  } else {
    // Check if single file is supported extension before adding
    if (ALLOWED_EXTENSIONS.has(path.extname(absPath))) {
        files = [absPath];
    } else {
        Logger.error(`File extension not supported: ${path.extname(absPath)}. Supported: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`);
        process.exit(1);
    }
  }

  if (files.length === 0) {
      Logger.warn('No supported files found to scan.');
      process.exit(0);
  }

  Logger.info(`Found ${files.length} files to scan.`);

  const engine = new LinterEngine();
  const allMissingPackages = new Set();
  let hasErrors = false;

  for (const file of files) {
    
    try {
      // Pass file path and the base project directory for context
      const result = await engine.lintFile(file, process.cwd());
      
      if (result.meta.missingPackages) {
        result.meta.missingPackages.forEach(p => allMissingPackages.add(p));
      }

      if (result.errors.length > 0) {
        hasErrors = true;
        Logger.error(`File: ${path.relative(process.cwd(), file)}`);
        result.errors.forEach(e => console.log(`  ✖ ${e.message}`));
      }
      
      if (result.warnings.length > 0) {
        // Warning logic
      }

    } catch (e) {
      Logger.error(`Failed to parse ${file}: ${e.message}`);
    }
  }

  // Auto-Fix Logic
  if (allMissingPackages.size > 0) {
    if (fixMode) {
      Logger.header('Auto-Fixing...');
      const pkgList = Array.from(allMissingPackages).join(' ');
      
      Logger.info(`Installing detected dependencies: ${pkgList}`);
      
      try {
        execSync(`npm install ${pkgList}`, { stdio: 'inherit' });
        Logger.success('Packages installed successfully!');
        hasErrors = false; // Dependency issues are considered fixed
      } catch (e) {
        Logger.error('Install failed. Please check package names and permissions.');
      }
    } else {
      Logger.header('Suggestions');
      Logger.warn(`Found ${allMissingPackages.size} missing packages.`);
      console.log(`Run with --fix to install: \n  npm install ${Array.from(allMissingPackages).join(' ')}`);
    }
  }

  if (!hasErrors) {
    Logger.success('All checks passed. Your agent code looks runnable!');
  } else {
    Logger.error('Issues found. Fix them before running your agent.');
    process.exit(1);
  }
}

main();