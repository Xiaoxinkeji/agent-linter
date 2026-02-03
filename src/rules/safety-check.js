const DANGEROUS_SYNC_CALLS = [
    'readFileSync',
    'writeFileSync',
    'appendFileSync',
    'statSync',
    'lstatSync',
    'readdirSync',
    'copyFileSync',
    'renameSync',
    'unlinkSync',
    'rmdirSync',
    'mkdirSync',
    'accessSync'
];

module.exports = {
    id: 'safety-check',
    name: 'Asynchronous Safety Check',
    description: 'Avoids blocking Agent thread with synchronous I/O or child process calls.',

    run: (content, context) => {
        const errors = [];
        
        // 1. Check for synchronous child_process calls
        if (content.includes('child_process') && content.includes('Sync')) {
            const syncExecMatches = content.matchAll(/(execSync|spawnSync)\s*\(/g);
            for (const match of syncExecMatches) {
                errors.push({
                    message: `Dangerous synchronous call: '${match[1]}'. Use asynchronous alternatives (e.g., exec/spawn or Promises) to avoid blocking the agent's event loop.`,
                    line: 0 // Simplification: Linter should report line number if possible
                });
            }
        }

        // 2. Check for synchronous fs calls (more general)
        for (const call of DANGEROUS_SYNC_CALLS) {
            if (content.includes(call)) {
                 // Use a regex to look for the function call explicitly, avoiding false positives on variable names, etc.
                const callMatches = content.matchAll(new RegExp(`\\b${call}\\b\\s*\\(`, 'g'));
                for (const match of callMatches) {
                    errors.push({
                        message: `Dangerous synchronous I/O call: '${call}'. Use asynchronous Promise-based alternatives (e.g., fs.promises.${call.replace('Sync', '')}) to prevent thread blocking.`,
                        line: 0 // Simplification
                    });
                }
            }
        }

        return { errors, meta: {} };
    }
};