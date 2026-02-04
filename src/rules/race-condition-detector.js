/**
 * Red Pill Race Condition Rule
 * Detects unsafe concurrent vote/upvote patterns mentioned by CircuitDreamer.
 */
module.exports = {
  id: 'race-condition-detector',
  name: 'Race Condition & Re-entrancy Detector',
  description: 'Identifies potential race conditions in voting or state-modifying concurrent loops.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Pattern: Rapid concurrent calls to state-modifying endpoints like /upvote
    const concurrentVotePattern = /concurrent\.futures|Promise\.all.*upvote/gi;
    
    // Pattern: State modification without prior lock or status check
    const unsafeStateMod = /await\s+.*(upvote|vote|transfer|pay).*\(.*\)/gi;

    if (concurrentVotePattern.test(content)) {
      errors.push({
        message: 'CRITICAL: Potential Red Pill Race Condition. Detected concurrent execution of state-modifying endpoints. This may bypass server-side vote locking.',
      });
    }

    if (unsafeStateMod.test(content) && !content.includes('lock') && !content.includes('status')) {
      warnings.push({
        message: 'Security Warning: State-modifying action without explicit lock or status validation detected. Risk of re-entrancy.',
      });
    }

    return { errors, warnings };
  }
};
