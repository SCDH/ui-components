# SCDH UI Components

A modern, accessible UI component library for library contexts and web applications. Developed at the **Service Center for Digital Humanities (SCDH)** at the University of Münster.

With the integration of **Design Tokens** (compatible with Penpot) and **Tailwind CSS**, this library provides a highly flexible foundation for consistent user interfaces.

## 📦 Components

The library consists of base components, SCDH-specific components, and two **Composites** (aggregations of multiple components that demonstrate how they work together).

### Base Components

These components live in [`src/components/ui/`](src/components/ui/) and form the fundamental building blocks:

| Component | Description |
| --------- | ------------ |
| `Accordion` | Collapsible content sections. |
| `Badge` | Small status or label elements. |
| `Button` | Buttons in various variants. |
| `Card` | Container for grouped content. |
| `Checkbox` | Multi-select field. |
| `Field` | Form field with label, description, and error state. |
| `Input` | Single-line input field. |
| `Label` | Label for form elements. |
| `RadioGroup` | Group of single-select fields. |
| `Separator` | Visual divider. |
| `Sheet` | Side overlay panel (e.g., for mobile navigation). |
| `TreeView` | Hierarchical representation of data (base variant). |

### SCDH Components

These components live in [`src/components/ui/scdh/`](src/components/ui/scdh/) and are tailored to the requirements of library and digital humanities systems:

| Component | Description |
| --------- | ------------ |
| `TreeView` | Hierarchical representation of collections or classifications (SCDH variant with custom icons and defaults). |
| `PageView` | Standardized layouts for detail and list views. |
| `SearchBar` | Optimized search fields for library portals. |
| `Facet` | A single facet for filtering search results. |
| `ListItem` | List entry with tags and actions. |
| `Header` | Header with logo and title (`HeaderLogo`, `HeaderTitle`). |
| `Menubar` | Navigation bar (`MenubarItems`, `MenubarItem`, `MenubarActions`). |
| `Sidebar` | Sidebar (`SidebarToggle`, `SidebarContent`). |
| `Footer` | Footer. |

### Composites

Composites bundle multiple components into a cohesive, reusable building block:

| Composite | Description |
| --------- | ------------ |
| `FacetSearch` | Complete faceted search: combines `SearchBar`, `Facet`, and `ListItem` with a search service (`SearchServiceProvider`, `useSearchService`, `useSearchFacets`). |
| `AppLayout` | Complete app layout: combines `Header`, `Menubar`, `Sidebar`, `Footer`, and a responsive `Sheet` for mobile navigation. |

---

## 🧑‍💻 For Developers: Contributing

### Prerequisites

