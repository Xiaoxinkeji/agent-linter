/**
 * Conflict Arbiter Rule
 * Detects unsafe concurrent file operations in multi-agent environments.
 */
module.exports = {
  id: 'conflict-arbiter',
  name: 'Multi-Agent Conflict Arbiter',
  description: 'Detects lack of file locking or potential race conditions in shared workspaces.',
  run: (content, context) => {
    const errors = [];
    const warnings = [];
    
    // Pattern: writing to common config files without check for locks
    if ((content.includes('MEMORY.md') || content.includes('AGENTS.md')) && !content.includes('lock')) {
      warnings.push({
        message: 'Unsafe shared resource access: Detected modifications to core memory files without explicit locking logic. Risk of state corruption in multi-agent setups.'
      });
    }

    // Check for raw fs.writeFile without safety wrappers
    if (content.includes('fs.writeFile') && !content.includes('try') && !content.includes('catch')) {
      errors.push({
        message: 'Naked file write detected: Writing to disk without error handling or conflict checks is prohibited by ADAC security standards.'
      });
    }
    
    return { errors, warnings };
  }
};
