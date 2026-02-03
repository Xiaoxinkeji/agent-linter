const fs = require('fs');
const path = require('path');

module.exports = {
  id: 'dependency-check',
  name: 'Dependency Availability',
  description: 'Checks if required/imported packages are installed',
  
  run: (content, context) => {
    const errors = [];
    const missingPackages = new Set();
    const packagesFound = new Set();
    
    // 1. CommonJS: require('pkg')
    const requireMatches = content.matchAll(/require\(['"](@?[\w-]+\/?[\w-]*)['"]\)/g);
    for (const match of requireMatches) packagesFound.add(match[1]);

    // 2. ESM: import ... from 'pkg'
    const importMatches = content.matchAll(/from\s+['"](@?[\w-]+\/?[\w-]*)['"]/g);
    for (const match of importMatches) packagesFound.add(match[1]);

    // 3. Dynamic Import: import('pkg')
    const dynImportMatches = content.matchAll(/import\(['"](@?[\w-]+\/?[\w-]*)['"]\)/g);
    for (const match of dynImportMatches) packagesFound.add(match[1]);
    
    // Built-in Node.js modules to ignore
    const builtins = [
      'assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 
      'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 
      'querystring', 'readline', 'stream', 'string_decoder', 'timers', 'tls', 
      'tty', 'url', 'util', 'v8', 'vm', 'zlib', 'worker_threads', 'inspector', 'console'
    ];

    for (const pkg of packagesFound) {
      // Skip relative paths
      if (pkg.startsWith('.') || pkg.startsWith('/')) continue;
      
      // Skip built-ins
      if (builtins.includes(pkg)) continue;

      try {
        require.resolve(pkg, { paths: [context.projectRoot] });
      } catch (e) {
        errors.push({
          message: `Missing package: "${pkg}". Found in code but not installed.`
        });
        missingPackages.add(pkg);
      }
    }

    return { errors, meta: { missingPackages: Array.from(missingPackages) } };
  }
};