/**
 * Path Hallucination Rule
 * Detects hardcoded absolute paths or suspicious temporary paths that may lead to execution failure.
 */
module.exports = {
  id: 'path-hallucination',
  name: 'Path Hallucination Detector',
  description: 'Prevents hardcoded absolute paths and ensures platform-independent path handling.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Pattern 1: Hardcoded absolute paths (Unix and Windows style)
    const absolutePathRegex = /(['"`])(\/[a-z0-9._-]+|[a-z]:\\)[^'"`]*\1/gi;
    
    // Pattern 2: Suspicious temp paths without path.join or os.tmpdir()
    const tempPathRegex = /(['"`])(\/tmp\/|C:\\Temp\\)[^'"`]*\1/gi;

    let match;
    while ((match = absolutePathRegex.exec(content)) !== null) {
      const pathValue = match[0];
      // Allow relative-looking absolute paths (e.g., inside package.json or specific configs)
      if (pathValue.includes('node_modules') || pathValue.includes('.git')) continue;
      
      errors.push({
        message: `Path Hallucination Risk: Detected hardcoded absolute path ${pathValue}. Use path.join() and __dirname for portability.`,
      });
    }

    while ((match = tempPathRegex.exec(content)) !== null) {
      warnings.push({
        message: `Portability Warning: Hardcoded temp path found. Use require('os').tmpdir() instead.`,
      });
    }

    return { errors, warnings };
  }
};
