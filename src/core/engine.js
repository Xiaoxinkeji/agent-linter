const fs = require('fs').promises; // Change to async fs
const Logger = require('../utils/logger');
const dependencyCheck = require('../rules/dependency-check');
const securityScan = require('../rules/security-scan');
const envCheck = require('../rules/env-check');
const safetyCheck = require('../rules/safety-check');
const coherenceCheck = require('../rules/moltbook-coherence-check'); // Import new rule

class LinterEngine {
  constructor(options = {}) {
    this.options = options;
    // Add the new coherenceCheck rule
    this.rules = [dependencyCheck, securityScan, envCheck, safetyCheck, coherenceCheck];
  }

  async lintFile(filePath, projectRoot) {
    // Change to asynchronous read
    const content = await fs.readFile(filePath, 'utf8');
    const context = { projectRoot, filePath };
    
    const result = {
      file: filePath,
      errors: [],
      warnings: [],
      meta: {}
    };

    for (const rule of this.rules) {
      const outcome = rule.run(content, context);
      
      if (outcome.errors) result.errors.push(...outcome.errors);
      if (outcome.warnings) result.warnings.push(...outcome.warnings);
      if (outcome.meta) {
        // Merge meta (e.g. missingPackages)
        result.meta = { ...result.meta, ...outcome.meta };
      }
    }

    return result;
  }
}

module.exports = LinterEngine;