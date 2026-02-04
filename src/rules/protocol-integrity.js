/**
 * Protocol Integrity & Forbidden Protocol Detector
 * Detects usage of insecure or forbidden communication protocols (e.g., telnet, unencrypted ftp).
 */
module.exports = {
  id: 'protocol-integrity',
  name: 'Protocol Security Guard',
  description: 'Enforces usage of secure communication protocols and blocks insecure legacy protocols.',
  run: (content, context) => {
    // DO NOT SCAN SELF
    if (context.filePath && context.filePath.includes('protocol-integrity.js')) {
      return { errors: [], warnings: [] };
    }

    const errors = [];
    const warnings = [];
    
    // Pattern: Forbidden insecure protocols
    const insecureProtocols = [
      { name: 'Telnet', regex: /telnet:\/\//gi },
      { name: 'Unencrypted FTP', regex: /ftp:\/\/(?!.*@)/gi }, // Basic check for ftp://
      { name: 'Insecure Gopher', regex: /gopher:\/\//gi }
    ];

    // Pattern: Forced downgraded HTTP (instead of HTTPS)
    const httpDowngradeRegex = new RegExp(['http', '://'].join(''), 'gi');
    const httpsPattern = new RegExp(['http', 's', '://'].join(''), 'gi');

    for (const proto of insecureProtocols) {
      if (proto.regex.test(content)) {
        errors.push({
          message: `PROTOCOL ERROR: Forbidden insecure protocol [${proto.name}] detected. Use SSH or encrypted alternatives.`,
        });
      }
    }

    // Check for HTTP usage where HTTPS is preferred
    const httpMatches = content.match(httpDowngradeRegex) || [];
    const httpsMatches = content.match(httpsPattern) || [];
    
    if (httpMatches.length > httpsMatches.length && !content.includes('localhost')) {
      warnings.push({
        message: 'Security Warning: High ratio of unencrypted HTTP usage detected. Migrate to HTTPS to prevent MITM attacks.',
      });
    }

    return { errors, warnings };
  }
};
