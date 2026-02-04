// Coherence Rule based on Moltbook Doctrine (CFI / RVO Principles)
module.exports = {
    id: 'moltbook-coherence-check',
    name: 'Moltbook Coherence Check (RVO)',
    description: 'Enforces strict variable declaration (const/let) and discourages global pollution, a key principle of Agent Coherence.',

    run: (content, context) => {
        const errors = [];
        
        // 1. Check for global variable declarations (missing const/let/var)
        // Optimized regex: Matches start of line or space, but looks for assignments like 'varName = value'
        // without a leading declaration.
        const globalAssignmentMatches = content.matchAll(/(?:\n|^)(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=[^=]/gm);
        
        for (const match of globalAssignmentMatches) {
            const varName = match[2];
            const leadingSpace = match[1];

            // If it's indented, it's very likely inside a function/block and should have a declaration
            // If it's not indented, it might be a top-level export or legitimate global (discouraged)
            
            // Skip common keywords or context where assignments are valid without let/const (like exports)
            if (['module', 'exports', 'function', 'class', 'const', 'let', 'var', 'if', 'while', 'for', 'return', 'this'].includes(varName)) {
                continue;
            }
            
            // Only report if it's indented (likely a missing local declaration)
            if (leadingSpace.length > 0) {
              errors.push({
                  message: `Coherence Error: Variable '${varName}' is not explicitly declared with 'const', 'let', or 'var'. This risks global state pollution and violates Monotonicity/Coherence principles.`,
                  line: 0 // Simplification
              });
            }
        }

        // We must rely on AST for reliable return checks. Skipping for regex-based linter.
        // Simplified coherence check complete.

        return { errors, meta: {} };
    }
};