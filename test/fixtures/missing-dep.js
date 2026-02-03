// test/fixtures/missing-dep.js
const fs = require('fs');
// This dependency should not be installed in the agent-linter project's node_modules
const testDep = require('some-non-existent-agent-dep'); 

function run() {
    return testDep;
}

run();