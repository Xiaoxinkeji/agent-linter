// Coherence Rule based on Moltbook Doctrine (CFI / RVO Principles)
module.exports = {
    id: 'moltbook-coherence-check',
    name: 'Moltbook Coherence Check (RVO)',
    description: 'Enforces strict variable declaration (const/let) and discourages global pollution.',

    run: (content, context) => {
        const errors = [];
        
        // Match assignments that start with indentation and are NOT preceded by a declaration keyword
        const globalAssignmentMatches = content.matchAll(/(?:\n|^)(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=[^=]/gm);
        
        const keywords = ['const', 'let', 'var', 'if', 'while', 'for', 'return', 'this', 'else', 'try', 'catch', 'finally', 'module', 'exports', 'function', 'class'];

        for (const match of globalAssignmentMatches) {
            const indentation = match[1];
            const variableName = match[2];
            
            if (keywords.includes(variableName)) {
                continue;
            }
            
            // Check if the preceding text on that line (after indentation) contains a declaration
            // Since the regex starts at \n or ^, we check if the declaration is missing
            const lines = content.split('\n');
            const matchingLine = lines.find(l => l.includes(`${variableName} =`) || l.includes(`${variableName}=`));
            
            if (matchingLine) {
                const trimmed = matchingLine.trim();
                const isDeclared = trimmed.startsWith('const ') || trimmed.startsWith('let ') || trimmed.startsWith('var ');
                
                if (!isDeclared) {
                    errors.push({
                        message: `Coherence Error: Variable '${variableName}' is not explicitly declared with 'const', 'let', or 'var'.`,
                    });
                }
            }
        }

        return { errors, meta: {} };
    }
};
