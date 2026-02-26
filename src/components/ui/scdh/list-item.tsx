import * as React from 'react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button, type ButtonProps } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Represents a single tag / badge shown below the description. */
export interface ListItemTag {
  /** Display label of the tag */
  readonly label: string
  /** Optional color class applied to the Badge (e.g. tailwind bg/text utilities) */
  readonly className?: string
}

/** Action button rendered in the top-right corner of the list item. */
export interface ListItemAction {
  /** Visible label or accessible aria-label for icon-only buttons */
  readonly label: string
  /** Optional icon element rendered inside the button */
  readonly icon?: React.ReactNode
  /** Button variant forwarded to the Button component */
  readonly variant?: ButtonProps['variant']
  /** Button size forwarded to the Button component */
  readonly size?: ButtonProps['size']
  /** Click handler */
  readonly onClick?: () => void
}

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL or element for the thumbnail image on the left */
  readonly thumbnail?: string | React.ReactNode
  /** Alt text for the thumbnail when a URL string is provided */
  readonly thumbnailAlt?: string
  /** Small meta text shown above the title (e.g. "hinzugefügt am 12.04.2025") */
  readonly meta?: string
  /** Main title of the list item */
  readonly title: string
  /** Subtitle / author line rendered below the title */
  readonly subtitle?: string
  /** Description text rendered below the subtitle */
  readonly description?: string
  /** Tags rendered as badges below the description */
  readonly tags?: readonly ListItemTag[]
  /** Action buttons rendered in the top-right corner */
  readonly actions?: readonly ListItemAction[]
}

// ---------------------------------------------------------------------------
// Sub-components (internal)
// ---------------------------------------------------------------------------

/** Renders the thumbnail area – either an <img> from a URL string or a custom ReactNode. */
function ListItemThumbnail({
  thumbnail,
  thumbnailAlt
}: Pick<ListItemProps, 'thumbnail' | 'thumbnailAlt'>) {
  if (!thumbnail) return null

  // Allow consumers to pass a fully custom element (e.g. an icon or SVG)
  if (typeof thumbnail !== 'string') {
    return (
      <div className="flex-shrink-0 h-[100px] w-[100px] overflow-hidden rounded-md bg-ulb-grey-100">
        {thumbnail}
      </div>
    )
  }

  return (
    <img
      src={thumbnail}
      alt={thumbnailAlt ?? ''}
      className="flex-shrink-0 h-[100px] w-[100px] rounded-md object-cover bg-ulb-grey-100"
    />
  )
}

/** Renders the action buttons in the top-right corner. */
function ListItemActions({ actions }: Pick<ListItemProps, 'actions'>) {
  if (!actions?.length) return null

  return (
    <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
      {actions.map(action => (
        <Button
          key={action.label}
          variant={action.variant ?? 'secondary'}
          size={action.icon && !action.label ? 'icon' : 'default'}
          onClick={action.onClick}
          aria-label={action.label}
        >
          {action.icon}
          {/* Only render label text when it is not an icon-only button */}
          {(!action.icon || action.label) && <span>{action.label}</span>}
        </Button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * ListItem – A search-result card displaying a thumbnail, metadata,
 * title, author, description, tags and action buttons.
 *
 * Follows the SCDH design system and utilises existing Badge and Button
 * components for consistent look-and-feel.
 */
const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      className,
      thumbnail,
      thumbnailAlt,
      meta,
      title,
      subtitle,
      description,
      tags,
      actions,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-[var(--space-linear-300)] rounded-xl border border-ulb-grey-200 bg-white p-[var(--space-linear-300)] font-metawebpro',
          className
        )}
        {...props}
      >
        {/* Thumbnail */}
        <ListItemThumbnail thumbnail={thumbnail} thumbnailAlt={thumbnailAlt} />

        {/* Content area */}
        <div className="flex flex-1 flex-col gap-[var(--space-linear-100)] min-w-0">
          {/* Top row: meta + actions */}
          <div className="flex items-start justify-between gap-[var(--space-linear-200)]">
            <div className="flex flex-col gap-[var(--space-linear-050)] min-w-0">
              {meta && (
                <span className="text-[length:var(--font-size-sm)] text-ulb-grey-500">{meta}</span>
              )}
              <h3 className="text-[length:var(--font-size-xl)] font-bold leading-tight truncate">
                {title}
              </h3>
            </div>

            <ListItemActions actions={actions} />
          </div>

          {/* Subtitle / author */}
          {subtitle && (
            <span className="text-[length:var(--font-size-md)] text-ulb-grey-600">{subtitle}</span>
          )}

          {/* Description */}
          {description && (
            <p className="text-[length:var(--font-size-md)] text-ulb-grey-800 line-clamp-2">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-[var(--space-linear-075)] mt-[var(--space-linear-050)]">
              {tags.map(tag => (
                <Badge
                  key={tag.label}
                  className={cn(
                    'rounded-full px-3 py-0.5 text-[length:var(--font-size-sm)] font-medium border',
                    tag.className
                  )}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
)
ListItem.displayName = 'ListItem'

export { ListItem }
