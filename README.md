# SCDH UI Components

A modern, accessible UI component library for library contexts and web applications. Developed at the **Service Center for Digital Humanities (SCDH)** at the University of Münster.

With the integration of **Design Tokens** (compatible with Penpot) and **Tailwind CSS**, this library provides a highly flexible foundation for consistent user interfaces.

## 🚀 Why this library?

This suite was specifically developed for the requirements of digital humanities and library systems:

- **Library Focus**: Includes specialized components such as `FacetSearch`, `TreeView`, and `SearchBar`, optimized for exploring large amounts of data.
- **Modern Tech Stack**: Based on **React**, **TypeScript**, and **Tailwind CSS**.
- **Accessibility**: Uses proven patterns (including those based on Radix UI) to ensure inclusive interfaces.
- **Themability**: Full support for design system tokens. Colors, spacing, and typography can be controlled centrally.
- **Quality Assurance**: Extensive documentation and testing via **Storybook** and **Interaction Testing**.

## 📦 Component Overview

The library offers a mix of basic primitives and complex domain components:

### Basic Components

`Button`, `Badge`, `Checkbox`, `Input`, `Label`, `Radio Group`, `Accordion`, `Card`, `Separator`.

### SCDH Special Components

- **FacetSearch**: Powerful filter interfaces for search results.
- **TreeView**: Hierarchical representation of collections or classifications.
- **SearchBar**: Optimized search inputs for library portals.
- **PageView**: Standardized layouts for detail and list views.

## 🛠 Integration

### Installation

```bash
pnpm add @scdh/ui-components
```

### Configuration

To ensure styles are loaded correctly, the Tailwind presets from the package must be included:

```js
// tailwind.config.ts / .js
export default {
  content: [
    // ... your files
    './node_modules/@scdh/ui-components/dist/**/*.js',
  ],
  // ... further configuration
}
```

## 📖 Documentation

Full interactive documentation, including code examples, can be found in our **Storybook**.

👉 COMING SOON...

---

## 🤝 Contributing & Development

Want to contribute to the library? You can find all information about local setup, build scripts, and the design token workflow in [CONTRIBUTING.md](CONTRIBUTING.md).
