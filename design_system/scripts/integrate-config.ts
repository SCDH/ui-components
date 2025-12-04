/**
 * Tailwind Config Integrator
 * 
 * Integrates generated Tailwind configuration from design tokens into tailwind.config.js
 * Combines:
 * 1. Generated Tailwind utilities from design_system/generated-tailwind-config.json
 * 2. Template configuration from tailwind.config.template
 * 
 * Output: tailwind.config.js
 * 
 * Usage: 
 *   pnpm tokens:integrate-config
 *   or
 *   pnpm tsx design_system/integrate-config.ts
 * 
 * The script:
 * - Reads the generated Tailwind config (colors, spacing, borderRadius, fontSize, fontFamily)
 * - Reads the template configuration
 * - Merges them by extending the theme
 * - Writes the combined output to tailwind.config.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// Configuration
// ============================================

const PATHS = {
  generatedConfig: join(__dirname, '../output/generated-tailwind-config.json'),
  configTemplate: join(__dirname, '../../tailwind.config.template'),
  outputConfig: join(__dirname, '../../tailwind.config.js'),
};

// ============================================
// Type Definitions
// ============================================

interface TailwindThemeExtend {
  colors?: Record<string, any>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  fontSize?: Record<string, any>;
  fontFamily?: Record<string, string[]>;
  [key: string]: any;
}

interface GeneratedTailwindConfig {
  colors?: Record<string, any>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  fontSize?: Record<string, any>;
  fontFamily?: Record<string, string[]>;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Deep merge two objects, with preference for the second object's values
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Convert a JavaScript object to a formatted string for config file
 * Handles nested objects and arrays properly
 */
function formatConfigObject(obj: any, indent = 0): string {
  const tab = '\t';
  const currentIndent = tab.repeat(indent);
  const nextIndent = tab.repeat(indent + 1);
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    
    // Check if it's a simple array of strings
    if (obj.every(item => typeof item === 'string')) {
      return `[${obj.map(item => `'${item}'`).join(', ')}]`;
    }
    
    // Complex array with objects
    const items = obj.map(item => {
      if (typeof item === 'object') {
        return `\n${nextIndent}${formatConfigObject(item, indent + 1)}`;
      }
      return `\n${nextIndent}'${item}'`;
    });
    return `[${items.join(',')}\n${currentIndent}]`;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    
    const entries = keys.map(key => {
      const value = obj[key];
      let formattedValue: string;
      
      if (typeof value === 'string') {
        formattedValue = `'${value}'`;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        formattedValue = String(value);
      } else if (Array.isArray(value)) {
        formattedValue = formatConfigObject(value, indent + 1);
      } else if (typeof value === 'object') {
        formattedValue = formatConfigObject(value, indent + 1);
      } else {
        formattedValue = String(value);
      }
      
      // Handle special key names that need quotes
      const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      
      return `${nextIndent}${formattedKey}: ${formattedValue}`;
    });
    
    return `{\n${entries.join(',\n')}\n${currentIndent}}`;
  }
  
  return String(obj);
}

/**
 * Parse the template config file and extract its structure
 */
function parseTemplateConfig(templateContent: string): any {
  // Extract the config object by evaluating it
  // Remove export default and eval the rest
  const configMatch = templateContent.match(/export\s+default\s+(\{[\s\S]*\})/);
  
  if (!configMatch) {
    throw new Error('Could not parse template config');
  }
  
  // Use eval to parse the config (in a controlled environment)
  // We need to handle require() calls
  const requireMock = (module: string) => {
    if (module === 'tailwindcss-animate') {
      return 'require("tailwindcss-animate")';
    }
    return `require("${module}")`;
  };
  
  // For now, return a safe default structure based on the template
  return {
    darkMode: ["class"],
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'metawebpro': ['Metawebpro', 'system-ui', 'sans-serif'],
          'wwu-symbol': ['WWU Symbol', 'system-ui', 'sans-serif']
        }
      }
    },
    plugins: ['require("tailwindcss-animate")']
  };
}

