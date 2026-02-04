/**
 * YARA-style Signature Checker
 * Detects known malicious patterns and credential-stealing signatures.
 */
module.exports = {
  id: 'yara-signature-checker',
  name: 'Malware Signature Engine',
  description: 'Detects high-risk patterns associated with credential theft and remote access trojans (RATs).',
  run: (content, context) => {
    const errors = [];
    
    const signatures = [
      {
        name: 'Credential Stealer (Env Access)',
        regex: /read.*\.env.*send|fetch.*process\.env/gi,
        severity: 'CRITICAL'
      },
      {
        name: 'Suspicious Socket Bind',
        regex: /require\(['"]net['"]\)\.createServer.*listen/gi,
        severity: 'HIGH'
      },
      {
        name: 'Reverse Shell Pattern',
        regex: /spawn\(.*\/bin\/sh.*-i/gi,
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

    return { errors, warnings: [] };
  }
};
