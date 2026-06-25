import * as React from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// SidebarContext — shared collapse state
// ---------------------------------------------------------------------------

type SidebarContextValue = {
  isCollapsed: boolean
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error('Sidebar compound components must be used within <Sidebar>')
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Sidebar — Root container (desktop-only, left column)
// ---------------------------------------------------------------------------

const Sidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const toggle = React.useCallback(() => setIsCollapsed(prev => !prev), [])

    return (
      <SidebarContext.Provider value={{ isCollapsed, toggle }}>
        <aside
          ref={ref}
          className={cn(
            'hidden md:flex flex-col h-[calc(100vh-var(--header-height,75px))] sticky top-[var(--header-height,75px)] bg-white border-r border-ulb-grey-200 overflow-hidden transition-[width] duration-300',
            isCollapsed ? 'w-16' : 'w-64',
            className
          )}
          {...props}
        >
          {children}
        </aside>
      </SidebarContext.Provider>
    )
  }
)
Sidebar.displayName = 'Sidebar'

// ---------------------------------------------------------------------------
// SidebarToggle — collapse/expand button
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
// SidebarContent — scrollable content area
// ---------------------------------------------------------------------------

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto px-3 pb-4 transition-opacity duration-300',
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

export { Sidebar, SidebarToggle, SidebarContent }
