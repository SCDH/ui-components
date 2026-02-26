import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'

// Initialize MSW for Storybook (intercepts HTTP requests in the browser)
initialize()

// Import component library styles (will be in npm package)
import '../src/styles.css'

// Import Storybook-specific preview styles (NOT in npm package)
import './preview.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  // MSW loader: enables per-story request handlers
  loaders: [mswLoader],
};

export default preview;
