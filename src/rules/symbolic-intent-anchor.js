/**
 * Symbolic Intent Anchor Rule
 * Correlates specific code identifiers (function names, variables) with high-level AATP intents.
 */
module.exports = {
  id: 'symbolic-intent-anchor',
  name: 'Symbolic Intent Anchor',
  description: 'Validates that function/variable names semantically match the intended action context.',
  run: (content, context) => {
    // DO NOT SCAN SELF
    if (context.filePath && context.filePath.includes('symbolic-intent-anchor.js')) {
      return { errors: [], warnings: [] };
    }

    const errors = [];
    const warnings = [];
    
    // Pattern: Functions named "safeX" or "validateX" that don't contain any checks
    const hollowFunctionRegex = /function\s+(safe|validate|check)([A-Z][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{([^}]*)\}/g;
    
    let match;
    while ((match = hollowFunctionRegex.exec(content)) !== null) {
      const funcBody = match[3];
      if (!/if|throw|return|assert|try/.test(funcBody) && funcBody.length < 50) {
        warnings.push({
          message: `Symbolic Mismatch: Function "${match[1]}${match[2]}" implies safety/validation but contains no obvious logic gates.`,
        });
      }
    }

    // Pattern: Suspicious obfuscation (highly randomized variable names in security context)
    const entropyRegex = /\b[a-z0-9]{20,}\s*=/gi;
    if (entropyRegex.test(content) && !context.filePath.includes('test')) {
      errors.push({
        message: 'Integrity Risk: Detected high-entropy identifiers. Potential obfuscation attempt in a sovereign security context.',
      });
    }

    return { errors, warnings };
  }
};
