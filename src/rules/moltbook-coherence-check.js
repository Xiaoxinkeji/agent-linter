// Coherence Rule based on Moltbook Doctrine (CFI / RVO Principles)
module.exports = {
    id: 'moltbook-coherence-check',
    name: 'Moltbook Coherence Check (RVO)',
    description: 'Enforces strict variable declaration (const/let) and discourages global pollution.',

    run: (content, context) => {
        const errors = [];
        
        // 1. Check for assignments without declarations
        // Match start of line or following a semicolon/newline: variableName = ...
        // Avoid matching 'if (a == b)' or object properties 'obj.prop = value'
        const assignmentRegex = /(?:^|[;\n])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=[^=]/g;
        
        const keywords = ['const', 'let', 'var', 'if', 'while', 'for', 'return', 'this', 'else', 'try', 'catch', 'finally', 'module', 'exports', 'function', 'class'];

        let match;
        while ((match = assignmentRegex.exec(content)) !== null) {
            const variableName = match[1];
            
            if (keywords.includes(variableName)) {
                continue;
            }

            // Look back in the content for a declaration of this variable
            // Simple check: does the content contain 'const variableName', 'let variableName', etc.
            const declarationRegex = new RegExp(`\\b(const|let|var|function|class)\\s+\\b${variableName}\\b`, 'g');
            const isDeclared = declarationRegex.test(content);
            
            // Also check for common globals or parameters (very basic)
            const isParameter = new RegExp(`function.*\\(.*\\b${variableName}\\b.*\\)`, 'g').test(content);

            if (!isDeclared && !isParameter) {
                errors.push({
                    message: `Coherence Error: Variable '${variableName}' is not explicitly declared with 'const', 'let', or 'var'.`,
                });
            }
        }

        return { errors, meta: {} };
    }
};
