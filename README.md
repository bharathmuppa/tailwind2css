# Tailwind2CSS

Tailwind2CSS is a tool that converts Tailwind-like classes used in your project files (HTML, TypeScript, SCSS) into standard CSS rules. This can be useful if you want to migrate away from Tailwind classes to plain CSS, or simply need a static CSS output for your project.

## Features

- **Recursive File Scanning:** Scans through a specified directory for files with `.html`, `.ts`, and `.scss` extensions.
- **Class Extraction:** Extracts unique Tailwind-like classes including those used in `@apply` directives in SCSS.
- **CSS Generation:** Generates corresponding CSS rules based on common Tailwind classes and custom utility classes.
- **Flex Layout Support:** Convert flex utilities (flex, flex-row, justify-center, items-center, etc.)
- **Grid Layout Support:** Convert grid utilities (grid, grid-cols-*, col-span-*, row-start-*, etc.)
- **Spacing Utilities:** Convert gap, padding, and margin classes
- **Cross-Platform:** Works on Mac, Windows, and Linux

## Installation

You can use this tool directly with `npx`:

```bash
npx @ngnomads/tailwind2css <targetDirectory> <outputCssFile>
```

## Usage

### Basic Usage

```bash
# Convert all Tailwind classes in 'src' directory to 'output.css'
npx @ngnomads/tailwind2css src ./output.css

# Convert all classes in 'projects' directory
npx @ngnomads/tailwind2css projects ./styles.css
```

### Example

**Input HTML:**
```html
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2 p-4">Item 1</div>
  <div class="flex justify-center items-center p-2">Item 2</div>
</div>
```

**Output CSS:**
```css
.grid { display: grid; }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.col-span-2 { grid-column: span 2 / span 2; }
.p-4 { padding: 1rem; }
.flex { display: flex; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
.p-2 { padding: 0.5rem; }
```

## Testing

Run the test suite to verify the conversion works correctly:

```bash
# Run automated tests (compares expected vs actual output)
npm test

# Generate sample output for manual inspection
npm run test:samples
```

The test suite:
- ✅ Converts sample HTML files with flex and grid classes
- ✅ Compares actual output with expected output
- ✅ Shows detailed diff if tests fail
- ✅ Auto-cleans up test files on success

## Supported Utilities

### Grid Layout
- `grid`, `grid-cols-*`, `grid-rows-*`
- `col-span-*`, `col-start-*`, `col-end-*`, `col-auto`
- `row-span-*`, `row-start-*`, `row-end-*`, `row-auto`
- `grid-flow-row`, `grid-flow-col`, `grid-flow-dense`
- `auto-cols-*`, `auto-rows-*`

### Flex Layout
- `flex`, `flex-row`, `flex-col`, `flex-wrap`
- `flex-auto`, `flex-initial`, `flex-none`, `flex-1`, `flex-2`
- `justify-*`, `items-*`, `self-*`

### Spacing
- `gap-*`, `gap-x-*`, `gap-y-*`
- `p-*`, `px-*`, `py-*`, `pt-*`, `pr-*`, `pb-*`, `pl-*`
- `m-*`, `mx-*`, `my-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*`

## Development

```bash
# Clone the repository
git clone https://github.com/bharathmuppa/tailwind2css.git

# Install dependencies
npm install

# Run tests
npm test
```

## License

ISC

## Author

bharathmuppa
