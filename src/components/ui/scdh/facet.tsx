import * as React from 'react'
import { cn } from '@/lib/utils'
import { FieldGroup } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'

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
  
  /** Optional title for the facet */
  title?: string
  
  /** Optional CSS class for styling */
  className?: string
}

/**
 * 
 * Displays a list of facet items with their counts.
 * This is the foundation for a search facet component commonly used
 * in search interfaces to show term frequencies.
 * 
 * @example
 * ```tsx
 * <Facet 
 *   title="Programming Languages"
 *   items={[
 *     { id: '1', label: 'JavaScript', count: 42 },
 *     { id: '2', label: 'TypeScript', count: 15 }
 *   ]}
 * />
 * ```
 */
export const Facet = React.forwardRef<HTMLDivElement, FacetProps>(
  ({ items, title, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col', className)}>
        {/* Title with item count */}
        {title && (
          <>
            <h3 className="text-base font-semibold text-foreground mb-3">
              {title}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({items.length})
              </span>
            </h3>
            <Separator className="mb-4" />
          </>
        )}
        
        {/* Facet items list */}
        <FieldGroup className="gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 text-sm"
            >
              {/* Term/Label */}
              <span className="flex-1 font-medium text-foreground">
                {item.label}
              </span>
              
              {/* Count */}
              <span className="text-muted-foreground">
                ({item.count})
              </span>
            </div>
          ))}
        </FieldGroup>
      </div>
    )
  }
)

Facet.displayName = 'Facet'
