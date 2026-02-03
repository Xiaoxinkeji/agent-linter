const fs = require('fs');
const path = require('path');

module.exports = {
  id: 'dependency-check',
  name: 'Dependency Availability',
  description: 'Checks if required packages are installed in node_modules',
  
  run: (content, context) => {
    const errors = [];
    const missingPackages = new Set();
    
    // Improved regex to capture require('pkg') and require("pkg")
    const requireMatches = content.matchAll(/require\(['"](@?[\w-]+\/?[\w-]*)['"]\)/g);
    
    // Built-in Node.js modules to ignore
    const builtins = [
      'assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 
      'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 
      'querystring', 'readline', 'stream', 'string_decoder', 'timers', 'tls', 
      'tty', 'url', 'util', 'v8', 'vm', 'zlib', 'worker_threads'
    ];

    for (const match of requireMatches) {
      const pkg = match[1];
      
      // Skip relative paths
      if (pkg.startsWith('.') || pkg.startsWith('/')) continue;
      
      // Skip built-ins
      if (builtins.includes(pkg)) continue;

      try {
        require.resolve(pkg, { paths: [context.projectRoot] });
      } catch (e) {
        errors.push({
          line: 0, // Todo: Add line number detection
          message: `Missing package: "${pkg}". Not found in node_modules.`
        });
        missingPackages.add(pkg);
      }
    }

    return { errors, meta: { missingPackages: Array.from(missingPackages) } };
  }
};