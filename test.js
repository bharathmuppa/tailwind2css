#!/usr/bin/env node
/**
 * @file test.js
 * @description Test script that compares actual output with expected output
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function compareCSS(expected, actual) {
  // Normalize whitespace for comparison
  const normalizeCSS = (css) => {
    return css
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  };

  const normalizedExpected = normalizeCSS(expected);
  const normalizedActual = normalizeCSS(actual);

  if (normalizedExpected === normalizedActual) {
    return { passed: true, message: 'CSS output matches expected!' };
  }

  // Find differences
  const expectedLines = normalizedExpected.split('\n');
  const actualLines = normalizedActual.split('\n');

  const differences = [];
  const maxLines = Math.max(expectedLines.length, actualLines.length);

  for (let i = 0; i < maxLines; i++) {
    if (expectedLines[i] !== actualLines[i]) {
      differences.push({
        line: i + 1,
        expected: expectedLines[i] || '(missing)',
        actual: actualLines[i] || '(missing)',
      });
    }
  }

  return {
    passed: false,
    message: 'CSS output does not match!',
    differences: differences.slice(0, 10), // Show first 10 differences
    totalDifferences: differences.length,
  };
}

function runTest() {
  log('\n===========================================', 'cyan');
  log('     Tailwind2CSS Test Suite', 'cyan');
  log('===========================================\n', 'cyan');

  const testDir = path.join(__dirname, 'test-samples');
  const expectedFile = path.join(testDir, 'expected-output.css');
  const actualFile = path.join(testDir, 'actual-output.css');

  try {
    // Step 1: Run the conversion
    log('Step 1: Running conversion...', 'blue');
    const command = `node ./src/tailwind2css.js test-samples ${actualFile}`;
    const output = execSync(command, { encoding: 'utf8' });
    log(output, 'yellow');

    // Step 2: Read expected and actual files
    log('Step 2: Reading files...', 'blue');
    const expectedContent = fs.readFileSync(expectedFile, 'utf8');
    const actualContent = fs.readFileSync(actualFile, 'utf8');

    log(`Expected file: ${expectedFile}`, 'yellow');
    log(`Actual file: ${actualFile}`, 'yellow');

    // Step 3: Compare contents
    log('\nStep 3: Comparing output...', 'blue');
    const result = compareCSS(expectedContent, actualContent);

    if (result.passed) {
      log('\n✅ TEST PASSED!', 'green');
      log(result.message, 'green');

      // Clean up actual output file
      fs.unlinkSync(actualFile);
      log('\n✓ Cleaned up test files', 'yellow');

      process.exit(0);
    } else {
      log('\n❌ TEST FAILED!', 'red');
      log(result.message, 'red');

      if (result.differences) {
        log(`\nFound ${result.totalDifferences} difference(s). Showing first 10:`, 'yellow');
        result.differences.forEach(diff => {
          log(`\nLine ${diff.line}:`, 'cyan');
          log(`  Expected: ${diff.expected}`, 'green');
          log(`  Actual:   ${diff.actual}`, 'red');
        });
      }

      log(`\n⚠️  Actual output saved to: ${actualFile}`, 'yellow');
      log('Review the file to see the full output.', 'yellow');

      process.exit(1);
    }
  } catch (error) {
    log('\n❌ TEST ERROR!', 'red');
    log(error.message, 'red');

    if (error.stdout) {
      log('\nCommand output:', 'yellow');
      log(error.stdout, 'yellow');
    }

    process.exit(1);
  }
}

// Run the test
runTest();