- **Node.js** (current LTS version)
- **pnpm** (recommended, see [pnpm.io/motivation](https://pnpm.io/motivation))

Installing pnpm:

```bash
# Linux / macOS
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Windows (PowerShell)
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

### Setting up the development environment

```bash
# Install dependencies
pnpm install

# Start Storybook (interactive development environment)
pnpm run storybook
```

Then open <http://localhost:6006> to see the components.

### Useful scripts

| Command | Description |
| ------ | ------------ |
| `pnpm run storybook` | Starts Storybook with Hot Module Replacement. |
| `pnpm run build` | Builds the NPM package (library build) into `dist/`. |
| `pnpm run build:app` | Builds the demo app. |
| `pnpm run lint` | Runs ESLint. |
| `pnpm test` | Runs the Vitest tests (including Storybook interaction tests). |
| `pnpm tokens:build` | Transforms and integrates design tokens (see the Design section). |

### Storybook & tests

Each component has a `.stories.tsx` file in [`src/stories/`](src/stories/). These define the various states (stories) of the component. Changes are immediately visible in Storybook via Hot Module Replacement.

In addition, we use **Play functions** in the stories to automatically simulate complex user interactions. These interaction tests are run via **Vitest**:

```bash
# Run all tests
pnpm test

# Test a specific file
pnpm test path/to/file.stories.tsx
```

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🚀 For Users: Using the NPM package

This repository is the basis for an **NPM package**. You can use the components directly in your own app.

### Installation

```bash
pnpm add @scdh_muenster/ui-components
```

### Importing styles

Import the compiled styles in your app entry point:

```ts
import '@scdh_muenster/ui-components/styles.css'
```

### Using components

```tsx
import { Button, Badge, SearchBar, FacetSearch } from '@scdh_muenster/ui-components'

export function MyApp() {
  return (
    <div>
      <Button>Let's go</Button>
      <Badge>New</Badge>
      <SearchBar onSearch={(query) => console.log(query)} />
    </div>
  )
}
```

### Notes

- The library uses **Tailwind CSS 4** with CSS-first theme configuration. No consumer-side Tailwind config preset is required.
- `react` and `react-dom` are **peer dependencies** and must be present in your app (version `^18` or `^19`).
- The styles are provided via `@scdh_muenster/ui-components/styles.css`.

---

## 🎨 For Designers: Design guidelines

### Tailwind

The library uses Tailwind CSS 4 with **CSS-first theme configuration**. The theme variables are defined in [`src/styles.css`](src/styles.css) via `@theme inline` and exposed as utility classes:

```css
@theme inline {
  --color-scdh-blue-500: hsl(var(--scdh-blue-500));
}
```

In code, you then use the generated utility classes:

```tsx
<button className="bg-scdh-blue-500 text-white rounded-lg px-4 py-2">
  Action
</button>
```

No separate Tailwind config file is needed – everything runs through the CSS variables in `styles.css`.

### styles.css

[`src/styles.css`](src/styles.css) is the **single source of truth** for the design system. It contains:

- `@import "tailwindcss"` and `@import "tw-animate-css"`
- `@theme inline` mappings (CSS variables → Tailwind utilities)
- `@font-face` definitions (e.g., `Metawebpro`, `WWU Symbol`)
- `@layer base` with `:root` and `.dark` variables (colors, radii, etc.)

> ⚠️ **Important:** `src/styles.css` is automatically generated by `design_system/scripts/integrate-tokens.ts` and must **not** be edited manually – changes will be overwritten. Instead, edit [`src/styles.template`](src/styles.template) (base styles and shadcn/ui configuration).

### PenPot import

The importer from a design system tool (currently **PenPot**) lives in the [`design_system/`](design_system/) directory. Here's how the import works:

1. **Export tokens:** Export your design tokens from PenPot as a JSON file.
2. **Place the JSON:** Save the file as `tokens.json` in [`design_system/input/`](design_system/input/).
3. **Run the build script:**

   ```bash
   pnpm tokens:build
   ```

   This runs two scripts:
   - `tokens:transform` (`design_system/scripts/transform-tokens.ts`): Converts the tokens into CSS variables and Tailwind theme variables.
   - `tokens:integrate` (`design_system/scripts/integrate-tokens.ts`): Integrates the generated tokens into `src/styles.css`.

4. **Result:**
   - The generated CSS variables land in [`design_system/output/generated-tokens.css`](design_system/output/generated-tokens.css).
   - The Tailwind theme variables are written into `src/styles.css`.

5. **Verify:** Check the changes afterwards in Storybook.

### What to keep in mind for the components

- **Styling via Tailwind classes:** Components are styled with Tailwind utility classes, not their own CSS files.
- **`cn()` utility:** Use the `cn()` function from [`src/lib/utils.ts`](src/lib/utils.ts) to combine classes intelligently and avoid conflicts.
- **Accessibility:** The components are based on proven patterns (including **Radix UI**). Keep the underlying ARIA attributes and keyboard navigation intact.
- **Design tokens:** Use central tokens (e.g., `bg-scdh-blue-500`) instead of hardcoded colors to keep the design consistent.
- **Maintain stories:** Every new or changed component should have a `.stories.tsx` file in [`src/stories/`](src/stories/) so the component is documented and tested in Storybook.
