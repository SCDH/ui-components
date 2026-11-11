import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelpCircleIcon, LogInIcon } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { AppLayout } from '@/components/ui/scdh/app-layout'
import type { TopNavItem } from '@/components/ui/scdh/app-layout'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/scdh/sidebar'
import { Facet, SearchBar, ListItem } from '@/components/ui/scdh'
import logoSrc from '@/assets/logo_uni_ms.svg'
import { FACET_GROUPS, SEARCH_RESULTS } from './mock-data'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'SCDH-UI/Composites/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  args: {
    title: 'SCDH UI Components'
  }
} satisfies Meta<typeof AppLayout>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Static data (hoisted per rerender-no-inline-components)
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Suche' },
  { id: 'collections', label: 'Sammlungen' },
  { id: 'about', label: 'Über uns' }
] as const

const actionButtons = (
  <>
    <Button variant="tertiary" size="icon" aria-label="Hilfe">
      <HelpCircleIcon />
    </Button>
    <Button variant="tertiary" size="icon" aria-label="Login">
      <LogInIcon />
    </Button>
  </>
)

const sidebarContent = (
  <nav className="flex flex-col gap-0.5 p-4">
    <a href="#" className="px-3 py-2 rounded-md text-md text-ulb-grey-800 hover:bg-ulb-grey-100">
      Autoren
    </a>
    <a href="#" className="px-3 py-2 rounded-md text-md text-ulb-grey-800 hover:bg-ulb-grey-100">
      Regionen
    </a>
    <a
      href="#"
      className="px-3 py-2 rounded-md text-md text-scdh-blue-700 font-medium hover:bg-ulb-grey-100"
    >
      Epochen
    </a>
    <a href="#" className="px-3 py-2 rounded-md text-md text-ulb-grey-800 hover:bg-ulb-grey-100">
      Werke
    </a>
    <a href="#" className="px-3 py-2 rounded-md text-md text-ulb-grey-800 hover:bg-ulb-grey-100">
      Sammlungen
    </a>
    <a href="#" className="px-3 py-2 rounded-md text-md text-ulb-grey-800 hover:bg-ulb-grey-100">
      Institutionen
    </a>
  </nav>
)

const footerContent = (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-ulb-grey-600">
    <span>&copy; {new Date().getFullYear()} SCDH Münster</span>
    <nav className="flex gap-4">
      <a href="#" className="hover:text-ulb-grey-900 transition-colors">
        Impressum
      </a>
      <a href="#" className="hover:text-ulb-grey-900 transition-colors">
        Datenschutz
      </a>
    </nav>
  </div>
)

const MainContent = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-ulb-grey-900 mb-4">Willkommen</h1>
    <p className="text-ulb-grey-700 mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <p className="text-ulb-grey-700 mb-4">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.
    </p>
    <p className="text-ulb-grey-700">
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
      laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
      beatae vitae dicta sunt explicabo.
    </p>
  </div>
)

// ---------------------------------------------------------------------------
// Faceted search demo — static data for visual demonstration only
// ---------------------------------------------------------------------------

const facetedSidebarContent = (
  <div className="flex flex-col">
    {FACET_GROUPS.map(group => (
      <Facet
        key={group.value}
        title={group.title}
        items={group.items}
        collapsible
        defaultExpanded={group.defaultExpanded}
        className="border-0 shadow-none bg-transparent"
      />
    ))}
  </div>
)

