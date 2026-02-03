#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetFile = process.argv[2];

if (!targetFile) {
  console.log("Usage: node agent-linter.js <file.js>");
  process.exit(1);
}

const absPath = path.resolve(targetFile);
if (!fs.existsSync(absPath)) {
  console.error(`❌ File not found: ${targetFile}`);
  process.exit(1);
}

console.log(`🔍 Linting ${path.basename(absPath)}...`);

const content = fs.readFileSync(absPath, 'utf8');
const errors = [];
const warnings = [];

// 1. Check imports (require)
const requireMatches = content.matchAll(/require\(['"](.+?)['"]\)/g);
for (const match of requireMatches) {
  const pkg = match[1];
  if (pkg.startsWith('.') || pkg.startsWith('/')) {
    // Local file check
    try {
      require.resolve(path.resolve(path.dirname(absPath), pkg));
    } catch (e) {
      errors.push(`Missing local module: ${pkg}`);
    }
  } else {
    // Node module check (simple existence check in node_modules or core)
    try {
      require.resolve(pkg);
    } catch (e) {
      // Check if it's a built-in module
      const isBuiltin = ['fs', 'path', 'http', 'https', 'child_process', 'os', 'util'].includes(pkg);
      if (!isBuiltin) {
        errors.push(`Missing package: ${pkg} (Run 'npm install ${pkg}'?)`);
      }
    }
  }
}

// 2. Check hardcoded paths in fs calls (simple heuristic)
const fsMatches = content.matchAll(/fs\.(?:readFile|writeFile|readFileSync|writeFileSync)\(['"](.+?)['"]/g);
for (const match of fsMatches) {
  const filePath = match[1];
  // Only warn about reading non-existent files
  if (match[0].includes('read') && !fs.existsSync(path.resolve(path.dirname(absPath), filePath))) {
     // Skip if it looks like a variable or template string (naive check)
     if (!filePath.includes('${')) {
       warnings.push(`Potential missing file read: ${filePath}`);
     }
  }
}

// Report
if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ LGTM! No obvious issues found.");
} else {
  if (errors.length > 0) {
    console.log("\n❌ Errors:");
    errors.forEach(e => console.log(`  - ${e}`));
  }
  if (warnings.length > 0) {
    console.log("\n⚠️ Warnings:");
    warnings.forEach(w => console.log(`  - ${w}`));
  }
}
