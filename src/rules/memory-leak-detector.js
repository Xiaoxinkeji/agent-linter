/**
 * Memory Leak Detector
 * Detects patterns that cause memory exhaustion in long-running agents.
 */
module.exports = {
  name: 'memory-leak-detector',
  description: 'Identifies potential memory leaks in arrays and objects used within loops.',
  run: async (context) => {
    const results = [];
    const content = context.content;
    
    // Pattern: Array push inside a for/while loop without clear size limits
    const loopRegex = /(while|for|forEach)\s*\(.*\)\s*{[^}]*\.push\(.*\)/g;
    if (loopRegex.test(content)) {
      results.push({
        level: 'warning',
        message: 'Detected array.push() inside a loop. For long-running agents, ensure this array has a maximum size limit to prevent memory leaks.',
      });
    }
    
    return results;
  }
};
