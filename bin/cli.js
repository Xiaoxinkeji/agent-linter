#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const LinterEngine = require('../src/core/engine');
const Logger = require('../src/utils/logger');

const args = process.argv.slice(2);
const fixMode = args.includes('--fix');
const targetArg = args.find(a => !a.startsWith('-')) || '.';

async function main() {
  Logger.header(`Agent Linter v${require('../package.json').version}`);
  
  const absPath = path.resolve(targetArg);
  const isDir = fs.statSync(absPath).isDirectory();
  const files = isDir 
    ? fs.readdirSync(absPath).filter(f => f.endsWith('.js')).map(f => path.join(absPath, f))
    : [absPath];

  const engine = new LinterEngine();
  const allMissingPackages = new Set();
  let hasErrors = false;

  for (const file of files) {
    Logger.info(`Scanning ${path.basename(file)}...`);
    
    try {
      const result = await engine.lintFile(file, process.cwd());
      
      // Collect missing packages for auto-fix
      if (result.meta.missingPackages) {
        result.meta.missingPackages.forEach(p => allMissingPackages.add(p));
      }

      if (result.errors.length > 0) {
        hasErrors = true;
        result.errors.forEach(e => Logger.error(e.message));
      }
      
      if (result.warnings.length > 0) {
        result.warnings.forEach(w => Logger.warn(w.message));
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
      Logger.info(`Installing: ${pkgList}`);
      try {
        execSync(`npm install ${pkgList}`, { stdio: 'inherit' });
        Logger.success('Packages installed!');
      } catch (e) {
        Logger.error('Install failed.');
      }
    } else {
      Logger.warn(`Found ${allMissingPackages.size} missing packages. Run with --fix to install.`);
    }
  }

  if (!hasErrors) {
    Logger.success('All checks passed.');
  } else {
    process.exit(1);
  }
}

main();