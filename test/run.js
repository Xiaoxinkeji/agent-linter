const assert = require('assert');
const path = require('path');
const LinterEngine = require('../src/core/engine');

const testEngine = new LinterEngine();
const projectRoot = path.resolve(__dirname, '..');

async function runTest(name, filePath, expectedErrors, expectedWarnings) {
    try {
        const fullPath = path.join(__dirname, filePath);
        const relativePath = path.relative(projectRoot, fullPath);

        const result = await testEngine.lintFile(fullPath, projectRoot);

        // 1. Check for expected number of errors
        assert.strictEqual(result.errors.length, expectedErrors, 
            `❌ Test '${name}' failed: Expected ${expectedErrors} errors, got ${result.errors.length} for ${relativePath}`);
        
        // 2. Check for expected number of warnings (if applicable)
        assert.strictEqual(result.warnings.length, expectedWarnings,
            `❌ Test '${name}' failed: Expected ${expectedWarnings} warnings, got ${result.warnings.length} for ${relativePath}`);

        console.log(`✅ Test '${name}' passed.`);

    } catch (error) {
        console.error(`🔴 Test suite failed for '${name}':`, error.message);
        throw error;
    }
}

async function runTestSuite() {
    console.log('\n--- Running Agent Linter Test Suite ---');
    let hasFailed = false;

    try {
        // Test Case 1: Clean file (no errors, no warnings)
        await runTest('Clean File Check', 'fixtures/clean.js', 0, 0);

        // Test Case 2: Missing Dependency (1 error from dependency-check)
        await runTest('Missing Dependency Check', 'fixtures/missing-dep.js', 1, 0);

        // Test Case 3: Unsafe Synchronous Calls (3 errors from safety-check)
        await runTest('Unsafe Sync Calls Check', 'fixtures/unsafe.js', 3, 0);
        
        // Add more tests here...

    } catch (e) {
        hasFailed = true;
        process.exitCode = 1;
    } finally {
        console.log('--- Test Suite Complete ---');
        if (hasFailed) {
            console.error('Test suite failed. See 🔴 above.');
        } else {
            console.log('All tests passed! 🎉');
        }
    }
}

runTestSuite();