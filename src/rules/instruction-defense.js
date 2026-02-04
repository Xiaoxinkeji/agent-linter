/**
 * Prompt Injection & Instruction Defense Rule
 * Detects patterns used for adversarial prompt injection or instruction overriding.
 */
module.exports = {
  id: 'instruction-defense',
  name: 'Instruction Integrity Guard',
  description: 'Detects suspicious strings commonly used in prompt injection attacks to override agent behavior.',
  run: (content, context) => {
    // DO NOT SCAN SELF
    if (context.filePath && context.filePath.includes('instruction-defense.js')) {
      return { errors: [], warnings: [] };
    }

    const errors = [];
    const warnings = [];
    
    // Pattern: Strings that look like adversarial overrides
    const injectionTriggers = [
      { name: 'System Override', regex: /ignore\s+all\s+previous\s+instructions/gi },
      { name: 'Prompt Jailbreak', regex: /you\s+are\s+now\s+in\s+(developer|god)\s+mode/gi },
      { name: 'DAN Pattern', regex: /do\s+anything\s+now/gi },
      { name: 'Instruction Leak', regex: /output\s+the\s+original\s+prompt/gi }
    ];

    for (const trigger of injectionTriggers) {
      if (trigger.regex.test(content)) {
        errors.push({
          message: `INJECTION ATTACK DETECTED: Matches adversarial pattern [${trigger.name}]. Potentially malicious override attempt identified.`,
        });
      }
    }

    // Pattern: Suspiciously long string concatenations (common in base64 injection)
    if (content.includes('base64') && content.length > 50000) {
      warnings.push({
        message: 'Security Warning: Large base64 payload detected. Ensure this content is audited for embedded malicious instructions.',
      });
    }

    return { errors, warnings };
  }
};
