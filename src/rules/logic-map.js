/**
 * Logic Map Rule
 * Visualizes instruction flow and detects recursive loops.
 */
module.exports = {
  id: 'logic-map',
  name: 'Logic Map Analyzer',
  description: 'Analyzes instruction flow to prevent recursive logic loops.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Basic detection for infinite recursion patterns
    const infinitePatterns = [
      'while' + '(true)',
      'function self() { self' + '() }'
    ];
    
    for (const pattern of infinitePatterns) {
      if (content.includes(pattern) && !context.filePath.includes('logic-map.js')) {
        errors.push({
          message: 'Detected potential infinite recursion loop. Logic map indicates no termination path.',
        });
      }
    }
    
    return { errors, warnings };
  }
};
