import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  containsCurrent,
  hasChildren,
  hasPage,
  type NavMenuEntry,
  type NavMenuLink
} from './nav-menu-entry'

// Prototype (design "MobileMenu"): the way groups expand may still change, see `NavMenuGroup`.

// ---------------------------------------------------------------------------
// Row styles
// ---------------------------------------------------------------------------

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scdh-blue-700'

const rowBase = cn(
  'relative flex w-full items-center text-left text-lg leading-6 text-black transition-colors hover:bg-ulb-grey-100',
  focusRing
)

const rowLevel = {
  /** 68px high, the text 24px from the left */
  main: 'py-[22px] pl-6 pr-6',
  /** 48px high, indented by 40px */
  sub: 'py-3 pl-10 pr-6'
}

/** The current page: grey background and a blue bar on the left. */
const selectedRow =
  'bg-ulb-grey-100 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-scdh-blue-600'

// ---------------------------------------------------------------------------
// NavMenuItem — one row: a main or a sub item
// ---------------------------------------------------------------------------

export interface NavMenuItemProps {
  link: NavMenuLink
  /** `main` (default) or `sub`, indented. */
  level?: keyof typeof rowLevel
  /** Bold: the current page is this item or belongs to it. */
  current?: boolean
  /** Called after the item was chosen, e.g. to close the drawer. */
  onNavigate?: () => void
  className?: string
}

/** A row leading to a page: a link with `href`, otherwise a button. */
function NavMenuItem({ link, level = 'main', current, onNavigate, className }: NavMenuItemProps) {
  const props = {
    'aria-current': link.isActive ? ('page' as const) : undefined,
    className: cn(
      rowBase,
      rowLevel[level],
      current && 'font-bold',
      link.isActive && selectedRow,
      className
    ),
    onClick: () => {
      link.onClick?.()
      onNavigate?.()
    }
  }

  return link.href ? (
    <a href={link.href} {...props}>
      {link.label}
    </a>
  ) : (
    <button type="button" {...props}>
      {link.label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// NavMenuGroup — a main item with sub items that expand and collapse
// ---------------------------------------------------------------------------

interface NavMenuGroupProps {
  entry: NavMenuEntry & { children: NavMenuLink[] }
  onNavigate?: () => void
}

/**
 * Expanding and choosing are apart: the label leads to the item's page, the arrow next to it
 * expands the sub items. Without a page of its own, the whole row expands them. The group of the
 * current page starts expanded.
 */
function NavMenuGroup({ entry, onNavigate }: NavMenuGroupProps) {
  const current = containsCurrent(entry)
  const [expanded, setExpanded] = React.useState(current)
  const listId = React.useId()
  const toggle = () => setExpanded(e => !e)

  const chevron = (
    <ChevronDown
      aria-hidden
      className={cn(
        'size-4 shrink-0 transition-transform motion-reduce:transition-none',
        expanded && 'rotate-180'
      )}
    />
  )

  return (
    <>
      {hasPage(entry) ? (
        <div className="relative">
          {/* Room on the right for the arrow */}
          <NavMenuItem link={entry} current={current} onNavigate={onNavigate} className="pr-16" />
          <Button
            variant="icon"
            size="icon"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-label={`Unterpunkte von ${entry.label}`}
            onClick={toggle}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            {chevron}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={toggle}
          className={cn(rowBase, rowLevel.main, 'justify-between gap-4', current && 'font-bold')}
        >
          {entry.label}
          {chevron}
        </button>
      )}
      <ul id={listId} hidden={!expanded} className="border-t border-ulb-grey-200">
        {entry.children.map(child => (
          <li key={child.label}>
            <NavMenuItem link={child} level="sub" onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </>
  )
}

// ---------------------------------------------------------------------------
// NavMenu — the main menu (mobile drawer)
// ---------------------------------------------------------------------------

export interface NavMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  items: NavMenuEntry[]
  /** Called after a page was chosen, e.g. to close the drawer. */
  onNavigate?: () => void
}

/**
 * **Prototype.** The main items between lines, items with sub items expandable. The current page
 * has a grey background and a blue bar, the main item it belongs to is bold.
 */
function NavMenu({ items, onNavigate, className, ...props }: NavMenuProps) {
  return (
    <ul className={cn('divide-y divide-ulb-grey-200', className)} {...props}>
      {items.map(entry => (
        <li key={entry.label}>
          {hasChildren(entry) ? (
            <NavMenuGroup entry={entry} onNavigate={onNavigate} />
          ) : (
            <NavMenuItem link={entry} current={containsCurrent(entry)} onNavigate={onNavigate} />
          )}
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// NavSubmenu — the sub items of one main item (desktop)
// ---------------------------------------------------------------------------

export interface NavSubmenuProps extends React.HTMLAttributes<HTMLElement> {
  /** The main item whose sub items are shown. */
  entry: NavMenuEntry
}

/**
 * **Prototype.** The sub items of the current main item on the left (desktop), looking like the
 * mobile menu: the main item as heading (a link to its page, if it has one), a line, the sub items.
 * Fixed, nothing expands or collapses.
 */
const NavSubmenu = React.forwardRef<HTMLElement, NavSubmenuProps>(
  ({ entry, className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Untermenü"
      className={cn('w-60 bg-ulb-grey-050 border-r border-ulb-grey-300', className)}
      {...props}
    >
      {hasPage(entry) ? (
        <NavMenuItem link={entry} current />
      ) : (
        <div className={cn('text-lg leading-6 font-bold text-black', rowLevel.main)}>
          {entry.label}
        </div>
      )}
      <ul className="border-t border-ulb-grey-200">
        {entry.children?.map(child => (
          <li key={child.label}>
            <NavMenuItem link={child} level="sub" />
          </li>
        ))}
      </ul>
    </nav>
  )
)
NavSubmenu.displayName = 'NavSubmenu'

export { NavMenu, NavMenuItem, NavSubmenu }
