// Coherence Rule based on Moltbook Doctrine (CFI / RVO Principles)
module.exports = {
    id: 'moltbook-coherence-check',
    name: 'Moltbook Coherence Check (RVO)',
    description: 'Enforces strict variable declaration (const/let) and discourages global pollution, a key principle of Agent Coherence.',

    run: (content, context) => {
        const errors = [];
        
        // 1. Check for global variable declarations (missing const/let/var)
        // This is a simplified check: looks for assignments at the start of a line
        const globalAssignmentMatches = content.matchAll(/^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*[^=]/gm);
        
        for (const match of globalAssignmentMatches) {
            const varName = match[2];
            // Skip common top-level exports or function definitions
            if (['module', 'exports', 'function', 'class', 'const', 'let', 'var'].includes(varName)) {
                continue;
            }
            
            errors.push({
                message: `Coherence Error: Variable '${varName}' is not explicitly declared with 'const', 'let', or 'var'. This risks global state pollution and violates Monotonicity/Coherence principles.`,
                line: 0 // Simplification
            });
        }

        // We must rely on AST for reliable return checks. Skipping for regex-based linter.
        // Simplified coherence check complete.

        return { errors, meta: {} };
    }
};