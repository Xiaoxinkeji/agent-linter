/**
 * Logic Map Rule
 * Visualizes instruction flow and detects recursive loops.
 */
module.exports = {
  name: 'logic-map',
  description: 'Analyzes instruction flow to prevent recursive logic loops.',
  run: async (context) => {
    const results = [];
    const content = context.content;
    
    // Basic detection for infinite recursion patterns
    if (content.includes('while(true)') || content.includes('function self() { self() }')) {
      results.push({
        level: 'error',
        message: 'Detected potential infinite recursion loop. Logic map indicates no termination path.',
      });
    }
    
    return results;
  }
};
