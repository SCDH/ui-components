/**
 * Data of the main menu: main items with optional sub items.
 *
 * Kept apart from `nav-menu.tsx` to satisfy react-refresh/only-export-components while
 * `AppLayout` can use the helpers as well.
 */

/** One page in the menu. */
export interface NavMenuLink {
  label: string
  href?: string
  /** This is the current page. */
  isActive?: boolean
  onClick?: () => void
}

/** A main item, optionally with sub items. */
export interface NavMenuEntry extends NavMenuLink {
  /**
   * Sub items: in the mobile menu they are expanded below the item, on desktop they are shown in
   * a submenu on the left while the current page belongs to this item.
   */
  children?: NavMenuLink[]
}

/** The item has a page of its own (a link or a click handler), not only sub items. */
export function hasPage(link: NavMenuLink) {
  return !!(link.href || link.onClick)
}

/** The item is the current page, or one of its sub items is. */
export function containsCurrent(entry: NavMenuEntry) {
  return !!entry.isActive || !!entry.children?.some(child => child.isActive)
}

/** The item has sub items. */
export function hasChildren(entry: NavMenuEntry): entry is NavMenuEntry & { children: NavMenuLink[] } {
  return !!entry.children?.length
}

/**
 * Where the item leads: its own page or, without one, its first sub item (e.g. in the desktop
 * Menubar).
 */
export function targetOf(entry: NavMenuEntry): NavMenuLink {
  return !hasPage(entry) && hasChildren(entry) ? entry.children[0] : entry
}
