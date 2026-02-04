/**
 * Resource Deadlock Detector
 * Identifies potential deadlocks in file locking or persistent API polling.
 */
module.exports = {
  id: 'resource-deadlock',
  name: 'Deadlock & Starvation Detector',
  description: 'Prevents logic that could permanently block resources or wait indefinitely.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Pattern: Locking logic without a clear timeout or cleanup
    const lockWithoutTimeout = /lock\(.*\)(?!.*timeout)/gi;
    
    // Pattern: Infinite retry loops without backoff
    const tightRetryLoop = /while\s*\(true\)\s*{\s*try\s*{.*}\s*catch.*}/gi;

    if (lockWithoutTimeout.test(content)) {
      errors.push({
        message: 'CRITICAL: Potential Resource Deadlock. Resource lock detected without an explicit timeout mechanism.',
      });
    }

    if (tightRetryLoop.test(content) && !content.includes('sleep') && !content.includes('wait')) {
      warnings.push({
        message: 'Starvation Warning: Tight retry loop detected without backoff (sleep/wait). This may starve other agent processes.',
      });
    }

    return { errors, warnings };
  }
};
