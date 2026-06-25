/**
 * SCDH UI Components Library
 *
 * Main entry point for the SCDH UI Components library.
 * This file exports all components, utilities, and types for external use.
 */

// Import styles - will be compiled to CSS during build
import './styles.css'

// Export all SCDH components
export * from './components/ui/scdh'

// Export utility functions
export { cn } from './lib/utils'

// Re-export commonly used types for convenience
export type {
  TreeViewProps,
  SCDHTreeDataItem as TreeDataItem,
  PageViewProps,
  PageViewSection,
  SearchBarProps,
  ListItemProps,
  ListItemTag,
  ListItemAction,
  FacetSearchProps,
  SearchService,
  SearchRequest,
  SearchResponse,
  FacetDefinition,
  UseSearchFacetsReturn,
  MenubarItemProps
} from './components/ui/scdh'
