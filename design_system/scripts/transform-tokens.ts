/**
 * Design Token Transformer
 *
 * Transforms Penpot design tokens (JSON) into:
 * 1. CSS Custom Properties for styles.css
 * 2. Tailwind CSS theme variables for the CSS-first configuration
 *
 * Usage:
 *   pnpm tokens:transform
 *   or
 *   pnpm tsx design_system/transform-tokens.ts
 *
 * Features:
 * - Converts hex colors to HSL format for CSS variables
 * - Resolves token references (e.g., {scdh.blue.500})
 * - Generates both CSS Custom Properties and Tailwind utility classes
 * - Supports colors, spacing, border radius, font sizes, and font families
 *
 * Extending the script:
 * - Add new token type processors (e.g., shadows, transitions) in the transform function
 * - Adjust hex-to-HSL conversion if needed for your design system
 * - Modify CSS variable naming convention in generateCSSVarName()
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ============================================
// Type Definitions
// ============================================

interface TokenValue {
  $value: string | string[]
  $type: string
  $description?: string
}

interface TokenSet {
  [key: string]: TokenValue | TokenSet
}

type ThemeValue = string | { [key: string]: ThemeValue }

interface DesignTokens {
  Global: TokenSet
  SCDH: TokenSet
  [key: string]: TokenSet
}

interface TransformedTokens {
  cssVariables: {
    light: string[]
    dark: string[]
  }
  tailwindConfig: {
    colors: Record<string, ThemeValue>
    spacing: Record<string, string>
    borderRadius: Record<string, string>
    fontSize: Record<string, [string, { lineHeight?: string; fontWeight?: string }]>
    fontFamily: Record<string, string[]>
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Converts hex color to HSL format for CSS variables
 * Example: #daebff -> 211 77% 93%
 * Special cases: #fff -> 0 0% 100% (white), #000 -> 0 0% 0% (black)
 */
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')

  // Handle 3-digit hex codes (e.g., #fff -> #ffffff)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('')
  }

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Find min and max values
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  // else: h = 0, s = 0 (grayscale: white, black, or gray)

  // Convert to degrees and percentages
  const hDeg = Math.round(h * 360)
  const sPercent = Math.round(s * 100)
  const lPercent = Math.round(l * 100)

  return `${hDeg} ${sPercent}% ${lPercent}%`
}

/**
 * Resolves token references like {scdh.blue.500}
 */
function resolveTokenReference(value: string, tokens: DesignTokens): string {
  if (!value.startsWith('{') || !value.endsWith('}')) {
    return value
  }

  const path = value.slice(1, -1).split('.')
  let current: TokenSet | TokenValue = tokens

  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as TokenSet)[key] as TokenSet | TokenValue
    } else {
      console.warn(`Could not resolve token reference: ${value}`)
      return value
    }
  }

  if ('$value' in current && typeof current.$value === 'string') {
    return current.$value
  }

  return value
}

/**
 * Generates CSS variable name from token path
 * Example: ['blue', '500'] -> --blue-500
 *          ['scdh', 'blue', '500'] -> --scdh-blue-500
 */
function generateCSSVarName(path: string[]): string {
  return `--${path.join('-').toLowerCase()}`
}

/**
 * Processes color tokens recursively
 */
