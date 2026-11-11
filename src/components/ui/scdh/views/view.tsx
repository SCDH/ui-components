import * as React from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One way to look at the content of a View, e.g. reading text, TEI source or facsimile. */
export interface ViewMode {
  id: string
  /** Entry in the mode selection, e.g. "Lesetext". */
  label: string
  /** What the View shows in this mode. */
  content: React.ReactNode
}

export interface ViewProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'title' | 'defaultValue' | 'children'
> {
  id: string
  /** Label in the header, e.g. "Ansicht" next to the mode selection. With a single mode and no title the mode label is shown. */
  title?: React.ReactNode
  /** Available modes. With more than one entry the header shows a selection. */
  modes?: ViewMode[]
  /** Current mode (controlled). */
  mode?: string
  /** Initial mode (uncontrolled). Defaults to the first mode. */
  defaultMode?: string
  onModeChange?: (modeId: string) => void
  /** Additional buttons on the right of the header. */
  actions?: React.ReactNode
  /**
   * Look of a pinned view (e.g. "Metadaten"): the title is indented and the content sits on a grey
   * background over the full height.
   */
  pinned?: boolean
  /** Shows a close button in the header. */
  onClose?: () => void
  /** Ref to the scrolling content container. */
  contentRef?: React.Ref<HTMLDivElement>
  /** Content when no `modes` are given. */
  children?: React.ReactNode
}

// ---------------------------------------------------------------------------
// View
// ---------------------------------------------------------------------------

/**
 * One view of a document: a fixed header (title, mode selection, actions) above a content area
 * that scrolls on its own. The mode selection decides what the view shows.
 *
 * Arranging views and managing which ones are open is up to the `ViewController`.
 */
const View = React.forwardRef<HTMLElement, ViewProps>(
  (
    {
      id,
      title,
      modes,
      mode,
      defaultMode,
      onModeChange,
      actions,
      pinned = false,
      onClose,
      contentRef,
      children,
      className,
      style,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const titleId = React.useId()
    const triggerId = React.useId()

    const [currentModeId, setModeId] = useControllableState<string>({
      value: mode,
      defaultValue: defaultMode ?? modes?.[0]?.id ?? '',
      onChange: onModeChange
    })

    const currentMode = modes?.find(m => m.id === currentModeId) ?? modes?.[0]
    const hasModeSelection = (modes?.length ?? 0) > 1
    const headerTitle = title ?? (modes?.length === 1 ? modes[0].label : undefined)

    // Accessible name: explicit label, else "<title> – <mode>" when both are plain text
    const stringTitle = typeof headerTitle === 'string' ? headerTitle : undefined
    const regionName =
      ariaLabel ??
      ([stringTitle, hasModeSelection ? currentMode?.label : undefined]
        .filter(Boolean)
        .join(' – ') ||
        undefined)

    const regionProps = {
      id,
      role: 'region' as const,
      'aria-label': regionName,
      'aria-labelledby': regionName ? undefined : titleId
    }

    const nameForButtons = regionName ?? stringTitle ?? currentMode?.label ?? id

    return (
      <section
        ref={ref}
        {...regionProps}
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground',
          className
        )}
        style={style}
        {...props}
      >
        {/* ---- Header: fixed, does not scroll ---- */}
        <div className="shrink-0">
          <header className="box-content flex min-h-9 items-center gap-3 border-b border-ulb-grey-200 pb-4 dark:border-border">
            {headerTitle !== undefined && (
              <span id={titleId} className={cn('shrink-0 text-lg', pinned && 'pl-4')}>
                {headerTitle}
              </span>
            )}

            {hasModeSelection && modes && (
              <Select value={currentMode?.id} onValueChange={setModeId}>
                <SelectTrigger
                  id={triggerId}
                  aria-labelledby={
                    headerTitle !== undefined ? `${titleId} ${triggerId}` : undefined
                  }
                  className="min-w-[108px] max-w-full bg-background text-lg"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {modes.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-1">
              {actions}
              {onClose && (
                <Button
                  type="button"
                  variant="icon"
                  size="icon"
                  aria-label={`${nameForButtons} schließen`}
                  onClick={onClose}
                >
                  <X />
                </Button>
              )}
            </div>
          </header>
        </div>

        {/* ---- Content: the only part that scrolls ---- */}
        <div
          ref={contentRef}
          tabIndex={0}
          className={cn(
            'min-h-0 flex-1 overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scdh-blue-700',
            pinned ? 'bg-ulb-grey-050 p-4 dark:bg-secondary' : 'py-4'
          )}
        >
          {modes ? currentMode?.content : children}
        </div>
      </section>
    )
  }
)
View.displayName = 'View'

export { View }
