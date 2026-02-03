// test/fixtures/clean.js
const path = require('path');

function run() {
    console.log('This code should pass all linter checks.');
    return path.join('foo', 'bar');
}

run();