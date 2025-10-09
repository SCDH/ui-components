# UI Components for SCDH

## Getting Started as a Designer

### Prerequirements

1. NodeJS
2. Either npm (comes with node) or pnpm

Why we recommend using pnpm? See: https://pnpm.io/motivation  

On Windows, use PowerShell `Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression`  

On Linux/Mac, use `curl -fsSL https://get.pnpm.io/install.sh | sh -`  

### Quick Setup
1. Install dependencies: `pnpm install`
2. Start Storybook: `pnpm run storybook`
3. Open http://localhost:6006 to see components

### Styling the Button Exmample Component

#### Where to make design changes:
- **Main Button Component**: [`src/components/ui/scdh/button.tsx`](src/components/ui/scdh/button.tsx)
- **Global Fonts & Colors**: [`src/index.css`](src/index.css)
- **Tailwind Config**: [`tailwind.config.js`](tailwind.config.js)

#### How to customize:

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

**Fonts**: Already configured in [`src/index.css`](src/index.css) - Metawebpro is applied globally.

#### Tailwind Classes Cheatsheet:
- **Colors**: `bg-blue-500`, `text-white`, `border-gray-300`
- **Spacing**: `p-4` (padding), `m-2` (margin), `px-6` (horizontal padding)
- **Sizing**: `w-full` (width), `h-10` (height)
- **Border**: `rounded-lg` (8px), `rounded-md` (6px), `border-2`
- **Typography**: `text-sm`, `text-base`, `font-medium`, `font-bold`

#### Workflow:
1. Edit [`button.tsx`](src/components/ui/scdh/button.tsx) with Tailwind classes
2. Save file → Storybook auto-reloads
3. Test different button variants in Storybook
4. Add custom colors to [`tailwind.config.js`](tailwind.config.js) if needed

**Tip**: Use browser DevTools to inspect generated CSS and fine-tune classes!