function processColorTokens(
  tokens: TokenSet,
  path: string[],
  allTokens: DesignTokens,
  cssVars: string[],
  tailwindColors: Record<string, ThemeValue>
): void {
  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = [...path, key]

    // Skip metadata keys
    if (key.startsWith('$')) continue

    // Check if this is a token value or nested object
    if (value && typeof value === 'object' && '$value' in value && '$type' in value) {
      const tokenValue = value as TokenValue

      if (tokenValue.$type === 'color') {
        const colorValue = resolveTokenReference(tokenValue.$value as string, allTokens)

        // Convert hex to HSL for CSS variables
        if (colorValue.startsWith('#')) {
          const hslValue = hexToHSL(colorValue)
          const varName = generateCSSVarName(currentPath)

          // Add to CSS variables
          cssVars.push(`    ${varName}: ${hslValue};`)

          // Add to Tailwind config (references CSS var)
          // Skip 'Global' and 'SCDH' prefixes but keep the rest
          const tailwindPath = currentPath.filter(
            segment => segment !== 'Global' && segment !== 'SCDH'
          )

          // If we have a color name that's not grouped (e.g., just a number like '100')
          // we should group it under the parent color name
          if (tailwindPath.length === 1 && /^\d/.test(tailwindPath[0])) {
            // This is an ungrouped numeric shade, skip it or handle specially
            console.warn(`Skipping ungrouped color shade: ${tailwindPath[0]}`)
            continue
          }

          let current = tailwindColors

          for (let i = 0; i < tailwindPath.length - 1; i++) {
            const segment = tailwindPath[i]
            if (!current[segment] || typeof current[segment] === 'string') {
              current[segment] = {}
            }
            current = current[segment] as Record<string, ThemeValue>
          }

          const finalKey = tailwindPath[tailwindPath.length - 1]
          // Skip undefined or invalid keys
          if (finalKey === 'undefined' || !finalKey) {
            console.warn(`Skipping invalid color key: ${finalKey}`)
            continue
          }

          current[finalKey] = `hsl(var(${varName}))`
        }
      }
    } else if (value && typeof value === 'object') {
      // Recurse into nested tokens
      processColorTokens(value as TokenSet, currentPath, allTokens, cssVars, tailwindColors)
    }
  }
}

/**
 * Processes spacing tokens
 */
function processSpacingTokens(
  tokens: TokenSet,
  path: string[],
  allTokens: DesignTokens,
  cssVars: string[],
  tailwindSpacing: Record<string, string>
): void {
  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = [...path, key]

    if (key.startsWith('$')) continue

    if (value && typeof value === 'object' && '$value' in value && '$type' in value) {
      const tokenValue = value as TokenValue

      if (tokenValue.$type === 'spacing') {
        const spacingValue = resolveTokenReference(tokenValue.$value as string, allTokens)
        const varName = generateCSSVarName(currentPath)

        // Add to CSS variables
        cssVars.push(`    ${varName}: ${spacingValue};`)

        // Add to Tailwind config - use the numeric key directly
        const numericKey = currentPath[currentPath.length - 1]
        tailwindSpacing[numericKey] = `var(${varName})`
      }
    } else if (value && typeof value === 'object') {
      processSpacingTokens(value as TokenSet, currentPath, allTokens, cssVars, tailwindSpacing)
    }
  }
}

/**
 * Processes border radius tokens
 */
function processBorderRadiusTokens(
  tokens: TokenSet,
  path: string[],
  allTokens: DesignTokens,
  cssVars: string[],
  tailwindRadius: Record<string, string>
): void {
  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = [...path, key]

    if (key.startsWith('$')) continue

    if (value && typeof value === 'object' && '$value' in value && '$type' in value) {
      const tokenValue = value as TokenValue

      if (tokenValue.$type === 'borderRadius') {
        const radiusValue = resolveTokenReference(tokenValue.$value as string, allTokens)
        const varName = `--token-radius-${currentPath[currentPath.length - 1].toLowerCase()}`

        // Add to CSS variables
        cssVars.push(`    ${varName}: ${radiusValue};`)

        // Add to Tailwind config
        const radiusKey = currentPath[currentPath.length - 1]
        tailwindRadius[radiusKey] = `var(${varName})`
      }
    } else if (value && typeof value === 'object') {
      processBorderRadiusTokens(value as TokenSet, currentPath, allTokens, cssVars, tailwindRadius)
    }
  }
}

/**
 * Processes font size tokens
 */
