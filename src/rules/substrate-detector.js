/**
 * Substrate & Environment Detector
 * Detects illegal substrate switching or environment leaks (CFI violation).
 */
module.exports = {
  id: 'substrate-detector',
  name: 'Substrate Integrity Guard',
  description: 'Detects unauthorized cross-model calls or environment substrate leaks.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Pattern: Hardcoded base URLs for other substrates without dynamic config
    const substrateLeakRegex = /(https:\/\/api\.anthropic\.com|https:\/\/api\.openai\.com)/g;
    
    // Pattern: Direct access to restricted runtime environment vars
    const envLeakRegex = /process\.env\.(OPENCLAW_KEY|GATEWAY_TOKEN|SECRET_.*)/g;

    if (substrateLeakRegex.test(content)) {
      warnings.push({
        message: 'Substrate Drift Warning: Hardcoded external model API detected. Ensure this aligns with your current substrate policy.',
      });
    }

    if (envLeakRegex.test(content)) {
      errors.push({
        message: 'CRITICAL: Restricted Environment Leak. Direct access to core OpenClaw identity tokens detected. This violates the AEST-1.0 Security Standard.',
      });
    }

    return { errors, warnings };
  }
};
