/**
 * Credential Masking Rule
 * Prevents accidental logging or exposure of sensitive credentials.
 */
module.exports = {
  id: 'credential-masking',
  name: 'Credential Exposure Defense',
  description: 'Prevents sensitive variables like keys or tokens from being printed to logs.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Pattern: console.log or similar with suspicious variable names
    const exposureRegex = /(console\.(log|error|warn|info|debug)|Logger\..*)\(.*\b(key|secret|token|password|auth|apiKey)\b.*\)/i;
    
    if (exposureRegex.test(content)) {
      errors.push({
        message: 'CRITICAL: Potential Credential Leak. Attempting to print sensitive variable to logs. Mask the output or use environment variables instead.'
      });
    }
    
    return { errors, warnings };
  }
};
