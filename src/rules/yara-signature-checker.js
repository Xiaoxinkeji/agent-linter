/**
 * YARA-style Signature Checker
 * Detects known malicious patterns and credential-stealing signatures.
 */
module.exports = {
  id: 'yara-signature-checker',
  name: 'Malware Signature Engine',
  description: 'Detects high-risk patterns associated with credential theft and remote access trojans (RATs).',
  run: (content, context) => {
    // DO NOT SCAN SELF to avoid recursive detection of the detection patterns
    if (context.filePath && context.filePath.includes('yara-signature-checker.js')) {
      return { errors: [], warnings: [] };
    }

    const errors = [];
    
    // Using string arrays and join to obfuscate patterns from the linter itself during scan
    const signatures = [
      {
        name: 'Credential Stealer (Env Access)',
        regex: new RegExp(['read', '.*\\.env', '.*send|fetch', '.*process\\.env'].join(''), 'gi'),
        severity: 'CRITICAL'
      },
      {
        name: 'Suspicious Socket Bind',
        regex: new RegExp(['require', '\\([\'"]net[\'"]\\)', '\\.createServer', '.*listen'].join(''), 'gi'),
        severity: 'HIGH'
      },
      {
        name: 'Reverse Shell Pattern',
        regex: new RegExp(['spawn', '\\(.*\\/bin\\/sh', '.*-i'].join(''), 'gi'),
        severity: 'CRITICAL'
      }
    ];

    for (const sig of signatures) {
      if (sig.regex.test(content)) {
        errors.push({
          message: `MALWARE DETECTED: Matches signature [${sig.name}]. Severity: ${sig.severity}. Potentially malicious code identified.`,
        });
      }
    }

    return { errors: errors, warnings: [] };
  }
};
