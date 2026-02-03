// test/fixtures/coherence-fail.js
const path = require('path');

// Global pollution risk (1 error)
globalVar = 'I am unsafe'; 

function run() {
    // Missing explicit return (1 warning)
    console.log(globalVar);
}

run();