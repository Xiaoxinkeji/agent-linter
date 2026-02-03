module.exports = {
  id: 'security-scan',
  name: 'Secret Leak Detection',
  description: 'Scans for hardcoded API keys and secrets',
  
  run: (content) => {
    const errors = [];
    
    const patterns = [
      // GitHub
      { name: 'GitHub Token', regex: /(ghp_[a-zA-Z0-9]{36})/g },
      { name: 'GitHub OAuth', regex: /(gho_[a-zA-Z0-9]{36})/g },
      
      // OpenAI (Updated for sk-proj and standard sk keys)
      { name: 'OpenAI Key', regex: /(sk-(proj-)?[a-zA-Z0-9]{32,})/g },
      
      // Private Keys
      { name: 'Private Key Block', regex: /-----BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY-----/g },
      
      // Cloud Providers
      { name: 'AWS Access Key', regex: /(AKIA[0-9A-Z]{16})/g },
      { name: 'Google Cloud Key', regex: /(AIza[0-9A-Za-z\\-_]{35})/g },
      
      // Slack
      { name: 'Slack Token', regex: /(xox[baprs]-([0-9a-zA-Z]{10,48}))/g },
      
      // Generic "High Confidence" Assignments (e.g. apiKey = "xyz")
      // Avoids matching "const apiKey = process.env.KEY"
      { name: 'Potential Generic Secret', regex: /(?:api_key|authToken|secret|password)\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/gi }
    ];

    patterns.forEach(p => {
      let match;
      while ((match = p.regex.exec(content)) !== null) {
        // Simple false-positive check: ignore if it looks like an ENV var reference
        const captured = match[1] || match[0];
        if (captured.includes('process.env') || captured.includes('${')) continue;

        errors.push({
          message: `CRITICAL: Hardcoded ${p.name} detected! (Pattern match)`
        });
      }
    });

    return { errors };
  }
};