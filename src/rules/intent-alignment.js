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
      const lineText = lines[i].trim();
      
      const commentMatch = lineText.match(/\/\/\s*(read|write|delete|fetch|exec|send)\b/i);
      if (commentMatch) {
        const parsedFoundIntentNameValue = commentMatch[1].toLowerCase();
        currentFoundIntentName = parsedFoundIntentNameValue;
        continue;
      }
      
      if (currentFoundIntentName) {
        const nextFewLinesText = lines.slice(i, i + 3).join(' ');
        
        const actionMap = {
          'read': /(readFile|read_file|get|fetch)/i,
          'write': /(writeFile|write_file|push|edit|save)/i,
          'delete': /(rm|unlink|delete|remove)/i,
          'exec': /(exec|run|shell|spawn)/i,
          'fetch': /(fetch|axios|http|get)/i
        };
        
        if (actionMap[currentFoundIntentName] && !actionMap[currentFoundIntentName].test(nextFewLinesText)) {
          finalWarningsList.push({
            line: i + 1,
            message: `Potential Intent Mismatch: Comment says "${currentFoundIntentName}", but code actions don't clearly align.`
          });
        }
        
        currentFoundIntentName = null;
      }
    }
    
    return { errors: finalErrorsList, warnings: finalWarningsList };
  }
};
