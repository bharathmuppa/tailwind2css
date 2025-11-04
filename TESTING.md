# Testing Guide

## Overview

This project includes an automated test suite that validates the conversion of Tailwind CSS classes to standard CSS.

## Test Structure

```
test-samples/
├── flex-sample.html          # Sample HTML with flex utilities
├── grid-sample.html          # Sample HTML with grid utilities
├── expected-output.css       # Expected CSS output (reference)
└── COMPARISON.md            # Detailed comparison documentation

test.js                       # Main test script
```

## Running Tests

### Automated Test (Recommended)

```bash
npm test
```

**What it does:**
1. Runs the conversion on `test-samples/` directory
2. Generates `actual-output.css` (temporary file)
3. Compares it with `expected-output.css`
4. Shows colored output:
   - ✅ Green = Test passed
   - ❌ Red = Test failed
5. Auto-cleans up the temporary file on success

### Manual Test

```bash
npm run test:samples
```

**What it does:**
- Generates `test-samples/output.css` for manual inspection
- Does not auto-delete the file
- Useful for debugging or reviewing output

## Test Output

### Success
```
===========================================
     Tailwind2CSS Test Suite
===========================================

Step 1: Running conversion...
Scanning pattern: test-samples/**/*.{html,ts,scss}
Found 2 files to process
Extracted 66 unique classes
Generated 66 CSS rules

Step 2: Reading files...
Expected file: test-samples/expected-output.css
Actual file: test-samples/actual-output.css

Step 3: Comparing output...

✅ TEST PASSED!
CSS output matches expected!

✓ Cleaned up test files
```

### Failure
```
❌ TEST FAILED!
CSS output does not match!

Found 5 difference(s). Showing first 10:

Line 12:
  Expected: .gap-4 { gap: 1rem; }
  Actual:   .gap-4 { gap: 2rem; }

⚠️  Actual output saved to: test-samples/actual-output.css
Review the file to see the full output.
```

## What is Tested

### Flex Layout (24 classes)
- Flex display and direction
- Flex items (auto, initial, none)
- Justify content (center, between, evenly)
- Align items (center, stretch, baseline)
- Align self (start, center, end)

### Grid Layout (42 classes)
- Grid display
- Grid template columns/rows
- Column spanning and positioning
- Row spanning and positioning
- Grid flow
- Auto columns/rows sizing

### Spacing (All classes)
- Gap utilities
- Padding utilities
- Margin utilities

## Updating Tests

If you add new features or modify CSS output:

1. **Update expected output:**
   ```bash
   # Generate new output
   npm run test:samples

   # Copy to expected
   cp test-samples/output.css test-samples/expected-output.css
   ```

2. **Add test samples:**
   - Add new HTML examples to `test-samples/flex-sample.html` or `test-samples/grid-sample.html`
   - Or create new sample files

3. **Run tests:**
   ```bash
   npm test
   ```

## Continuous Integration

You can add this to your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Troubleshooting

### Test fails but output looks correct
- Check for whitespace differences
- The test normalizes whitespace, but extra spaces might cause issues
- Review `test-samples/actual-output.css` manually

### Test passes but output seems wrong
- The expected output might be outdated
- Update the expected file with the new correct output

### Need to debug
```bash
# Generate output without comparison
npm run test:samples

# Review the file
cat test-samples/output.css
```
