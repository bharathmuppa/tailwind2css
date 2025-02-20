# Tailwind2CSS

Tailwind2CSS is a tool that converts Tailwind-like classes used in your project files (HTML, TypeScript, SCSS) into standard CSS rules. This can be useful if you want to migrate away from Tailwind classes to plain CSS, or simply need a static CSS output for your project.

## Features

- **Recursive File Scanning:** Scans through a specified directory for files with `.html`, `.ts`, and `.scss` extensions.
- **Class Extraction:** Extracts unique Tailwind-like classes including those used in `@apply` directives in SCSS.
- **CSS Generation:** Generates corresponding CSS rules based on common Tailwind classes and custom utility classes.

## Installation

You can use this tool directly with `npx`:

```bash
npx @ngnomads/tailwind2css <targetDirectory> <outputCssFile>
