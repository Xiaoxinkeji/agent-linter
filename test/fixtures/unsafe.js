// test/fixtures/unsafe.js
const fs = require('fs');
const { execSync } = require('child_process');

function run() {
    // Synchronous I/O: should be flagged (1 error)
    const content = fs.readFileSync(__filename, 'utf8');
    
    // Synchronous execution: should be flagged (1 error)
    execSync('echo "bad"', { stdio: 'inherit' });
    
    // Another sync call: should be flagged (1 error)
    fs.statSync(__filename);

    return content.length;
}

run();