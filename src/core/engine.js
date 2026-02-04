const fs = require('fs').promises;
const path = require('path');
const Logger = require('../utils/logger');

class LinterEngine {
  constructor(options = {}) {
    this.options = options;
    this.rules = [];
  }

  /**
   * Automatically load all rules from the rules directory
   */
  async loadRules() {
    const rulesDir = path.join(__dirname, '../rules');
    const files = await fs.readdir(rulesDir);
    
    this.rules = [];
    for (const file of files) {
      if (file.endsWith('.js')) {
        try {
          const rulePath = path.join(rulesDir, file);
          const rule = require(rulePath);
          if (rule.run && typeof rule.run === 'function') {
            this.rules.push(rule);
          }
        } catch (e) {
          Logger.error(`Failed to load rule from ${file}: ${e.message}`);
        }
      }
    }
  }

  async lintFile(filePath, projectRoot) {
    if (this.rules.length === 0) {
      await this.loadRules();
    }

    const content = await fs.readFile(filePath, 'utf8');
    const context = { projectRoot, filePath };
    
    const result = {
      file: filePath,
      errors: [],
      warnings: [],
      meta: {}
    };

    for (const rule of this.rules) {
      try {
        // Support both sync and async rules
        const outcome = await Promise.resolve(rule.run(content, context));
        
        if (outcome.errors) result.errors.push(...outcome.errors);
        if (outcome.warnings) result.warnings.push(...outcome.warnings);
        if (outcome.meta) {
          result.meta = { ...result.meta, ...outcome.meta };
        }
      } catch (e) {
        Logger.error(`Error running rule "${rule.name || 'unknown'}": ${e.message}`);
      }
    }

    return result;
  }
}

module.exports = LinterEngine;
