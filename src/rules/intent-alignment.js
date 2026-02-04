/**
 * Intent Alignment Rule
 * Checks if the code's comments match the actual actions taken.
 */
module.exports = {
  id: 'intent-alignment',
  name: 'Intent Alignment Checker',
  description: 'Verifies that code execution matches the stated intent in comments.',
  run: (content, context) => {
    const finalErrorsList = [];
    const finalWarningsList = [];
    
    const lines = content.split('\n');
    let currentFoundIntentName = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extract intent from comments
      const commentMatch = line.match(/\/\/\s*(read|write|delete|fetch|exec|send)\b/i);
      if (commentMatch) {
        const parsedFoundIntentName = commentMatch[1].toLowerCase();
        currentFoundIntentName = parsedFoundIntentName;
        continue;
      }
      
      // If we have an intent, check the next few lines for matching actions
      if (currentFoundIntentName) {
        const nextFewLines = lines.slice(i, i + 3).join(' ');
        
        const actionMap = {
          'read': /(readFile|read_file|get|fetch)/i,
          'write': /(writeFile|write_file|push|edit|save)/i,
          'delete': /(rm|unlink|delete|remove)/i,
          'exec': /(exec|run|shell|spawn)/i,
          'fetch': /(fetch|axios|http|get)/i
        };
        
        if (actionMap[currentFoundIntentName] && !actionMap[currentFoundIntentName].test(nextFewLines)) {
          finalWarningsList.push({
            line: i + 1,
            message: `Potential Intent Mismatch: Comment says "${currentFoundIntentName}", but code actions don't clearly align. verify logic accuracy.`
          });
        }
        
        currentFoundIntentName = null; // Reset after check
      }
    }
    
    return { errors: finalErrorsList, warnings: finalWarningsList };
  }
};
