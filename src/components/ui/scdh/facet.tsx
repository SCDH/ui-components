

/**
 * Single facet item data structure
 * Represents a term with its occurrence count
 */
export interface FacetItem {
  /** Unique identifier for the facet item */
  id: string
  
  /** The facet term/label (e.g., "JavaScript", "TypeScript") */
  label: string
  
  /** Number of occurrences in search results */
  count: number
}

/**
 * Props for the Facet component
 */
export interface FacetProps {
  /** Array of facet items to display */
  items: FacetItem[]
  
  /** Optional CSS class for styling */
  className?: string
}
