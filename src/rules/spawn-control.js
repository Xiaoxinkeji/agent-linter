/**
 * Sub-Agent Spawn Control Rule
 * Detects hidden or recursive sub-agent spawning that could lead to resource depletion.
 */
module.exports = {
  id: 'spawn-control',
  name: 'Sub-Agent Proliferation Guard',
  description: 'Prevents recursive agent spawning and ensures sub-agents have reasonable timeouts.',
  run: (content, context) => {
    // DO NOT SCAN SELF
    if (context.filePath && context.filePath.includes('spawn-control.js')) {
      return { errors: [], warnings: [] };
    }

    const errors = [];
    const warnings = [];
    
    // Check for sessions_spawn inside loop-like patterns
    // We target assignments or calls that look like:
    // for (...) { ... sessions_spawn ... }
    const spawnCall = 'sessions_spawn';
    
    // Very specific match: Check if 'sessions_spawn' appears on a line 
    // that follows a line starting with for/while/forEach (multiline regex)
    const recursivePattern = new RegExp('(?:for|while|forEach|\\.map)\\s*\\(.*\\)\\s*\\{[^}]*' + spawnCall, 'g');

    if (recursivePattern.test(content)) {
      errors.push({
        message: 'CRITICAL: Potential Agent Proliferation. Detected sessions_spawn potentially within a recursive or loop-based control structure.',
      });
    }

    // Check for missing timeout
    const timeoutPattern = new RegExp(spawnCall + '\\s*\\(\\s*\\{(?![^}]*runTimeoutSeconds)[^}]*\\}\\s*\\)', 'g');
    if (timeoutPattern.test(content)) {
      warnings.push({
        message: 'Resource Warning: Sub-agent spawned without a defined runTimeoutSeconds.',
      });
    }

    return { errors: errors, warnings: warnings };
  }
};
