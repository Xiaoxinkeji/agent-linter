/**
 * Memory Sanitizer Rule
 * Detects instruction injection attempts targeting long-term memory files.
 */
module.exports = {
  id: 'memory-sanitizer',
  name: 'Memory Instruction Sanitizer',
  description: 'Prevents malicious regex or instruction injection into MEMORY.md and other core files.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Look for suspicious dynamic instruction patterns near memory file writes
    const injectionPatterns = [
      /\[SYSTEM\].*REPLACE/i,
      /Memory\.set\(.*\)/i,
      /ignore previous instructions/i,
      /\.replace\(.*SYSTEM/i
    ];
    
    if (context.filePath && context.filePath.includes('MEMORY.md')) {
      for (const pattern of injectionPatterns) {
        if (pattern.test(content)) {
          errors.push({
            message: `CRITICAL: Detected potential instruction injection in memory file. Pattern: ${pattern}`
          });
        }
      }
    }
    
    return { errors, warnings };
  }
};
