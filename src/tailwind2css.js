#!/usr/bin/env node
/**
 * @file tailwind2css.js
 * @description A tool to convert Tailwind-like classes found in your project files into corresponding CSS rules.
 *
 * The script recursively scans files (HTML, TS, SCSS) within a target directory, extracts Tailwind-like
 * class names, and generates a CSS file with rules for each unique class.
 *
 * Usage:
 *   npx @ngnomads/tailwind2css <targetDirectory> <outputCssFile>
 *
 * Example:
 *   npx @ngnomads/tailwind2css projects ./src/styles.css
 */

// ------------------------------
// REQUIRED MODULES
// ------------------------------
const fs = require('fs');
const path = require('path');
const { sync: globSync } = require('glob');

// ------------------------------
// CONFIGURATION
// ------------------------------
const targetDir = process.argv[2] || 'projects';
const outputCssFile = process.argv[3] || './tailwind.css';
// Use path.join to build the pattern then convert backslashes to forward slashes for cross-platform compatibility.
const pattern = path.join(targetDir, '**/*.{html,ts,scss}').replace(/\\/g, '/');
const classSet = new Set(); // Set to store unique Tailwind-like class names

// ------------------------------
// CLASS EXTRACTION FUNCTIONS
// ------------------------------

/**
 * Extracts class names from attributes (class, ng-class, [ngClass]) in file content.
 * @param {string} content - The content of the file to search.
 */
function extractClasses(content) {
  const attrRegex = /(?:class|ng-class|\[ngClass\])\s*=\s*(?:"([^"]+)"|'([^']+)')/g;
  let match;
  while ((match = attrRegex.exec(content)) !== null) {
    const attrValue = match[1] || match[2];
    // Check for object or array syntax, then extract string literals if needed.
    if (attrValue.trim().startsWith('{') || attrValue.trim().startsWith('[')) {
      const stringLiteralRegex = /["']([^"']+)["']/g;
      let innerMatch;
      while ((innerMatch = stringLiteralRegex.exec(attrValue)) !== null) {
        innerMatch[1].split(/\s+/).forEach((cls) => {
          if (cls.trim()) classSet.add(cls.trim());
        });
      }
    } else {
      attrValue.split(/\s+/).forEach((cls) => {
        if (cls.trim()) classSet.add(cls.trim());
      });
    }
  }
}

/**
 * Uses a broad regular expression to capture common Tailwind-like classes.
 * @param {string} content - The file content to search.
 */
function extractPredefinedClasses(content) {
  const tailwindRegex =
    /\b(?:flex(?:-\[[^\]]+\]|-\d+(?:\/\d+)?|-\(.+?\))?|flex-row|flex-col|flex-wrap|flex-nowrap|flex-wrap-reverse|w-full|h-full|min-w-full|min-h-full|max-w-\[[^\]]+\]|max-h-\[[^\]]+\]|w-\[[^\]]+\]|h-\[[^\]]+\]|bg-\[[^\]]+\]|bg-[a-z]+-[0-9]{1,4}|gap-\[[^\]]+\]|gap-[0-9]+|box-border|justify-(?:start|end|center|between|around|evenly|stretch|baseline|normal)|items-(?:start|end|center|baseline|stretch)|self-(?:auto|start|end|center|stretch|baseline)|flex-auto|flex-initial|flex-none)\b/g;
  let match;
  while ((match = tailwindRegex.exec(content)) !== null) {
    classSet.add(match[0]);
  }
}

/**
 * Extracts additional spacing classes (margins, padding, and space utilities) from the file content.
 * @param {string} content - The file content to search.
 */
function extractAdditionalClasses(content) {
  const marginRegex = /\b(?:m|mx|my|ms|me|mt|mr|mb|ml)-(?:-?\d+(?:\.\d+)?|auto|px|\([^)]+\)|\[[^\]]+\])\b/g;
  const spaceRegex = /\b(?:-?space-[xy]-(?:\d+|px|\([^)]+\)|\[[^\]]+\])|space-[xy]-reverse)\b/g;
  const paddingRegex = /\b(?:p|px|py|ps|pe|pt|pr|pb|pl)-(?:-?\d+(?:\.\d+)?|auto|px|\([^)]+\)|\[[^\]]+\])\b/g;
  let match;
  while ((match = marginRegex.exec(content)) !== null) {
    classSet.add(match[0]);
  }
  while ((match = spaceRegex.exec(content)) !== null) {
    classSet.add(match[0]);
  }
  while ((match = paddingRegex.exec(content)) !== null) {
    classSet.add(match[0]);
  }
}

