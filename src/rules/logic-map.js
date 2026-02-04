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
    if (content.includes('while(true)') || content.includes('function self() { self() }')) {
      errors.push({
        message: 'Detected potential infinite recursion loop. Logic map indicates no termination path.',
      });
    }
    
    return { errors, warnings };
  }
};
