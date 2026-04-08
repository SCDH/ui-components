# UI Components for Library Frontends

Developed at the Service Center for Digital Humanities at the University of Muenster

---

## Getting Started as a Developer

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

### Working with Storybook

Storybook serves as an interactive development environment and documentation for our UI components. It allows us to view components in isolation, visualize different states (stories), and test them interactively in the browser without needing to start the full application.

Each component has a corresponding `.stories.tsx` file located in the `src/stories/` directory. These files define the various configurations (props) of the component. Changes made to these stories are instantly reflected in the Storybook interface at `http://localhost:6006` via Hot Module Replacement.

Additionally, we utilize **Play functions** within stories to automatically simulate complex user interactions. These interaction tests ensure that functional workflows, such as form inputs or button clicks, remain stable even after code changes.

### Testing from the CLI

We use **Vitest** to run tests and validate our Storybook interaction tests (Play functions) from the command line.

- **Run all tests**: `pnpm test`
- **Watch mode** (re-runs on changes): `pnpm vitest`
- **Run specific file**: `pnpm test path/to/file.stories.tsx`

This ensures that all interactive components (like `FacetSearch`) still work correctly after data or logic changes.

---

## Manual for Designers

Guidelines for customizing the library UI components.

### 1. Where to Start?

Manage the global design system through these files:

- **Design Tokens (CSS Variables)**: [`src/styles.css`](src/styles.css) - *Single Source of Truth*.
- **Tailwind Configuration**: [`tailwind.config.js`](tailwind.config.js) - *Mapping tokens to utility classes*.
- **Individual Components**: [`src/components/ui/scdh/`](src/components/ui/scdh/) - *Specific logic and layout*.

### 2. The Styling Workflow

#### Step A: Define Tokens (CSS)

Add or update brand colors and variables in [`src/styles.css`](src/styles.css):

```css
@layer base {
  :root {
    --scdh-blue: 201 68% 78%; /* HSL values without 'hsl()' */
  }
}
```

#### Step B: Register in Tailwind

Map your CSS variables to Tailwind utility classes in [`tailwind.config.js`](tailwind.config.js):

```js
colors: {
  'scdh-blue': 'hsl(var(--scdh-blue))',
}
```

#### Step C: Apply to Components

Use the generated utility classes (e.g., `bg-scdh-blue`) in your component's TSX files:

```tsx
<button className="bg-scdh-blue text-white rounded-lg px-4 py-2">
  Action
</button>
```

### 3. Syncing with Penpot (Design Tokens)

We use automated scripts to transform Design Tokens from Penpot into our CSS and Tailwind configuration.

#### Workflow

1. **Export Tokens**: Export your design tokens from Penpot as a JSON file.
2. **Place JSON**: Save the exported file as `tokens.json` in [`design_system/input/`](design_system/input/).
3. **Run Build Script**: Execute the following command in your terminal:

   ```bash
   pnpm tokens:build
   ```

   *This runs three sub-scripts: `transform`, `integrate` (CSS), and `integrate-config` (Tailwind).*
4. **Output**:
   - The generated CSS variables will appear in `design_system/output/generated-tokens.css`.
   - The Tailwind configuration is updated in `design_system/output/generated-tailwind-config.json`.
5. **Final Step**: Verify the changes in Storybook. The scripts are designed to automatically update the project's styling source files.

### 4. File Responsibility

| File | Purpose |
|------|---------|
| [`styles.css`](src/styles.css) | Global tokens, font definitions, and base layer styles. |
| [`tailwind.config.js`](tailwind.config.js) | Theme extension and utility class generation. |
| `preview.css` | Storybook-specific canvas and layout styling. |
| `*.tsx` | Component-specific styling via Tailwind classes. |
| [`design_system/`](design_system/) | Source and scripts for syncing with Penpot. |