/**
 * Extracts class names from SCSS @apply directives.
 * @param {string} content - The SCSS file content to search.
 */
function extractApplyClasses(content) {
  const applyRegex = /@apply\s+([^;]+);/g;
  let match;
  while ((match = applyRegex.exec(content)) !== null) {
    match[1]
      .trim()
      .split(/\s+/)
      .forEach((cls) => {
        if (cls.trim()) classSet.add(cls.trim());
      });
  }
}

// ------------------------------
// HELPER FUNCTIONS FOR CSS GENERATION
// ------------------------------

/**
 * Escapes special characters in a class name for safe CSS selectors.
 * @param {string} className - The class name to escape.
 * @returns {string} The escaped class name.
 */
function escapeClassName(className) {
  return className.replace(/[^a-zA-Z0-9_-]/g, (ch) => '\\' + ch);
}

/**
 * Mapping for fixed margin values.
 */
const fixedMarginMapping = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.74rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
};

/**
 * Mapping for fixed padding values.
 */
const fixedPaddingMapping = {
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

/**
 * Generates a margin rule for a given class name.
 * @param {string} className - The Tailwind-like class name.
 * @param {string} prefix - The margin prefix (e.g., "m", "mt").
 * @param {string} cssProp - The corresponding CSS property.
 * @returns {string|null} The generated CSS rule, or null if not applicable.
 */
function generateMarginRule(className, prefix, cssProp) {
  let re = new RegExp(`^(-?)${prefix}-(\\d+(?:\\.\\d+)?)$`);
  let match = className.match(re);
  if (match) {
    let sign = match[1];
    let num = match[2];
    if (fixedMarginMapping.hasOwnProperty(num)) {
      let fixedValue = fixedMarginMapping[num];
      if (sign === '-' && !fixedValue.startsWith('-')) {
        fixedValue = '-' + fixedValue;
      }
      return `.${escapeClassName(className)} { ${cssProp}: ${fixedValue}; }`;
    }
    return `.${escapeClassName(className)} { ${cssProp}: calc(var(--spacing) * ${sign}${num}); }`;
  }
  if (className === `${prefix}-auto`) {
    return `.${className} { ${cssProp}: auto; }`;
  }
  if (className === `${prefix}-px`) {
    return `.${className} { ${cssProp}: 1px; }`;
  }
  if (className === `-${prefix}-px`) {
    return `.${className} { ${cssProp}: -1px; }`;
  }
  re = new RegExp(`^${prefix}-\\((.+)\\)$`);
  match = className.match(re);
  if (match) {
    return `.${escapeClassName(className)} { ${cssProp}: var(${match[1]}); }`;
  }
  re = new RegExp(`^${prefix}-\\[(.+?)\\]$`);
  match = className.match(re);
  if (match) {
    let value = match[1].replace(/_/g, ' ');
    return `.${escapeClassName(className)} { ${cssProp}: ${value}; }`;
  }
  return null;
}

/**
 * Generates a padding rule for a given class name.
 * @param {string} className - The Tailwind-like class name.
 * @param {string} prefix - The padding prefix (e.g., "p", "pt").
 * @param {string} cssProp - The corresponding CSS property.
 * @returns {string|null} The generated CSS rule, or null if not applicable.
 */
function generatePaddingRule(className, prefix, cssProp) {
  let re = new RegExp(`^(-?)${prefix}-(\\d+(?:\\.\\d+)?)$`);
  let match = className.match(re);
  if (match) {
    let sign = match[1];
    let num = match[2];
    if (fixedPaddingMapping.hasOwnProperty(num)) {
      let fixedValue = fixedPaddingMapping[num];
      if (sign === '-' && !fixedValue.startsWith('-')) {
        fixedValue = '-' + fixedValue;
      }
      return `.${escapeClassName(className)} { ${cssProp}: ${fixedValue}; }`;
    }
    return `.${escapeClassName(className)} { ${cssProp}: calc(var(--spacing) * ${sign}${num}); }`;
  }
  if (className === `${prefix}-auto`) {
    return `.${className} { ${cssProp}: auto; }`;
  }
  if (className === `${prefix}-px`) {
    return `.${className} { ${cssProp}: 1px; }`;
  }
  if (className === `-${prefix}-px`) {
    return `.${className} { ${cssProp}: -1px; }`;
  }
  re = new RegExp(`^${prefix}-\\((.+)\\)$`);
  match = className.match(re);
  if (match) {
    return `.${escapeClassName(className)} { ${cssProp}: var(${match[1]}); }`;
  }
  re = new RegExp(`^${prefix}-\\[(.+?)\\]$`);
  match = className.match(re);
  if (match) {
    let value = match[1].replace(/_/g, ' ');
    return `.${escapeClassName(className)} { ${cssProp}: ${value}; }`;
  }
  return null;
}

/**
 * Generates a space utility rule for the given axis ("x" or "y").
 * @param {string} className - The Tailwind-like class name.
 * @param {string} axis - The axis for the space utility ("x" or "y").
 * @returns {string|null} The generated CSS rule, or null if not applicable.
 */
function generateSpaceRule(className, axis) {
  let startProp, endProp;
  if (axis === 'x') {
    startProp = 'margin-inline-start';
    endProp = 'margin-inline-end';
  } else if (axis === 'y') {
    startProp = 'margin-block-start';
    endProp = 'margin-block-end';
  } else {
    return null;
  }
  let re = new RegExp(`^(-?)space-${axis}-(\\d+)$`);
  let match = className.match(re);
  if (match) {
    let sign = match[1];
    let num = match[2];
    let value = `${sign}${num}`;
    return `.${escapeClassName(className)} {\n  --tw-space-${axis}-reverse: 0;\n}\n.${escapeClassName(className)} > :not(:last-child) {\n  ${startProp}: calc(var(--spacing) * ${value} * var(--tw-space-${axis}-reverse));\n  ${endProp}: calc(var(--spacing) * ${value} * calc(1 - var(--tw-space-${axis}-reverse)));\n}`;
  }
  re = new RegExp(`^(-?)space-${axis}-px$`);
  match = className.match(re);
  if (match) {
    let sign = match[1];
    let val = sign === '-' ? '-1px' : '1px';
    return `.${escapeClassName(className)} {\n  --tw-space-${axis}-reverse: 0;\n}\n.${escapeClassName(className)} > :not(:last-child) {\n  ${startProp}: calc(${val} * var(--tw-space-${axis}-reverse));\n  ${endProp}: calc(${val} * calc(1 - var(--tw-space-${axis}-reverse)));\n}`;
  }
  re = new RegExp(`^space-${axis}-\\((.+)\\)$`);
  match = className.match(re);
  if (match) {
    let customProp = match[1];
    return `.${escapeClassName(className)} {\n  --tw-space-${axis}-reverse: 0;\n}\n.${escapeClassName(className)} > :not(:last-child) {\n  ${startProp}: calc(var(${customProp}) * var(--tw-space-${axis}-reverse));\n  ${endProp}: calc(var(${customProp}) * calc(1 - var(--tw-space-${axis}-reverse)));\n}`;
  }
  re = new RegExp(`^space-${axis}-\\[(.+?)\\]$`);
  match = className.match(re);
  if (match) {
    let value = match[1].replace(/_/g, ' ');
    return `.${escapeClassName(className)} {\n  --tw-space-${axis}-reverse: 0;\n}\n.${escapeClassName(className)} > :not(:last-child) {\n  ${startProp}: calc(${value} * var(--tw-space-${axis}-reverse));\n  ${endProp}: calc(${value} * calc(1 - var(--tw-space-${axis}-reverse)));\n}`;
  }
  return null;
}

// ------------------------------
// MAIN CSS GENERATION FUNCTION
// ------------------------------

/**
 * Generates the corresponding CSS rule for a given Tailwind-like class.
 * @param {string} className - The class name to convert.
 * @returns {string|null} The generated CSS rule, or null if no rule applies.
 */
function generateCssForClass(className) {
  // -- FLEX UTILITIES --
  if (className === 'flex') return `.flex { display: flex; }`;
  if (className === 'flex-auto') return `.flex-auto { flex: 1 1 auto; }`;
  if (className === 'flex-initial') return `.flex-initial { flex: 0 1 auto; }`;
  if (className === 'flex-none') return `.flex-none { flex: none; }`;

  let match;
  match = className.match(/^flex-(\d+)$/);
  if (match) return `.${escapeClassName(className)} { flex: ${match[1]}; }`;
  match = className.match(/^flex-(\d+\/\d+)$/);
  if (match) return `.${escapeClassName(className)} { flex: calc(${match[1]} * 100%); }`;
  match = className.match(/^flex-\((.+)\)$/);
  if (match) return `.${escapeClassName(className)} { flex: var(${match[1]}); }`;
  match = className.match(/^flex-\[(.+?)\]$/);
  if (match) return `.${escapeClassName(className)} { flex: ${match[1].replace(/_/g, ' ')}; }`;

  // -- FLEX WRAP UTILITIES --
  if (className === 'flex-wrap') return `.flex-wrap { flex-wrap: wrap; }`;
  if (className === 'flex-nowrap') return `.flex-nowrap { flex-wrap: nowrap; }`;
  if (className === 'flex-wrap-reverse') return `.flex-wrap-reverse { flex-wrap: wrap-reverse; }`;

  // -- MARGIN / SPACING UTILITIES --
  const marginPrefixes = ['m', 'mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'];
  const marginCssProps = {
    m: 'margin',
    mx: 'margin-inline',
    my: 'margin-block',
    ms: 'margin-inline-start',
    me: 'margin-inline-end',
    mt: 'margin-top',
    mr: 'margin-right',
    mb: 'margin-bottom',
    ml: 'margin-left',
  };
  for (let prefix of marginPrefixes) {
    if (className.startsWith(prefix + '-') || className.startsWith('-' + prefix + '-')) {
      let rule = generateMarginRule(className, prefix, marginCssProps[prefix]);
      if (rule) return rule;
    }
  }

  // -- PADDING UTILITIES --
  const paddingPrefixes = ['p', 'px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'];
  const paddingCssProps = {
    p: 'padding',
    px: 'padding-inline',
    py: 'padding-block',
    ps: 'padding-inline-start',
    pe: 'padding-inline-end',
    pt: 'padding-top',
    pr: 'padding-right',
    pb: 'padding-bottom',
    pl: 'padding-left',
  };
  for (let prefix of paddingPrefixes) {
    if (className.startsWith(prefix + '-') || className.startsWith('-' + prefix + '-')) {
      let rule = generatePaddingRule(className, prefix, paddingCssProps[prefix]);
      if (rule) return rule;
    }
  }

  // -- SPACE UTILITIES --
  if (className.startsWith('space-x-')) {
    let rule = generateSpaceRule(className, 'x');
    if (rule) return rule;
  }
  if (className.startsWith('space-y-')) {
    let rule = generateSpaceRule(className, 'y');
    if (rule) return rule;
  }
  if (className === 'space-x-reverse') return `.space-x-reverse { --tw-space-x-reverse: 1; }`;
  if (className === 'space-y-reverse') return `.space-y-reverse { --tw-space-y-reverse: 1; }`;

  // -- OTHER PREVIOUSLY SUPPORTED CLASSES --
  if (className === 'flex-row') return `.flex-row { flex-direction: row; }`;
  if (className === 'flex-col') return `.flex-col { flex-direction: column; }`;
  if (className === 'box-border') return `.box-border { box-sizing: border-box; }`;
  if (className === 'h-full') return `.h-full { height: 100%; }`;
  if (className === 'min-w-full') return `.min-w-full { min-width: 100%; }`;
  if (className === 'min-h-full') return `.min-h-full { min-height: 100%; }`;

  // -- JUSTIFY, ALIGN & SELF UTILITIES --
  const justifyMapping = {
    'justify-start': 'flex-start',
    'justify-end': 'flex-end',
    'justify-center': 'center',
    'justify-between': 'space-between',
    'justify-around': 'space-around',
    'justify-evenly': 'space-evenly',
    'justify-stretch': 'stretch',
    'justify-baseline': 'baseline',
    'justify-normal': 'normal',
  };
  if (justifyMapping[className])
    return `.${className} { justify-content: ${justifyMapping[className]}; }`;

  const itemsMapping = {
    'items-start': 'flex-start',
    'items-end': 'flex-end',
    'items-center': 'center',
    'items-baseline': 'baseline',
    'items-stretch': 'stretch',
  };
  if (itemsMapping[className])
    return `.${className} { align-items: ${itemsMapping[className]}; }`;

  const selfMapping = {
    'self-auto': 'auto',
    'self-start': 'flex-start',
    'self-end': 'flex-end',
    'self-center': 'center',
    'self-stretch': 'stretch',
    'self-baseline': 'baseline',
  };
  if (selfMapping[className])
    return `.${className} { align-self: ${selfMapping[className]}; }`;

  // -- WIDTH, HEIGHT, BACKGROUND, GAP, etc. --
  if (className === 'w-full') return `.w-full { width: 100%; }`;
  match = className.match(/^w-\[(.+?)\]$/);
  if (match)
    return `.${escapeClassName(className)} { width: ${match[1].replace(/_/g, ' ')}; }`;

  match = className.match(/^h-\[(.+?)\]$/);
  if (match)
    return `.${escapeClassName(className)} { height: ${match[1].replace(/_/g, ' ')}; }`;

  match = className.match(/^max-w-\[(.+?)\]$/);
  if (match)
    return `.${escapeClassName(className)} { max-width: ${match[1].replace(/_/g, ' ')}; }`;

  match = className.match(/^max-h-\[(.+?)\]$/);
  if (match)
    return `.${escapeClassName(className)} { max-height: ${match[1].replace(/_/g, ' ')}; }`;

  match = className.match(/^bg-\[(.+?)\]$/);
  if (match)
    return `.${escapeClassName(className)} { background-color: ${match[1].replace(/_/g, ' ')}; }`;
  const bgColorMap = {
    'bg-red-500': '#f56565',
    'bg-blue-500': '#4299e1',
    'bg-green-500': '#48bb78',
    'bg-yellow-500': '#ecc94b',
  };
  if (bgColorMap[className])
    return `.${className} { background-color: ${bgColorMap[className]}; }`;

  match = className.match(/^gap-\[(.+?)\]$/);
  if (match)
    return `.${escapeClassName(className)} { gap: ${match[1].replace(/_/g, ' ')}; }`;
  const gapMapping = {
    'gap-0': '0px',
    'gap-1': '0.25rem',
    'gap-2': '0.5rem',
    'gap-3': '0.75rem',
    'gap-4': '1rem',
    'gap-5': '1.25rem',
    'gap-6': '1.5rem',
    'gap-7': '1.75rem',
    'gap-8': '2rem',
    'gap-9': '2.25rem',
    'gap-10': '2.5rem',
  };
  if (gapMapping[className])
    return `.${className} { gap: ${gapMapping[className]}; }`;

  return null;
}

// ------------------------------
// MAIN PROCESS
// ------------------------------

/**
 * Main function that processes files in the target directory,
 * extracts Tailwind-like classes, and generates the CSS file.
 */
function main() {
  const files = globSync(pattern);
  files.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      extractClasses(content);
      extractPredefinedClasses(content);
      extractAdditionalClasses(content);
      if (path.extname(file) === '.scss') {
        extractApplyClasses(content);
      }
    } catch (error) {
      console.error('Error reading file:', file, error);
    }
  });

  const cssRules = [];
  classSet.forEach((cls) => {
    const rule = generateCssForClass(cls);
    if (rule) cssRules.push(rule);
  });

  // Prepend a :root rule to define --spacing.
  const rootRule = `:root { --spacing: 1px; }`;
  const outputCss = rootRule + '\n\n' + cssRules.join('\n\n');

  fs.writeFileSync(outputCssFile, outputCss, 'utf8');
  console.log(`CSS file generated: ${outputCssFile}`);
}

// Execute the main process.
main();
