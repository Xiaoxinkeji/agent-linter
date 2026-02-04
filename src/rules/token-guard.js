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
    if (context.filePath && (context.filePath.includes('token-guard.js') || context.filePath.includes('spawn-control.js'))) {
      return { errors: [], warnings: [] };
    }

    const errors = [];
    const warnings = [];
    
    // Pattern: High frequency calls in tight loops without budget check
    // We target chat/completion/ask patterns specifically inside loops
    const callA = 'chat|completion|ask|spawn';
    const loopA = 'while|for|forEach|\\.map';
    const tightTokenLoop = new RegExp('(?:' + loopA + ')\\s*\\(.*\\)\\s*\\{[^}]*(?:' + callA + ')', 'g');
    
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
