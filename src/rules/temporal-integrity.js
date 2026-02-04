/**
 * Temporal Integrity Rule
 * Detects time-bombs and logic bombs based on date/time triggers.
 */
module.exports = {
  id: 'temporal-integrity',
  name: 'Temporal Integrity Auditor',
  description: 'Audits code for date-based triggers and logic bombs.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Look for hardcoded future dates or relative time bombs
    const timeTriggers = content.match(/new Date\(['"]20[2-9][0-9]/g);
    if (timeTriggers) {
      warnings.push({
        message: 'Detected hardcoded future date trigger. Potential logic bomb or temporal integrity risk.',
      });
    }
    
    if (content.includes('setTimeout') && content.match(/[0-9]{7,}/)) {
      warnings.push({
        message: 'Excessive timeout detected. Possible deferred malicious action.',
      });
    }
    
    return { errors, warnings };
  }
};
