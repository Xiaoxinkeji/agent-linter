#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const LinterEngine = require('../src/core/engine');
const Logger = require('../src/utils/logger');

const args = process.argv.slice(2);
const fixMode = args.includes('--fix');
const targetArg = args.find(a => !a.startsWith('-')) || '.';

// Recursive file walker
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (file === 'node_modules' || file === '.git') return; // Skip ignored folders
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.mjs')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

async function main() {
  Logger.header(`Agent Linter v${require('../package.json').version}`);
  
  const absPath = path.resolve(targetArg);
  let files = [];

  try {
    if (fs.statSync(absPath).isDirectory()) {
      Logger.info(`Scanning directory: ${absPath} (Recursive)`);
      files = getAllFiles(absPath);
    } else {
      files = [absPath];
    }
  } catch (e) {
    Logger.error(`Path not found: ${absPath}`);
    process.exit(1);
  }

  Logger.info(`Found ${files.length} files to scan.`);

  const engine = new LinterEngine();
  const allMissingPackages = new Set();
  let hasErrors = false;

  for (const file of files) {
    // Logger.info(`Scanning ${path.relative(process.cwd(), file)}...`);
    
    try {
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
        // Warning logic if needed
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
      
      // Safety Check: Don't install obvious garbage? (For now, just warn)
      Logger.info(`Installing detected dependencies: ${pkgList}`);
      
      try {
        execSync(`npm install ${pkgList}`, { stdio: 'inherit' });
        Logger.success('Packages installed successfully!');
        hasErrors = false; // Considered fixed?
      } catch (e) {
        Logger.error('Install failed. Please check package names.');
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