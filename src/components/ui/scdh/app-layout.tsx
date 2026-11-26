import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useIsMobile, useIsNarrow } from '@/hooks/use-mobile'
import { Header, HeaderLogo, HeaderTitle } from '@/components/ui/scdh/header'
import { Menubar, MenubarItems, MenubarItem, MenubarActions } from '@/components/ui/scdh/menubar'
import { NavMenu, NavSubmenu } from '@/components/ui/scdh/nav-menu'
import {
  containsCurrent,
  hasChildren,
  targetOf,
  type NavMenuEntry
} from '@/components/ui/scdh/nav-menu-entry'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider
} from '@/components/ui/scdh/sidebar'
import { Footer } from '@/components/ui/scdh/footer'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TopNavItem extends NavMenuEntry {
  /** Additional action buttons rendered in the MenubarActions area */
  actions?: React.ReactNode
}

export interface AppLayoutProps {
  /** Logo node displayed left in the Header. */
  logo?: React.ReactNode
  /** Title displayed centered in the Header. */
  title: string
  /**
   * Top-level navigation items rendered in the Menubar (desktop) and the menu drawer (mobile).
   * Items can have sub items (`children`): on mobile they expand in the drawer, on desktop they
   * are shown in a submenu on the left while the current page belongs to the item.
   */
  topNavItems?: TopNavItem[]
  /**
   * Content of the sidebar on the left. It can be collapsed with the toggle in its header row; a
   * `SidebarTrigger` in the content opens it again. On mobile it is an overlay below the Menubar.
   */
  sidebar?: React.ReactNode
  /** Title of the sidebar, e.g. "Alle Briefe", shown next to the toggle. */
  sidebarTitle?: React.ReactNode
  /** Collapsed state of the sidebar (controlled). */
  sidebarCollapsed?: boolean
  /** Initial collapsed state of the sidebar (uncontrolled). Default `false`. */
  defaultSidebarCollapsed?: boolean
  onSidebarCollapsedChange?: (collapsed: boolean) => void
  /** Content rendered in the Footer. */
  footer?: React.ReactNode
  /** Main content area. */
  children?: React.ReactNode
  /**
   * Fit the layout to the viewport height instead of growing with the content. The page itself
   * does not scroll then; the main area is a flex column with a bounded height, so content such
   * as a `ViewController` can fill it (`h-full`) and scroll internally. Default: `false`.
   */
  fillViewport?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** A Menubar item: marked while the current page is it or one of its sub items. */
function renderTopNavItem(item: TopNavItem) {
  // Without a page of its own the item leads to its first sub item
  const target = targetOf(item)
  const active = containsCurrent(item)

  if (target.href) {
    return (
      <MenubarItem key={item.label} active={active} asChild>
        <a href={target.href} onClick={target.onClick}>
          {item.label}
        </a>
      </MenubarItem>
    )
  }

  return (
    <MenubarItem key={item.label} active={active} onClick={target.onClick}>
      {item.label}
    </MenubarItem>
  )
}

/** Collect action nodes across all topNavItems that define them. */
function renderActions(items: TopNavItem[], isMobile: boolean): React.ReactNode {
  const actions = items.flatMap(item => (item.actions ? [item.actions] : []))
  if (actions.length === 0) return null
  // MenubarActions is desktop-only by default; the design keeps them in the mobile menubar
  return <MenubarActions className={isMobile ? 'flex' : undefined}>{actions}</MenubarActions>
}

/** Columns of the body on desktop, by the number of columns left of the content. */
const desktopColumns = {
  fill: ['grid-cols-[auto_minmax(0,1fr)]', 'grid-cols-[auto_auto_minmax(0,1fr)]'],
  grow: ['grid-cols-[auto_1fr]', 'grid-cols-[auto_auto_1fr]']
}

// ---------------------------------------------------------------------------
// AppLayout
// ---------------------------------------------------------------------------

/**
 * Composite layout component that orchestrates Header, Menubar, Sidebar, Footer,
 * and responsive mobile navigation via a menu drawer.
 *
 * Desktop: Header → Menubar → [Submenu | Sidebar | Content] → Footer
 *          The submenu shows the sub items of the current main item, if it has any.
 * Mobile:  Header (title only) → Menubar (hamburger left, actions right) → Content → Footer
 *          The hamburger opens a drawer below the Menubar with the topNavItems and their sub
 *          items. The sidebar is an overlay in the same place, opened with a `SidebarTrigger` in
 *          the content; opening one closes the other.
 */
function AppLayout({
  logo,
  title,
  topNavItems = [],
  sidebar,
  sidebarTitle,
  sidebarCollapsed,
  defaultSidebarCollapsed,
  onSidebarCollapsedChange,
  footer,
  children,
  fillViewport = false,
  className
}: AppLayoutProps) {
  const isMobile = useIsMobile()
  const isNarrow = useIsNarrow()

  // Skip sentinel items that only carry actions (no label)
  const navItems = topNavItems.filter(item => item.label)
  const submenuEntry = isMobile
    ? undefined
    : navItems.find(item => hasChildren(item) && containsCurrent(item))
  const showSidebar = !!sidebar

  // Narrower than 1024px, submenu and sidebar next to each other leave the content little room:
  // the sidebar starts collapsed then
  const crowded = !!submenuEntry && isNarrow && showSidebar
  const layout = isMobile ? 'mobile' : crowded ? 'crowded' : 'wide'

  // The layouts start differently: the sidebar is open next to the content on desktop, on mobile
  // it is an overlay that starts closed. Switching between them starts the sidebar and the menu
  // over, but not the content, which keeps its state.
  const initialCollapsed = defaultSidebarCollapsed ?? (isMobile || crowded)
  const [ownCollapsed, setOwnCollapsed] = React.useState(initialCollapsed)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [lastLayout, setLastLayout] = React.useState(layout)
  if (lastLayout !== layout) {
    setLastLayout(layout)
    setOwnCollapsed(initialCollapsed)
    setMenuOpen(false)
  }

  // On mobile, the sidebar and the menu are overlays in the same place: opening one closes the
  // other. Usually the dimmed content covers the `SidebarTrigger` while the menu is open, but an
  // app may place it where the menu does not reach (e.g. in the Menubar).
  const collapsed = sidebarCollapsed ?? ownCollapsed
  const setCollapsed = (next: boolean) => {
    setOwnCollapsed(next)
    onSidebarCollapsedChange?.(next)
    if (!next && isMobile) setMenuOpen(false)
  }
  const setMenu = (open: boolean) => {
    setMenuOpen(open)
    if (open && showSidebar && isMobile && !collapsed) setCollapsed(true)
  }

  const columns = fillViewport ? desktopColumns.fill : desktopColumns.grow
  const sideColumns = Number(!!submenuEntry) + Number(showSidebar)

  return (
    <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
      <DialogPrimitive.Root open={isMobile && menuOpen} onOpenChange={setMenu} modal={false}>
        <div
          className={cn(
            // Full width also in a flex parent: otherwise the layout narrows when the sidebar
            // collapses and the toggle moves
            'grid w-full',
            fillViewport
              ? 'h-screen grid-rows-[auto_auto_minmax(0,1fr)_auto]'
              : 'min-h-screen grid-rows-[auto_auto_1fr_auto]',
            className
          )}
        >
          {/* ---- Header ---- */}
          <Header className="z-30">
            {/* The mobile header shows the title only */}
            {!isMobile && logo && <HeaderLogo>{logo}</HeaderLogo>}
            <HeaderTitle>{title}</HeaderTitle>
          </Header>

          {/* ---- Menubar ---- */}
          <Menubar className={isMobile ? 'justify-between' : undefined}>
            {isMobile && (
              <DialogPrimitive.Trigger asChild>
                <Button
                  variant="tertiary"
                  size="icon"
                  aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
                  className="border-ulb-grey-800 data-[state=open]:bg-ulb-grey-200"
                >
                  <Menu />
                </Button>
              </DialogPrimitive.Trigger>
            )}
            {!isMobile && navItems.length > 0 && (
              <MenubarItems>{navItems.map(item => renderTopNavItem(item))}</MenubarItems>
            )}
            {renderActions(topNavItems, isMobile)}
          </Menubar>

          {/* ---- Body (Submenu + Sidebar + Content) ---- */}
          <div
            className={cn(
              'relative grid min-h-0 bg-background',
              isMobile ? 'grid-cols-[minmax(0,1fr)]' : columns[Math.max(sideColumns, 1) - 1],
              fillViewport && 'overflow-hidden'
            )}
          >
            {/* Submenu (desktop): the sub items of the current main item */}
            {submenuEntry && (
              <NavSubmenu
                entry={submenuEntry}
                className={cn(
                  'overflow-y-auto',
                  fillViewport
                    ? 'h-full'
                    : 'sticky top-[var(--header-height,80px)] h-[calc(100vh-var(--header-height,80px))]'
                )}
              />
            )}

            {/* Sidebar: next to the content, on mobile an overlay */}
            {showSidebar && (
              <Sidebar mobile="overlay" className={fillViewport ? 'md:h-full' : undefined}>
                <SidebarHeader>{sidebarTitle}</SidebarHeader>
                <SidebarContent>{sidebar}</SidebarContent>
              </Sidebar>
            )}

            {/* Main content */}
            <main
              className={cn(
                'min-h-0 bg-background',
                fillViewport && 'flex min-w-0 flex-col overflow-hidden'
              )}
            >
              {children}
            </main>

            {/* Menu drawer (mobile): over the dimmed content, below the Menubar */}
            {isMobile && menuOpen && (
              <div
                data-slot="nav-drawer-overlay"
                aria-hidden
                className="absolute inset-0 z-20 bg-black/70 animate-in fade-in-0 motion-reduce:animate-none"
              />
            )}
            {isMobile && (
              <DialogPrimitive.Content
                aria-describedby={undefined}
                className={cn(
                  'absolute inset-y-0 left-0 z-20 flex w-60 flex-col overflow-y-auto bg-ulb-grey-050 border-r border-ulb-grey-300 focus:outline-none',
                  'duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left motion-reduce:animate-none'
                )}
              >
                <DialogPrimitive.Title className="sr-only">Hauptmenü</DialogPrimitive.Title>
                <nav aria-label="Hauptmenü">
                  <NavMenu items={navItems} onNavigate={() => setMenu(false)} />
                </nav>
              </DialogPrimitive.Content>
            )}
          </div>

          {/* ---- Footer ---- */}
          {footer && <Footer>{footer}</Footer>}
        </div>
      </DialogPrimitive.Root>
    </SidebarProvider>
  )
}

export { AppLayout }
