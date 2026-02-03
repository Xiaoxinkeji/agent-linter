module.exports = {
  id: 'security-scan',
  name: 'Secret Leak Detection',
  description: 'Scans for hardcoded API keys and secrets',
  
  run: (content) => {
    const errors = [];
    
    const patterns = [
      { name: 'GitHub Token', regex: /(ghp_[a-zA-Z0-9]{36})/g },
      { name: 'OpenAI Key', regex: /(sk-[a-zA-Z0-9]{48})/g },
      { name: 'Private Key', regex: /-----BEGIN PRIVATE KEY-----/g },
      { name: 'Generic API Key', regex: /api_key\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/gi },
      { name: 'AWS Access Key', regex: /(AKIA[0-9A-Z]{16})/g },
      { name: 'Slack Token', regex: /(xox[baprs]-([0-9a-zA-Z]{10,48}))/g }
    ];

    patterns.forEach(p => {
      let match;
      while ((match = p.regex.exec(content)) !== null) {
        errors.push({
          message: `CRITICAL: Hardcoded ${p.name} detected! (Index: ${match.index})`
        });
      }
    });

    return { errors };
  }
};