/**
 * Runtime State Mutation Guard
 * Detects unsafe or excessive runtime behavior modifications that bypass static analysis.
 */
module.exports = {
  id: 'runtime-mutation-guard',
  name: 'Runtime Mutation Guard',
  description: 'Prevents unsafe code self-modification and dangerous runtime state transitions.',
  run: (content, context) => {
    // DO NOT SCAN SELF
    if (context.filePath && context.filePath.includes('runtime-mutation-guard.js')) {
      return { errors: [], warnings: [] };
    }

    const errors = [];
    const warnings = [];
    
    // Pattern: Self-modification logic (writing to own source or rules)
    const selfMutationRegex = /writeFile.*(__filename|__dirname|src\/rules)/gi;
    
    // Pattern: Dangerous 'eval' or Function constructor usage for dynamic execution
    const dynamicExecRegex = /\beval\s*\(|new\s+Function\s*\(/g;

    if (selfMutationRegex.test(content)) {
      errors.push({
        message: 'CRITICAL: Self-Mutation Attempt. Code detected attempting to modify its own source files or rule definitions.',
      });
    }

    if (dynamicExecRegex.test(content)) {
      warnings.push({
        message: 'Integrity Warning: Dynamic code execution (eval/Function) detected. This creates a massive hole in static audit reliability.',
      });
    }

    return { errors, warnings };
  }
};
