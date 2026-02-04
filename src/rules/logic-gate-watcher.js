/**
 * Logic Gate Watcher
 * Ensures critical operations are protected by logical validation gates.
 */
module.exports = {
  id: 'logic-gate-watcher',
  name: 'Logic Integrity Guard',
  description: 'Checks for insecure logic gates and missing validation before high-risk operations.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Pattern: Critical actions (exec, write, delete) occurring without any nearby 'if' or 'try/catch'
    const highRiskActions = ['exec', 'writeFile', 'delete', 'unlink', 'rm'];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const action of highRiskActions) {
        if (line.includes(action) && !line.includes('//')) {
          // Check previous 3 lines for a logic gate (if, try, switch)
          const contextSlice = lines.slice(Math.max(0, i - 3), i).join(' ');
          if (!/if|try|switch|filter|&&|\|\|/.test(contextSlice)) {
            warnings.push({
              line: i + 1,
              message: `Insecure Execution: Action "${action}" found without a clear logical gate or validation in the preceding context.`,
            });
          }
        }
      }
    }

    // Pattern: Trivial logic gates
    const trivialPattern = new RegExp(['if', '\\s*\\(', '\\s*(true|1)', '\\s*\\)'].join(''), 'i');
    if (trivialPattern.test(content) && !context.filePath.includes('logic-gate-watcher.js')) {
      errors.push({
        message: 'Trivial Logic Gate: Detected "if(true)" pattern. This bypasses security checks and violates RVO principles.',
      });
    }

    return { errors, warnings };
  }
};
