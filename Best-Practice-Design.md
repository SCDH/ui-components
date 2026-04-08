# Als Designer in Storybook.js starten

# Best Practice

1. Design Tokens in **styles.css** ablegen

```css
/* ...existing code... */
@layer base {
  :root {
    /* Example SCDH Brand Color Palette - Design Tokens */
    --scdh-blue: 201 68% 78%;           /* Main brand color */
    --scdh-blue-light: 201 68% 85%;     /* Lighter variant */
    --scdh-blue-dark: 201 68% 60%;      /* Darker variant */
    
    --scdh-text: 222 84% 5%;            /* Primary text color */
    --scdh-text-muted: 222 40% 40%;     /* Secondary text color */
    
    --scdh-green: 142 76% 36%;          /* Success/positive color */
    --scdh-red: 0 84% 60%;              /* Error/destructive color */
    --scdh-yellow: 43 96% 56%;          /* Warning color */
    
    /* ...existing code... */
  }
  
  /* Dark mode adjustments */
  .dark {
    --scdh-blue: 201 68% 70%;           /* Adjusted for dark backgrounds */
    --scdh-text: 222 84% 95%;           /* Light text for dark mode */
    /* ...existing code... */
  }
}
/* ...existing code... */
```

1. Falls notwendig, neue Utility Classes in **tailwind.config.js** definieren, ggf. mit den Variablen

```js
// ...existing code...
colors: {
  // Example SCDH Brand Colors - Using CSS variables from styles.css
  'scdh-blue': 'hsl(var(--scdh-blue))',
  'scdh-blue-light': 'hsl(var(--scdh-blue-light))',
  'scdh-blue-dark': 'hsl(var(--scdh-blue-dark))',
  
  'scdh-text': 'hsl(var(--scdh-text))',
  'scdh-text-muted': 'hsl(var(--scdh-text-muted))',
  
  'scdh-green': 'hsl(var(--scdh-green))',
  'scdh-red': 'hsl(var(--scdh-red))',
  'scdh-yellow': 'hsl(var(--scdh-yellow))',
  
  // shadcn/ui system colors (already present)
  background: 'hsl(var(--background))', 
  foreground: 'hsl(var(--foreground))',
  // ...existing code...
}
// ...existing code...
```

1. Einsatz in Components unter **ui/components/scdh**

Hier ist wichtig zu verstehen, dass Tailwind oft Präfixe verwendet, etwa "bg-" oder andere Namings hat, aus "border-radius" in CSS wird "rounded" in Tailwind. Am besten man macht sich mit der Doku gut vertraut.

```js
// Using the design tokens as utility classes
<div className="bg-scdh-blue text-scdh-text rounded-lg p-4">
  {/* Content with consistent brand colors */}
</div>

<button className="bg-scdh-green hover:bg-scdh-green/80 text-white">
  Success Action
</button>

<span className="text-scdh-text-muted">
  Secondary information
</span>
```

## Wichtig

* Single Source of Truth soll die styles.css (oder Kinder davon) sein
* Tailwind Utilities Classes kommen in tailwind.config.js und erweitern Tailwind bzw. das Theme

## Layer

In styles.css kann man auch die Layer Funktionalität von Tailwind nutzen.
Base wird immer zuerst angewendet - und ist für sehr allgemein Elemente wie body, a, li, h1 etc.
Die letzte Ebene sind sehr spezifische Styles (haben für das Element immer höchte Priorität), siehe:

```css
/* 1. Base Layer - Lowest specificity */
@layer base { /* ... */ }

/* 2. Components Layer */
@layer components { /* ... */ }

/* 3. Utilities Layer - Highest specificity */
@layer utilities { /* ... */ }

/* 4. Your custom CSS (highest priority) */
.my-custom-class { /* ... */ }
```

## What Goes Where?

| Type | `styles.css` | `preview.css` |
|------|--------------|---------------|
| Tailwind directives | ✅ | ❌ |
| Font definitions | ✅ | ❌ |
| CSS custom properties | ✅ | ❌ |
| Component base styles | ✅ | ❌ |
| Storybook canvas styling | ❌ | ✅ |
| Link/heading styles | ❌ | ✅ |
| Body layout | ❌ | ✅ |
| Dark mode (preview) | ❌ | ✅ |

---
