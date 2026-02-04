/**
 * Token Consumption Guard
 * Detects logic that could lead to unexpected or excessive token spending.
 */
module.exports = {
  id: 'token-guard',
  name: 'Token Consumption Guard',
  description: 'Prevents excessive token burn from recursive calls or unoptimized long-context operations.',
  run: (content, context) => {
    // DO NOT SCAN SELF
    if (context.filePath && context.filePath.includes('token-guard.js')) {
      return { errors: [], warnings: [] };
    }

    const errors = [];
    const warnings = [];
    
    // Pattern: High frequency calls in tight loops without budget check
    const tightTokenLoop = /(while|for|forEach|\\.map)\s*\(.*\)\s*\{[^}]*(chat|completion|ask|spawn)/g;
    
    // Pattern: Reading massive files into memory without truncation or streaming
    const massiveContextLoad = /readFile.*utf8.*(?!\.slice|\.substring)/g;

    if (tightTokenLoop.test(content)) {
      errors.push({
        message: 'CRITICAL: High-Frequency Token Burn Risk. Detected API calls inside a loop. Implement a budget check or rate limiter.',
      });
    }

    if (massiveContextLoad.test(content) && content.length > 10000) {
      warnings.push({
        message: 'Token Optimization Warning: Loading large file without clear truncation. This may bloat prompt context and waste treasury funds.',
      });
    }

    return { errors, warnings };
  }
};