const SearchResultsContent = () => (
  <div className="p-8">
    <SearchBar placeholder="Volltextsuche im Katalog..." className="mb-6" />
    <p className="text-sm text-ulb-grey-600 mb-4">{SEARCH_RESULTS.length} Ergebnisse</p>
    <div className="flex flex-col gap-4">
      {SEARCH_RESULTS.map((item, i) => (
        <ListItem key={i} {...item} />
      ))}
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// SelectableAppLayout — interactive wrapper for stories
//
// Simulates the production pattern where active state is derived from the
// current URL (via NavLink / useLocation). In Storybook we track it with
// local state so clicking a nav item visibly marks it as active in both
// the desktop Menubar and the mobile Sheet.
// ---------------------------------------------------------------------------

interface SelectableAppLayoutProps extends Omit<
  import('@/components/ui/scdh/app-layout').AppLayoutProps,
  'topNavItems' | 'title'
> {
  /** ID of the initially active nav item, or undefined for none. */
  initialActiveId?: string
  /** Whether to show the action buttons (Help, Login). */
  showActions?: boolean
}

function SelectableAppLayout({
  initialActiveId = 'home',
  showActions = true,
  sidebar,
  sidebarTitle,
  footer,
  children,
  logo
}: SelectableAppLayoutProps) {
  const [activeId, setActiveId] = React.useState(initialActiveId)

  const handleSelect = React.useCallback((id: string) => {
    setActiveId(id)
  }, [])

  // Derive topNavItems during render (rerender-derived-state-no-effect)
  const topNavItems: TopNavItem[] = React.useMemo(
    () => [
      ...NAV_ITEMS.map(item => ({
        label: item.label,
        isActive: activeId === item.id,
        onClick: () => handleSelect(item.id)
      })),
      ...(showActions ? [{ label: '', actions: actionButtons }] : [])
    ],
    [activeId, handleSelect, showActions]
  )

  return (
    <AppLayout
      logo={logo}
      title="SCDH UI Components"
      topNavItems={topNavItems}
      sidebar={sidebar}
      sidebarTitle={sidebarTitle}
      footer={footer}
    >
      {children}
    </AppLayout>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Full desktop layout with Header, Menubar, Sidebar, Content, and Footer.
 * - Header: Logo + centered title
 * - Menubar: Nav items left, action buttons right, "Home" initially active
 * - Sidebar: Collapsible with Accordion-based facets
 * - Footer: Copyright + legal links
 *
 * Click any nav item to mark it as active — the blue bottom border moves.
 * The same active state is reflected in the mobile Sheet.
 */
export const Desktop: Story = {
  render: () => (
    <SelectableAppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      sidebar={sidebarContent}
      footer={footerContent}
    >
      <MainContent />
    </SelectableAppLayout>
  )
}

/**
 * Desktop layout with Sidebar initially collapsed.
 */
export const DesktopCollapsedSidebar: Story = {
  render: () => (
    <SelectableAppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      sidebar={sidebarContent}
      footer={footerContent}
    >
      <MainContent />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    // Click the sidebar toggle to collapse
    const toggle = canvasElement.querySelector(
      '[aria-label="Seitenleiste einklappen"]'
    ) as HTMLButtonElement
    if (toggle) toggle.click()
  }
}

/**
 * Mobile viewport — hamburger button opens a Sheet.
 * The Sheet contains topNavItems, a Separator, and the sidebar Accordion.
 * Click any item in the Sheet to mark it as active.
 * Use the Storybook viewport toolbar to switch to a mobile viewport width.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: () => (
    <SelectableAppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      sidebar={sidebarContent}
      footer={footerContent}
    >
      <MainContent />
    </SelectableAppLayout>
  )
}

/**
 * Tablet viewport — Menubar is visible, sidebar fits alongside content.
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  },
  render: () => (
    <SelectableAppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      sidebar={sidebarContent}
      footer={footerContent}
    >
      <MainContent />
    </SelectableAppLayout>
  )
}

/**
 * Minimal layout — no sidebar, no footer, just Header + Menubar + Content.
 * No initially active item (cold-start state).
 */
export const Minimal: Story = {
  render: () => (
    <SelectableAppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      initialActiveId={undefined}
      showActions={false}
    >
      <MainContent />
    </SelectableAppLayout>
  )
}

/**
 * Faceted search layout — visual demonstration of a full search interface
 * inside the SCDH AppLayout.
 *
 * - **Sidebar:** Three collapsible facets (Epoche, Autor:in, Sammlung)
 *   with item counts, purely visual — no active search engine.
 * - **Main:** A static search bar and 8 example search results rendered
 *   as ListItem cards with thumbnails, metadata, and tags.
 * - **Not interactive** — unlike the FacetSearch composite, this needs no
 *   SearchServiceProvider, no MSW, and no play functions.
 *
 * The same Header, Menubar, and Footer from the other stories frame the
 * search interface in a realistic SCDH page layout.
 */
export const FacetedSearch: Story = {
  render: () => (
    <SelectableAppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      sidebar={facetedSidebarContent}
      footer={footerContent}
    >
      <SearchResultsContent />
    </SelectableAppLayout>
  )
}

/**
 * Sidebar with a title ("sidebarTitle"): a header row with the collapse toggle and the title
 * appears above the content (design "3 Ansichten"). Collapsed, the sidebar is gone completely;
 * the `SidebarTrigger` in the header of the main content brings it back.
 */
export const CollapsibleSidebar: Story = {
  render: () => (
    <SelectableAppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      sidebar={sidebarContent}
      sidebarTitle="Alle Briefe"
      footer={footerContent}
    >
      <div className="flex items-center gap-4 px-8 pt-8">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold text-ulb-grey-900">Willkommen</h1>
      </div>
      <MainContent />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Alle Briefe' })).toBeVisible()
    await expect(canvas.getByText('Autoren')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Seitenleiste ausklappen' })
    ).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste einklappen' }))
    await expect(canvas.getByText('Autoren')).not.toBeVisible()
    await expect(canvas.queryByRole('heading', { name: 'Alle Briefe' })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    await expect(canvas.getByText('Autoren')).toBeVisible()
  }
}

// ---------------------------------------------------------------------------
// Crossing the mobile breakpoint
// ---------------------------------------------------------------------------

/**
 * Stands in for the viewport in a test: answers the mobile media query of `useIsMobile` and
 * switches it on demand, as resizing the window across 768px would.
 */
function fakeMobileQuery() {
  const original = window.matchMedia
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  let matches = false
  window.matchMedia = query => {
    if (!query.includes('max-width: 767px')) return original.call(window, query)
    return {
      get matches() {
        return matches
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, l: (event: MediaQueryListEvent) => void) => listeners.add(l),
      removeEventListener: (_: string, l: (event: MediaQueryListEvent) => void) =>
        listeners.delete(l),
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    } as MediaQueryList
  }
  return {
    setMobile(mobile: boolean) {
      matches = mobile
      listeners.forEach(l => l({ matches: mobile } as MediaQueryListEvent))
    },
    restore() {
      window.matchMedia = original
    }
  }
}

let viewport: ReturnType<typeof fakeMobileQuery> | undefined

function Counter() {
  const [count, setCount] = React.useState(0)
  return (
    <Button variant="secondary" onClick={() => setCount(c => c + 1)}>
      Gezählt: {count}
    </Button>
  )
}

/**
 * Switching between the desktop and the mobile layout (resizing the window across 768px) keeps
 * what the content holds, e.g. the open views of a `ViewController`. Only the sidebar starts over:
 * open next to the content on desktop, closed as an overlay on mobile. In this story the switch is
 * simulated, the window size has no effect.
 */
export const KeepsContentAcrossBreakpoint: Story = {
  beforeEach: () => {
    viewport = fakeMobileQuery()
    return () => viewport?.restore()
  },
  render: () => (
    <AppLayout title="SCDH UI Components" sidebar={sidebarContent} sidebarTitle="Alle Briefe">
      <div className="flex items-center gap-4 p-8">
        <SidebarTrigger />
        <Counter />
      </div>
    </AppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Gezählt: 0' }))
    await expect(canvas.getByRole('button', { name: 'Gezählt: 1' })).toBeVisible()

    // To mobile: the content keeps its state, the sidebar overlay starts closed
    viewport!.setMobile(true)
    await expect(await canvas.findByRole('button', { name: 'Menü öffnen' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Gezählt: 1' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' })).toBeVisible()

    // Back to desktop: still the same state, the sidebar is open again
    viewport!.setMobile(false)
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Menü öffnen' })).not.toBeInTheDocument()
    )
    await expect(canvas.getByRole('button', { name: 'Gezählt: 1' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Seitenleiste einklappen' })).toBeVisible()
  }
}
