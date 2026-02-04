const fs = require('fs').promises;
const path = require('path');

module.exports = {
  id: 'env-check',
  name: 'Environment Variable Usage',
  description: 'Verifies process.env usage against .env definition',
  
  run: async (content, context) => {
    const warnings = [];
    const envMatches = content.matchAll(/process\.env\.([A-Z_0-9]+)/g);
    const usedEnvVars = new Set();
    
    for (const match of envMatches) {
      usedEnvVars.add(match[1]);
    }

    if (usedEnvVars.size > 0) {
      const envPath = path.join(context.projectRoot, '.env');
      
      try {
        await fs.access(envPath);
        const envContent = await fs.readFile(envPath, 'utf8');
        usedEnvVars.forEach(v => {
          // Simple check for KEY=
          const regex = new RegExp(`^${v}=`, 'm');
          if (!regex.test(envContent)) {
            warnings.push({
              message: `Variable "${v}" used in code but likely missing in .env file.`
            });
          }
        });
      } catch (e) {
        warnings.push({
          message: `Usage of process.env detected, but no .env file found in root.`
        });
      }
    }

    return { warnings };
  }
};
