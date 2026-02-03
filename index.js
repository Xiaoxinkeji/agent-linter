#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// CLI Arguments
const args = process.argv.slice(2);
const targetFile = args.find(a => !a.startsWith('-'));
const fixMode = args.includes('--fix');

if (!targetFile) {
  console.log(`
🚀 Agent Linter v1.1.0
Usage: agent-linter <file.js> [options]

Options:
  --fix      Automatically try to install missing packages
`);
  process.exit(1);
}

const absPath = path.resolve(targetFile);
if (!fs.existsSync(absPath)) {
  console.error(`❌ File not found: ${targetFile}`);
  process.exit(1);
}

const projectRoot = path.dirname(absPath);
console.log(`🔍 Linting ${path.basename(absPath)}...`);

const content = fs.readFileSync(absPath, 'utf8');
const errors = [];
const warnings = [];
const missingPackages = new Set();

// --- 1. Import/Require Analysis ---
const requireMatches = content.matchAll(/require\(['"](.+?)['"]\)/g);
for (const match of requireMatches) {
  const pkg = match[1];
  if (pkg.startsWith('.') || pkg.startsWith('/')) {
    try {
      require.resolve(path.resolve(projectRoot, pkg));
    } catch (e) {
      errors.push(`Missing local module: ${pkg}`);
    }
  } else {
    try {
      require.resolve(pkg);
    } catch (e) {
      const isBuiltin = ['fs', 'path', 'http', 'https', 'child_process', 'os', 'util', 'crypto', 'events'].includes(pkg);
      if (!isBuiltin) {
        errors.push(`Missing package: ${pkg}`);
        missingPackages.add(pkg);
      }
    }
  }
}

// --- 2. Path Validity Check ---
const fsMatches = content.matchAll(/fs\.(?:readFile|writeFile|readFileSync|writeFileSync)\(['"](.+?)['"]/g);
for (const match of fsMatches) {
  const filePath = match[1];
  if (match[0].includes('read') && !filePath.includes('${')) {
    const fullPath = path.resolve(projectRoot, filePath);
    if (!fs.existsSync(fullPath)) {
      warnings.push(`Potential read of missing file: ${filePath}`);
    }
  }
}

// --- 3. Env Var Usage Check ---
const envMatches = content.matchAll(/process\.env\.([A-Z_0-9]+)/g);
const usedEnvVars = new Set();
for (const match of envMatches) {
  usedEnvVars.add(match[1]);
}
if (usedEnvVars.size > 0) {
  const envPath = path.join(projectRoot, '.env');
  if (!fs.existsSync(envPath)) {
    warnings.push(`Code uses process.env but no .env file found in directory.`);
  } else {
    // Optional: Check if vars exist in .env (simple check)
    const envContent = fs.readFileSync(envPath, 'utf8');
    usedEnvVars.forEach(v => {
      if (!envContent.includes(v + '=')) {
        warnings.push(`Environment variable used but possibly not defined in .env: ${v}`);
      }
    });
  }
}

// --- 4. Secret Leak Detection ---
const secretPatterns = [
  { name: 'GitHub Token', regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: 'OpenAI Key', regex: /sk-[a-zA-Z0-9]{48}/ },
  { name: 'Private Key', regex: /-----BEGIN PRIVATE KEY-----/ },
  { name: 'Generic API Key', regex: /api_key\s*=\s*['"][a-zA-Z0-9]{20,}['"]/i }
];

secretPatterns.forEach(p => {
  if (p.regex.test(content)) {
    errors.push(`SECURITY ALERT: Hardcoded ${p.name} detected!`);
  }
});

// --- Report & Fix ---
if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ LGTM! No issues found.");
} else {
  if (errors.length > 0) {
    console.log("\n❌ ERRORS:");
    errors.forEach(e => console.log(`  - ${e}`));
  }
  if (warnings.length > 0) {
    console.log("\n⚠️ WARNINGS:");
    warnings.forEach(w => console.log(`  - ${w}`));
  }

  // Auto-Fix Logic
  if (fixMode && missingPackages.size > 0) {
    console.log(`\n🔧 Auto-Fixing: Installing ${missingPackages.size} packages...`);
    const pkgList = Array.from(missingPackages).join(' ');
    try {
      execSync(`npm install ${pkgList}`, { stdio: 'inherit', cwd: projectRoot });
      console.log("✅ Packages installed successfully.");
    } catch (e) {
      console.error("❌ Failed to install packages.");
    }
  } else if (missingPackages.size > 0) {
    console.log(`\n💡 Tip: Run with --fix to verify installation.`);
  }
}
