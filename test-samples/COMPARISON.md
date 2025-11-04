# Tailwind2CSS - Sample Test Comparison

This document shows the conversion results for flex and grid layouts.

## Test Summary

- **Files Processed**: 2 (flex-sample.html, grid-sample.html)
- **Classes Extracted**: 66 unique classes
- **CSS Rules Generated**: 66 rules

---

## GRID CLASSES (NEW FEATURE)

### Grid Display & Templates

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `grid` | `display: grid;` |
| `grid-cols-2` | `grid-template-columns: repeat(2, minmax(0, 1fr));` |
| `grid-cols-3` | `grid-template-columns: repeat(3, minmax(0, 1fr));` |
| `grid-cols-4` | `grid-template-columns: repeat(4, minmax(0, 1fr));` |
| `grid-rows-2` | `grid-template-rows: repeat(2, minmax(0, 1fr));` |
| `grid-rows-3` | `grid-template-rows: repeat(3, minmax(0, 1fr));` |

### Grid Column Span & Positioning

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `col-span-2` | `grid-column: span 2 / span 2;` |
| `col-span-3` | `grid-column: span 3 / span 3;` |
| `col-span-full` | `grid-column: 1 / -1;` |
| `col-auto` | `grid-column: auto;` |
| `col-start-1` | `grid-column-start: 1;` |
| `col-start-3` | `grid-column-start: 3;` |
| `col-end-3` | `grid-column-end: 3;` |
| `col-end-5` | `grid-column-end: 5;` |

### Grid Row Span & Positioning

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `row-span-2` | `grid-row: span 2 / span 2;` |
| `row-span-full` | `grid-row: 1 / -1;` |
| `row-auto` | `grid-row: auto;` |
| `row-start-1` | `grid-row-start: 1;` |
| `row-start-2` | `grid-row-start: 2;` |
| `row-end-3` | `grid-row-end: 3;` |
| `row-end-4` | `grid-row-end: 4;` |

### Grid Flow & Auto Sizing

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `grid-flow-row` | `grid-auto-flow: row;` |
| `grid-flow-col` | `grid-auto-flow: column;` |
| `auto-cols-auto` | `grid-auto-columns: auto;` |
| `auto-cols-fr` | `grid-auto-columns: minmax(0, 1fr);` |
| `auto-rows-min` | `grid-auto-rows: min-content;` |

---

## FLEX CLASSES (EXISTING FEATURE)

### Flex Display & Direction

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `flex` | `display: flex;` |
| `flex-row` | `flex-direction: row;` |
| `flex-col` | `flex-direction: column;` |
| `flex-wrap` | `flex-wrap: wrap;` |

### Flex Items

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `flex-auto` | `flex: 1 1 auto;` |
| `flex-initial` | `flex: 0 1 auto;` |
| `flex-none` | `flex: none;` |
| `flex-1` | `flex: 1;` |
| `flex-2` | `flex: 2;` |

### Justify Content

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `justify-center` | `justify-content: center;` |
| `justify-between` | `justify-content: space-between;` |
| `justify-evenly` | `justify-content: space-evenly;` |

### Align Items

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `items-center` | `align-items: center;` |
| `items-stretch` | `align-items: stretch;` |
| `items-baseline` | `align-items: baseline;` |

### Align Self

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `self-start` | `align-self: flex-start;` |
| `self-center` | `align-self: center;` |
| `self-end` | `align-self: flex-end;` |

---

## SPACING CLASSES (EXISTING FEATURE)

### Gap

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `gap-2` | `gap: 0.5rem;` |
| `gap-3` | `gap: 0.75rem;` |
| `gap-4` | `gap: 1rem;` |
| `gap-6` | `gap: 1.5rem;` |
| `gap-8` | `gap: 2rem;` |

### Padding

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `p-1` | `padding: 0.25rem;` |
| `p-2` | `padding: 0.5rem;` |
| `p-3` | `padding: 0.75rem;` |
| `p-4` | `padding: 1rem;` |
| `p-6` | `padding: 1.5rem;` |
| `px-2` | `padding-inline: 0.5rem;` |
| `px-3` | `padding-inline: 0.75rem;` |
| `px-4` | `padding-inline: 1rem;` |
| `py-2` | `padding-block: 0.5rem;` |
| `py-3` | `padding-block: 0.75rem;` |
| `py-4` | `padding-block: 1rem;` |

### Margin

| Tailwind Class | Generated CSS |
|---------------|---------------|
| `m-1` | `margin: 0.25rem;` |
| `m-2` | `margin: 0.5rem;` |
| `m-3` | `margin: 0.74rem;` |
| `m-4` | `margin: 1rem;` |
| `mx-2` | `margin-inline: 0.5rem;` |
| `my-4` | `margin-block: 1rem;` |

---

## Example Conversions

### Grid Layout Example

**HTML Input:**
```html
<div class="grid grid-cols-3 grid-rows-2 gap-4 p-4">
    <div class="col-span-2 p-2">Spans 2 columns</div>
    <div class="row-span-2 p-2">Spans 2 rows</div>
</div>
```

**CSS Output:**
```css
.grid { display: grid; }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-rows-2 { grid-template-rows: repeat(2, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.p-4 { padding: 1rem; }
.col-span-2 { grid-column: span 2 / span 2; }
.p-2 { padding: 0.5rem; }
.row-span-2 { grid-row: span 2 / span 2; }
```

### Flex Layout Example

**HTML Input:**
```html
<div class="flex flex-row justify-center items-center gap-4">
    <div class="flex-auto p-4 m-2">Auto flex item</div>
    <div class="flex-none p-3 m-3">None flex item</div>
</div>
```

**CSS Output:**
```css
.flex { display: flex; }
.flex-row { flex-direction: row; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
.gap-4 { gap: 1rem; }
.flex-auto { flex: 1 1 auto; }
.p-4 { padding: 1rem; }
.m-2 { margin: 0.5rem; }
.flex-none { flex: none; }
.p-3 { padding: 0.75rem; }
.m-3 { margin: 0.74rem; }
```

---

## Summary

✅ **Grid support successfully added** - All major grid utilities are now supported
✅ **Flex support maintained** - All existing flex utilities continue to work
✅ **Spacing utilities work** - Gap, padding, and margin classes work with both grid and flex
✅ **Simple regex-based extraction** - Following the same pattern as flex classes
✅ **Clean CSS output** - Each class generates appropriate CSS rules