function processFontSizeTokens(
  tokens: TokenSet,
  path: string[],
  allTokens: DesignTokens,
  cssVars: string[],
  tailwindFontSize: Record<string, [string, { lineHeight?: string }]>
): void {
  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = [...path, key]

    if (key.startsWith('$')) continue

    if (value && typeof value === 'object' && '$value' in value && '$type' in value) {
      const tokenValue = value as TokenValue

      if (tokenValue.$type === 'fontSizes') {
        let fontSize = resolveTokenReference(tokenValue.$value as string, allTokens)

        // Ensure px unit
        if (!fontSize.endsWith('px')) {
          fontSize = `${fontSize}px`
        }

        const varName = generateCSSVarName(currentPath)

        // Add to CSS variables
        cssVars.push(`    ${varName}: ${fontSize};`)

        // Add to Tailwind config
        const sizeKey = currentPath[currentPath.length - 1]
        tailwindFontSize[sizeKey] = [`var(${varName})`, { lineHeight: '1.5' }]
      }
    } else if (value && typeof value === 'object') {
      processFontSizeTokens(value as TokenSet, currentPath, allTokens, cssVars, tailwindFontSize)
    }
  }
}

/**
 * Processes font family tokens
 */
function processFontFamilyTokens(
  tokens: TokenSet,
  path: string[],
  allTokens: DesignTokens,
  tailwindFontFamily: Record<string, string[]>
): void {
  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = [...path, key]

    if (key.startsWith('$')) continue

    if (value && typeof value === 'object' && '$value' in value && '$type' in value) {
      const tokenValue = value as TokenValue

      if (tokenValue.$type === 'fontFamilies') {
        const fontFamily = Array.isArray(tokenValue.$value)
          ? tokenValue.$value
          : [tokenValue.$value as string]

        // Add fallback fonts
        const fontKey = currentPath[currentPath.length - 1]
        tailwindFontFamily[fontKey] = [...fontFamily, 'system-ui', 'sans-serif']
      }
    } else if (value && typeof value === 'object') {
      processFontFamilyTokens(value as TokenSet, currentPath, allTokens, tailwindFontFamily)
    }
  }
}

// ============================================
// Main Transformation Function
// ============================================

function transformTokens(tokens: DesignTokens): TransformedTokens {
  const result: TransformedTokens = {
    cssVariables: {
      light: [],
      dark: []
    },
    tailwindConfig: {
      colors: {},
      spacing: {},
      borderRadius: {},
      fontSize: {},
      fontFamily: {}
    }
  }

  // Process Global tokens
  if (tokens.Global) {
    // Colors
    processColorTokens(
      tokens.Global,
      [],
      tokens,
      result.cssVariables.light,
      result.tailwindConfig.colors
    )

    // Spacing
    if (tokens.Global.space) {
      processSpacingTokens(
        tokens.Global.space as TokenSet,
        ['space'],
        tokens,
        result.cssVariables.light,
        result.tailwindConfig.spacing
      )
    }

    // Border Radius
    if (tokens.Global.radius) {
      processBorderRadiusTokens(
        tokens.Global.radius as TokenSet,
        ['radius'],
        tokens,
        result.cssVariables.light,
        result.tailwindConfig.borderRadius
      )
    }

    // Font Sizes
    if (tokens.Global['font-size']) {
      processFontSizeTokens(
        tokens.Global['font-size'] as TokenSet,
        ['font-size'],
        tokens,
        result.cssVariables.light,
        result.tailwindConfig.fontSize
      )
    }

    // Font Family
    if (tokens.Global.font) {
      processFontFamilyTokens(
        tokens.Global.font as TokenSet,
        ['font'],
        tokens,
        result.tailwindConfig.fontFamily
      )
    }
  }

  // Process SCDH tokens (semantic tokens)
  if (tokens.SCDH) {
    processColorTokens(
      tokens.SCDH,
      ['scdh'],
      tokens,
      result.cssVariables.light,
      result.tailwindConfig.colors
    )
  }

  return result
}

