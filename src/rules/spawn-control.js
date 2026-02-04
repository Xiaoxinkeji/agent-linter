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
    
    // Pattern: sessions_spawn inside a loop or function without clear terminal condition
    const recursiveSpawnRegex = new RegExp(['sessions_spawn', '.*', 'while|for|forEach'].join(''), 'gi');
    
    // Pattern: sessions_spawn without a timeout specified
    const spawnWithoutTimeoutRegex = /sessions_spawn\s*\(\s*\{(?![^}]*runTimeoutSeconds)[^}]*\}\s*\)/gi;

    if (recursiveSpawnRegex.test(content)) {
      errors.push({
        message: 'CRITICAL: Potential Agent Proliferation. Detected sub-agent spawning inside a loop. This risks an exponential resource explosion.',
      });
    }

    if (spawnWithoutTimeoutRegex.test(content)) {
      warnings.push({
        message: 'Resource Warning: Sub-agent spawned without a defined runTimeoutSeconds. This may lead to orphaned background processes.',
      });
    }

    return { errors, warnings };
  }
};
