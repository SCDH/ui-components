import * as React from 'react'

import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EntryListItem {
  /** Unique id; this is what `value` and `onValueChange` refer to. */
  id: string
  label: React.ReactNode
  /** Renders the entry as a link instead of a button. */
  href?: string
}

export interface EntryListProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange'
> {
  entries: EntryListItem[]
  /** Id of the selected entry (controlled). */
  value?: string
  /** Id of the initially selected entry (uncontrolled). */
  defaultValue?: string
  /** Called with the id of the entry the user picked. */
  onValueChange?: (id: string) => void
  /** Accessible name of the list, e.g. "Alle Briefe". */
  'aria-label': string
}

// ---------------------------------------------------------------------------
// EntryList
// ---------------------------------------------------------------------------

const entryClasses = cn(
  'flex w-full items-center border-l-2 border-transparent px-5 py-1.5 text-left text-lg text-foreground',
  'hover:bg-ulb-grey-050 dark:hover:bg-accent',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scdh-blue-700',
  // Selected: grey background with a blue edge on the left
  'aria-[current=page]:border-scdh-blue-500 aria-[current=page]:bg-ulb-grey-050 dark:aria-[current=page]:bg-accent'
)

/**
 * List of entries in a card, e.g. all letters in the sidebar. The selected entry is shown on grey
 * with a blue edge on the left. Entries are buttons, or links when they have an `href`.
 *
 * Selecting is controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 */
const EntryList = React.forwardRef<HTMLElement, EntryListProps>(
  ({ entries, value, defaultValue, onValueChange, className, ...props }, ref) => {
    const [selected, setSelected] = useControllableState<string | undefined>({
      value,
      defaultValue,
      onChange: id => {
        if (id !== undefined) onValueChange?.(id)
      }
    })

    return (
      <nav ref={ref} className={className} {...props}>
        <ul className="overflow-hidden rounded-2xl border border-ulb-grey-200 bg-background py-3 dark:border-border">
          {entries.map(entry => {
            const current = entry.id === selected ? ('page' as const) : undefined
            return (
              <li key={entry.id}>
                {entry.href !== undefined ? (
                  <a
                    href={entry.href}
                    aria-current={current}
                    onClick={() => setSelected(entry.id)}
                    // Host pages often style links globally; entries must not pick that up
                    className={cn(entryClasses, 'text-foreground! font-normal! no-underline!')}
                  >
                    {entry.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    aria-current={current}
                    onClick={() => setSelected(entry.id)}
                    className={entryClasses}
                  >
                    {entry.label}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
)
EntryList.displayName = 'EntryList'

export { EntryList }