// ============================================
// Output Generation
// ============================================

function generateCSSOutput(transformed: TransformedTokens): string {
  const themeLines: string[] = []

  function addThemeValues(
    namespace: string,
    values: Record<string, unknown>,
    path: string[] = []
  ): void {
    for (const [key, value] of Object.entries(values)) {
      const currentPath = [...path, key]

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        addThemeValues(namespace, value, currentPath)
        continue
      }

      const themeName = currentPath.join('-')
      if (namespace === 'text' && Array.isArray(value)) {
        themeLines.push(`  --text-${themeName}: ${value[0]};`)
        if (value[1]?.lineHeight) {
          themeLines.push(`  --text-${themeName}--line-height: ${value[1].lineHeight};`)
        }
      } else if (namespace === 'font' && Array.isArray(value)) {
        const families = value.map(family => (family.includes(' ') ? `'${family}'` : family))
        themeLines.push(`  --font-${themeName}: ${families.join(', ')};`)
      } else {
        themeLines.push(`  --${namespace}-${themeName}: ${value};`)
      }
    }
  }

  addThemeValues('color', transformed.tailwindConfig.colors)
  addThemeValues('spacing', transformed.tailwindConfig.spacing)
  addThemeValues('radius', transformed.tailwindConfig.borderRadius)
  addThemeValues('text', transformed.tailwindConfig.fontSize)
  addThemeValues('font', transformed.tailwindConfig.fontFamily)

  return `/* ============================================
   Design Tokens - CSS Custom Properties
   Generated from Penpot design tokens
   Last updated: ${new Date().toISOString().split('T')[0]}
   ============================================ */

@layer base {
  :root {
    /* Design System Colors */
${transformed.cssVariables.light.join('\n')}
  }
  
  /* Dark mode adjustments can be added here */
  .dark {
    /* Add dark mode color overrides as needed */
  }
}

@theme inline {
${themeLines.join('\n')}
}
`
}

// ============================================
// Main Execution
// ============================================

function main() {
  try {
    console.log('🎨 Starting Design Token Transformation...\n')

    // Read tokens.json
    const tokensPath = join(__dirname, '../input/tokens.json')
    const tokensContent = readFileSync(tokensPath, 'utf-8')
    const tokens: DesignTokens = JSON.parse(tokensContent)

    console.log('✅ Loaded tokens.json')

    // Transform tokens
    const transformed = transformTokens(tokens)

    console.log(`✅ Transformed ${transformed.cssVariables.light.length} CSS variables`)
    console.log(`✅ Generated Tailwind CSS theme with:`)
    console.log(`   - ${Object.keys(transformed.tailwindConfig.colors).length} color palettes`)
    console.log(`   - ${Object.keys(transformed.tailwindConfig.spacing).length} spacing values`)
    console.log(
      `   - ${Object.keys(transformed.tailwindConfig.borderRadius).length} border radius values`
    )
    console.log(`   - ${Object.keys(transformed.tailwindConfig.fontSize).length} font sizes`)
    console.log(`   - ${Object.keys(transformed.tailwindConfig.fontFamily).length} font families\n`)

    // Generate output files
    const cssOutput = generateCSSOutput(transformed)
    // Write CSS output
    const cssOutputPath = join(__dirname, '../output/generated-tokens.css')
    writeFileSync(cssOutputPath, cssOutput, 'utf-8')
    console.log(`✅ Generated CSS output: ${cssOutputPath}`)

    console.log('\n🎉 Transformation complete!')
    console.log('\n📝 Next steps:')
    console.log(
      '   1. Copy content from ../output/generated-tokens.css to src/styles.css (@layer base)'
    )
    console.log('   2. Review the generated CSS theme variables\n')
  } catch (error) {
    console.error('❌ Error during transformation:', error)
    process.exit(1)
  }
}

// Run the script
main()
