const fs = require('fs');
const Logger = require('../utils/logger');
const dependencyCheck = require('../rules/dependency-check');
const securityScan = require('../rules/security-scan');
const envCheck = require('../rules/env-check');

class LinterEngine {
  constructor(options = {}) {
    this.options = options;
    this.rules = [dependencyCheck, securityScan, envCheck];
  }

  async lintFile(filePath, projectRoot) {
    const content = fs.readFileSync(filePath, 'utf8');
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