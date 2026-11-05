import * as React from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// SidebarContext — shared collapse state
// ---------------------------------------------------------------------------

type SidebarContextValue = {
  isCollapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error(
      'Sidebar compound components must be used within <Sidebar> or <SidebarProvider>'
    )
  }
  return ctx
}

export interface SidebarProviderProps {
  /** Collapsed state (controlled). */
  collapsed?: boolean
  /** Initial collapsed state (uncontrolled). Default `false`. */
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  children?: React.ReactNode
}

/**
 * Holds the collapse state of the sidebar so that parts outside of the `Sidebar`, e.g. the
 * `SidebarTrigger` in the header of the main content, can open it again. `AppLayout` provides
 * it; a `Sidebar` used on its own creates its own.
 */
function SidebarProvider({
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  children
}: SidebarProviderProps) {
  const [isCollapsed, setCollapsed] = useControllableState<boolean>({
    value: collapsed,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange
  })
  const value = React.useMemo(
    () => ({ isCollapsed, setCollapsed, toggle: () => setCollapsed(!isCollapsed) }),
    [isCollapsed, setCollapsed]
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

// ---------------------------------------------------------------------------
// Sidebar — Root container (desktop-only, left column)
// ---------------------------------------------------------------------------

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * What the sidebar does on small screens: `hidden` (default) or `overlay`, a panel over the
   * content below the menubar (the parent has to be positioned). Collapsed, it is gone in both.
   */
  mobile?: 'hidden' | 'overlay'
}

const SidebarAside = React.forwardRef<HTMLElement, SidebarProps>(
  ({ mobile = 'hidden', className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <aside
        ref={ref}
        className={cn(
          'flex-col bg-ulb-grey-050 border-r border-ulb-grey-200 overflow-hidden transition-[width] duration-300',
          'md:flex md:h-[calc(100vh-var(--header-height,80px))] md:sticky md:top-[var(--header-height,80px)]',
          mobile === 'overlay'
            ? 'max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-20 max-md:flex max-md:w-60'
            : 'max-md:hidden',
          // Collapsed, the sidebar is gone completely; only the `SidebarTrigger` remains
          isCollapsed ? 'max-md:hidden md:w-0 md:border-r-0' : 'md:w-72',
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
SidebarAside.displayName = 'SidebarAside'

/**
 * Sidebar on the left (tablet and desktop). Collapsed, it disappears completely; the
 * `SidebarTrigger` (e.g. next to the page title) brings it back.
 */
const Sidebar = React.forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  // Inside a `SidebarProvider` (e.g. in `AppLayout`) the state is shared, otherwise own it here
  const inProvider = React.useContext(SidebarContext) !== null
  const aside = <SidebarAside ref={ref} {...props} />
  return inProvider ? aside : <SidebarProvider>{aside}</SidebarProvider>
})
Sidebar.displayName = 'Sidebar'

// ---------------------------------------------------------------------------
// SidebarToggle — collapse/expand button inside the sidebar
// ---------------------------------------------------------------------------

const SidebarToggle = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { isCollapsed, toggle } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="tertiary"
        size="icon"
        onClick={toggle}
        aria-label={isCollapsed ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'}
        className={cn('self-end m-2 flex-shrink-0', className)}
        {...props}
      >
        {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </Button>
    )
  }
)
SidebarToggle.displayName = 'SidebarToggle'

// ---------------------------------------------------------------------------
// SidebarTrigger — shows the collapsed sidebar again
// ---------------------------------------------------------------------------

/**
 * Button that opens a collapsed sidebar. Place it in the header of the main content, next to the
 * page title. It is only shown while the sidebar is collapsed.
 */
const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { isCollapsed, setCollapsed } = useSidebar()
    if (!isCollapsed) return null

    return (
      <Button
        ref={ref}
        variant="secondary"
        size="icon"
        onClick={() => setCollapsed(false)}
        aria-label="Seitenleiste ausklappen"
        className={cn('shrink-0', className)}
        {...props}
      >
        <PanelLeftOpen className="size-4" />
      </Button>
    )
  }
)
SidebarTrigger.displayName = 'SidebarTrigger'

// ---------------------------------------------------------------------------
// SidebarHeader — toggle with a title next to it
// ---------------------------------------------------------------------------

/**
 * Header row of the sidebar: the collapse toggle with the title next to it (e.g. "Alle Briefe").
 */
const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar()
    if (isCollapsed) return null

    return (
      <div
        ref={ref}
        className={cn('flex shrink-0 items-center gap-4 px-6 py-4 max-md:px-5', className)}
        {...props}
      >
        <SidebarToggle className="m-0 self-auto" />
        <h2 className="truncate text-lg font-normal whitespace-nowrap text-foreground max-md:font-bold">
          {children}
        </h2>
      </div>
    )
  }
)
SidebarHeader.displayName = 'SidebarHeader'

// ---------------------------------------------------------------------------
// SidebarContent — scrollable content area
// ---------------------------------------------------------------------------

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto px-6 pb-4 transition-opacity duration-300 max-md:px-5',
          isCollapsed ? 'opacity-0 invisible' : 'opacity-100',
          className
        )}
        aria-hidden={isCollapsed}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarContent.displayName = 'SidebarContent'

export {
  Sidebar,
  SidebarProvider,
  SidebarToggle,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  useSidebar
}
