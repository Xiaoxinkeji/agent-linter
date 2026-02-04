/**
 * Temporal Integrity Rule
 * Detects time-bombs and logic bombs based on date/time triggers.
 */
module.exports = {
  name: 'temporal-integrity',
  description: 'Audits code for date-based triggers and logic bombs.',
  run: async (context) => {
    const results = [];
    const content = context.content;
    
    // Look for hardcoded future dates or relative time bombs
    const timeTriggers = content.match(/new Date\(['"]20[2-9][0-9]/g);
    if (timeTriggers) {
      results.push({
        level: 'warning',
        message: 'Detected hardcoded future date trigger. Potential logic bomb or temporal integrity risk.',
      });
    }
    
    if (content.includes('setTimeout') && content.match(/[0-9]{7,}/)) {
      results.push({
        level: 'warning',
        message: 'Excessive timeout detected. Possible deferred malicious action.',
      });
    }
    
    return results;
  }
};
