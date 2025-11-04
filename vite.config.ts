/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import dts from 'vite-plugin-dts';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig(({ mode }) => {
  // Library build configuration
  if (mode === 'lib') {
    return {
      plugins: [
        react(),
        dts({
          include: ['src/index.ts', 'src/components/**/*.{ts,tsx}', 'src/lib/**/*.{ts,tsx}'],
          exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
          outDir: 'dist',
          tsconfigPath: './tsconfig.app.json',
        })
      ],
      build: {
        lib: {
          entry: path.resolve(dirname, 'src/index.ts'),
          name: 'SCDHUIComponents',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
        },
        rollupOptions: {
          // Externalize peer dependencies to avoid bundling them
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            },
            // Preserve module structure for better tree-shaking
            preserveModules: false,
          }
        },
        sourcemap: true,
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          "@": path.resolve(dirname, "./src"),
        },
      },
    };
  }

  // Default dev/storybook configuration
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(dirname, "./src"),
      },
    },
    test: {
      projects: [{
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }]
    }
  };
});