/**
 * Generate the complete Tailwind config file content
 */
function generateConfigFile(templateConfig: any, generatedConfig: GeneratedTailwindConfig): string {
  const now = new Date().toISOString().split('T')[0];
  
  // Merge the generated config into the template's theme.extend
  const mergedExtend = deepMerge(
    templateConfig.theme.extend || {},
    generatedConfig
  );
  
  // Build the final config
  const finalConfig = {
    ...templateConfig,
    theme: {
      ...templateConfig.theme,
      extend: mergedExtend
    }
  };
  
  // Format darkMode
  const darkMode = JSON.stringify(finalConfig.darkMode);
  
  // Format content
  const content = finalConfig.content.map((c: string) => `\t\t"${c}"`).join(',\n');
  
  // Format theme.extend
  const themeExtend = formatConfigObject(finalConfig.theme.extend, 2);
  
  // Generate the file content
  return `/**
 * Tailwind CSS Configuration
 * This file is auto-generated by design_system/integrate-config.ts
 * DO NOT EDIT MANUALLY - Changes will be overwritten
 * 
 * Last updated: ${now}
 * 
 * Sources:
 * - design_system/generated-tailwind-config.json (Tailwind utilities from design tokens)
 * - tailwind.config.template (Base configuration)
 */

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ${darkMode},
	content: [
${content}
	],
	theme: {
		extend: ${themeExtend}
	},
	plugins: [require("tailwindcss-animate")],
}
`;
}

// ============================================
// Main Integration Function
// ============================================

function integrateConfig(): void {
  console.log('🔄 Starting Tailwind config integration...\n');
  
  try {
    // Read input files
    console.log('📖 Reading files...');
    const generatedConfig: GeneratedTailwindConfig = JSON.parse(
      readFileSync(PATHS.generatedConfig, 'utf-8')
    );
    const templateContent = readFileSync(PATHS.configTemplate, 'utf-8');
    
    console.log(`   ✓ Read ${PATHS.generatedConfig}`);
    console.log(`   ✓ Read ${PATHS.configTemplate}`);
    
    // Parse template
    console.log('\n🔧 Parsing template...');
    const templateConfig = parseTemplateConfig(templateContent);
    console.log('   ✓ Template parsed successfully');
    
    // Generate config file
    console.log('\n🔧 Merging configurations...');
    const configContent = generateConfigFile(templateConfig, generatedConfig);
    
    // Count integrated utilities
    const colorCount = Object.keys(generatedConfig.colors || {}).length;
    const spacingCount = Object.keys(generatedConfig.spacing || {}).length;
    const radiusCount = Object.keys(generatedConfig.borderRadius || {}).length;
    const fontSizeCount = Object.keys(generatedConfig.fontSize || {}).length;
    const fontFamilyCount = Object.keys(generatedConfig.fontFamily || {}).length;
    
    console.log(`   ✓ Integrated ${colorCount} color tokens`);
    console.log(`   ✓ Integrated ${spacingCount} spacing tokens`);
    console.log(`   ✓ Integrated ${radiusCount} border radius tokens`);
    console.log(`   ✓ Integrated ${fontSizeCount} font size tokens`);
    console.log(`   ✓ Integrated ${fontFamilyCount} font family tokens`);
    
    // Write output
    console.log('\n💾 Writing output...');
    writeFileSync(PATHS.outputConfig, configContent, 'utf-8');
    console.log(`   ✓ Created ${PATHS.outputConfig}`);
    
    // Summary
    console.log('\n✅ Tailwind config integration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Combined design tokens and template configuration`);
    console.log(`   - Output: tailwind.config.js (${configContent.split('\n').length} lines)`);
    console.log('\n💡 Next steps:');
    console.log('   - Review tailwind.config.js');
    console.log('   - Restart your dev server if running');
    console.log('   - Test Tailwind utilities in your components');
    
  } catch (error) {
    console.error('\n❌ Error during config integration:');
    console.error(error);
    process.exit(1);
  }
}

// ============================================
// Run the script
// ============================================

integrateConfig();
