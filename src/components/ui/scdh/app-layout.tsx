import * as React from 'react'
import { Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Header, HeaderLogo, HeaderTitle } from '@/components/ui/scdh/header'
import { Menubar, MenubarItems, MenubarItem, MenubarActions } from '@/components/ui/scdh/menubar'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider
} from '@/components/ui/scdh/sidebar'
import { Footer } from '@/components/ui/scdh/footer'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TopNavItem {
  label: string
  href?: string
  isActive?: boolean
  onClick?: () => void
  /** Additional action buttons rendered in the MenubarActions area (desktop only) */
  actions?: React.ReactNode
}

export interface AppLayoutProps {
  /** Logo node displayed left in the Header. */
  logo?: React.ReactNode
  /** Title displayed centered in the Header. */
  title: string
  /** Top-level navigation items rendered in the Menubar (desktop) and Sheet (mobile). */
  topNavItems?: TopNavItem[]
  /** Arbitrary content rendered in the Sidebar (desktop) and below topNavItems in the Sheet (mobile). */
  sidebar?: React.ReactNode
  /**
   * Title of the sidebar, e.g. "Alle Briefe". Makes the sidebar collapsible: a header row with the
   * toggle and this title appears above the sidebar content (desktop). In the mobile Sheet it is
   * shown as a heading above the sidebar content.
   */
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

function renderTopNavItem(item: TopNavItem, variant: 'desktop' | 'mobile') {
  // Skip sentinel items that only carry actions (no label)
  if (item.href) {
    return (
      <MenubarItem key={item.label} active={item.isActive} variant={variant} asChild>
        <a href={item.href} onClick={item.onClick}>
          {item.label}
        </a>
      </MenubarItem>
    )
  }

  return (
    <MenubarItem key={item.label} active={item.isActive} variant={variant} onClick={item.onClick}>
      {item.label}
    </MenubarItem>
  )
}

/** Collect action nodes across all topNavItems that define them. */
function renderActions(items: TopNavItem[]): React.ReactNode {
  const actions = items.flatMap(item => (item.actions ? [item.actions] : []))
  if (actions.length === 0) return null
  return <MenubarActions>{actions}</MenubarActions>
}

// ---------------------------------------------------------------------------
// AppLayout
// ---------------------------------------------------------------------------

/**
 * Composite layout component that orchestrates Header, Menubar, Sidebar, Footer,
 * and responsive mobile navigation via a Sheet.
 *
 * Desktop: Header → Menubar → [Sidebar | Content] → Footer
 * Mobile:  Header → Menubar (hamburger only) → Content → Footer
 *          Hamburger opens a Sheet with merged topNavItems + sidebar.
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

  return (
    <SidebarProvider
      collapsed={sidebarCollapsed}
      defaultCollapsed={defaultSidebarCollapsed}
      onCollapsedChange={onSidebarCollapsedChange}
    >
      <div
        className={cn(
          'grid',
          fillViewport
            ? 'h-screen grid-rows-[auto_auto_minmax(0,1fr)_auto]'
            : 'min-h-screen grid-rows-[auto_auto_1fr_auto]',
          className
        )}
      >
        {/* ---- Header ---- */}
        <Header className="z-30">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="link" size="icon" aria-label="Menü öffnen" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent title={title} side="left">
                {/* Top-level nav items (skip action-only sentinels) */}
                {topNavItems
                  .filter(item => item.label)
                  .map(item => renderTopNavItem(item, 'mobile'))}

                {/* Separator + Sidebar content */}
                {sidebar && (
                  <>
                    <Separator className="my-2" />
                    {sidebarTitle && (
                      <h2 className="px-3 pt-2 text-lg font-bold">{sidebarTitle}</h2>
                    )}
                    {sidebar}
                  </>
                )}
              </SheetContent>
            </Sheet>
          )}

          {logo && <HeaderLogo>{logo}</HeaderLogo>}
          <HeaderTitle className={isMobile ? 'max-md:hidden' : undefined}>{title}</HeaderTitle>
        </Header>

        {/* ---- Menubar ---- */}
        <Menubar className={isMobile ? 'justify-start' : undefined}>
          {!isMobile && topNavItems.length > 0 && (
            <MenubarItems>
              {topNavItems
                .filter(item => item.label)
                .map(item => renderTopNavItem(item, 'desktop'))}
            </MenubarItems>
          )}
          {!isMobile && renderActions(topNavItems)}
          {/* On mobile the hamburger is already rendered inside the Header,
            nothing extra needed in the Menubar */}
        </Menubar>

        {/* ---- Body (Sidebar + Content) ---- */}
        <div
          className={cn(
            'grid min-h-0 bg-background',
            fillViewport ? 'grid-cols-[auto_minmax(0,1fr)] overflow-hidden' : 'grid-cols-[auto_1fr]'
          )}
        >
          {/* Desktop sidebar */}
          {!isMobile && sidebar && (
            <Sidebar className={fillViewport ? 'h-full' : undefined}>
              {sidebarTitle && <SidebarHeader>{sidebarTitle}</SidebarHeader>}
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
        </div>

        {/* ---- Footer ---- */}
        {footer && <Footer>{footer}</Footer>}
      </div>
    </SidebarProvider>
  )
}

export { AppLayout }
