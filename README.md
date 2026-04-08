# UI Components for SCDH

---

## Getting Started

### Prerequirements

1. NodeJS
2. Either npm (comes with node) or pnpm

Why we recommend using pnpm? See: <https://pnpm.io/motivation>  

On Windows, use PowerShell `Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression`  

On Linux/Mac, use `curl -fsSL https://get.pnpm.io/install.sh | sh -`  

### Quick Setup

1. Install dependencies: `pnpm install`
2. Start Storybook: `pnpm run storybook`
3. Open <http://localhost:6006> to see components

### Testing from the CLI

We use **Vitest** to run tests and validate our Storybook interaction tests (Play functions) from the command line.

- **Run all tests**: `pnpm test`
- **Watch mode** (re-runs on changes): `pnpm vitest`
- **Run specific file**: `pnpm test path/to/file.stories.tsx`

This ensures that all interactive components (like `FacetSearch`) still work correctly after data or logic changes.

---

## Brief overview for designers

### Designing

#### Where to make design changes?

- **Main Button Component**: [`src/components/ui/scdh/button.tsx`](src/components/ui/scdh/button.tsx)
- **Global Fonts & Colors**: [`src/styles.css`](src/styles.css)
- **Tailwind Config**: [`tailwind.config.js`](tailwind.config.js)

#### How to customize

**Colors**: Add custom colors in [`tailwind.config.js`](tailwind.config.js):

```js
colors: {
  'scdh-blue': 'rgba(159, 210, 237, 1)',
  'scdh-dark': '#333333'
}
```

**Button Styling**: Modify classes in [`button.tsx`](src/components/ui/scdh/button.tsx):

```tsx
// SCDH brand colors for default variant
variant === 'default' && [
  "bg-scdh-blue text-black",     // Background & text color
  "hover:bg-scdh-blue/80",       // Hover state
  "rounded-lg",                  // Border radius (8px)
]
```

## For npm Package Consumers (WIP)

```tsx
// Consumer's app
import '@scdh/ui-components/styles.css';
import { Button, TreeView } from '@scdh/ui-components';

function App() {
  return <Button>Click me</Button>;
}
```
