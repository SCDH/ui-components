import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelpCircleIcon, LogInIcon } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { AppLayout } from '@/components/ui/scdh/app-layout'
import type { TopNavItem } from '@/components/ui/scdh/app-layout'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/scdh/sidebar'
import { EntryList, Facet, SearchBar, ListItem } from '@/components/ui/scdh'
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

/** Viewports the stories open in (Storybook 10: `globals`, no longer `parameters`). */
const DESKTOP = { viewport: { value: 'desktop', isRotated: false } }
const TABLET = { viewport: { value: 'tablet', isRotated: false } }
const MOBILE = { viewport: { value: 'mobile2', isRotated: false } }

// ---------------------------------------------------------------------------
// Static data (hoisted per rerender-no-inline-components)
// ---------------------------------------------------------------------------

interface NavItemDef {
  id: string
  label: string
  /** `false`: the item has no page of its own, it only groups its sub items. */
  ownPage?: boolean
  children?: { id: string; label: string }[]
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Suche' },
  {
    id: 'collections',
    label: 'Sammlungen',
    children: [
      { id: 'manuscripts', label: 'Handschriften' },
      { id: 'incunabula', label: 'Inkunabeln' },
      { id: 'charters', label: 'Urkunden' },
      { id: 'maps', label: 'Karten & Pläne' }
    ]
  },
  {
    id: 'about',
    label: 'Über uns',
    ownPage: false,
    children: [
      { id: 'project', label: 'Projekt' },
      { id: 'team', label: 'Team' },
      { id: 'contact', label: 'Kontakt' }
    ]
  }
]

/** Main items without sub items (design "MobileMenu"). */
const FLAT_NAV_ITEMS: NavItemDef[] = [
  { id: 'overview', label: 'Übersicht' },
  { id: 'data', label: 'Daten' },
  { id: 'search', label: 'Suche' }
]

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

/** Content of the sidebar: the list of all letters (the title "Alle Briefe" comes from AppLayout). */
const LETTERS = [
  'PersonB an PersonA',
  'PersonA an PersonB',
  'PersonC an PersonA',
  'PersonA an PersonC',
  'PersonD an PersonB',
  'PersonB an PersonD'
].map((label, i) => ({ id: `letter-${i}`, label }))

const letterList = <EntryList entries={LETTERS} defaultValue="letter-0" aria-label="Alle Briefe" />

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

const logoImage = <img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />

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

/** Content with the button that opens the collapsed sidebar next to the title. */
const ContentWithSidebarTrigger = () => (
  <>
    <div className="flex items-center gap-4 px-6 pt-6">
      <SidebarTrigger />
      {/* No higher than the button, so it stays where the toggle in the sidebar was */}
      <h1 className="text-2xl leading-9 font-bold text-ulb-grey-900">Briefe</h1>
    </div>
    <MainContent />
  </>
)

// ---------------------------------------------------------------------------
// Faceted search demo — static data for visual demonstration only
// ---------------------------------------------------------------------------

/** The facets as in `FacetSearch`; the selection is only remembered, nothing is searched. */
function FacetedSidebarContent() {
  const [selected, setSelected] = React.useState<Record<string, string[]>>({})
  const toggle = (group: string, value: string) =>
    setSelected(current => {
      const values = current[group] ?? []
      return {
        ...current,
        [group]: values.includes(value) ? values.filter(v => v !== value) : [...values, value]
      }
    })

  return (
    <div className="flex flex-col gap-4">
      {FACET_GROUPS.map(group => (
        <Facet
          key={group.value}
          title={group.title}
          items={group.items.map(item => ({
            ...item,
            isSelected: selected[group.value]?.includes(item.value)
          }))}
          selectionMode="checkbox"
          collapsible
          defaultExpanded={group.defaultExpanded}
          onToggle={value => toggle(group.value, value)}
        />
      ))}
    </div>
  )
}

const SearchResultsContent = () => (
  <div className="px-6 pt-6 pb-8">
    <div className="mb-6 flex items-center gap-4">
      <SidebarTrigger />
      <SearchBar placeholder="Volltextsuche im Katalog..." className="flex-1" />
    </div>
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
// local state so clicking a nav item visibly marks it as active in the
// desktop Menubar, the submenu and the mobile menu.
// ---------------------------------------------------------------------------

interface SelectableAppLayoutProps extends Omit<
  import('@/components/ui/scdh/app-layout').AppLayoutProps,
  'topNavItems' | 'title'
> {
  /** The menu items, by default with sub items. */
  navItems?: NavItemDef[]
  /** ID of the initially active nav item, or undefined for none. */
  initialActiveId?: string
  /** Whether to show the action buttons (Help, Login). */
  showActions?: boolean
}

function SelectableAppLayout({
  navItems = NAV_ITEMS,
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
      ...navItems.map(item => ({
        label: item.label,
        ...(item.ownPage !== false && {
          isActive: activeId === item.id,
          onClick: () => handleSelect(item.id)
        }),
        children: item.children?.map(child => ({
          label: child.label,
          isActive: activeId === child.id,
          onClick: () => handleSelect(child.id)
        }))
      })),
      ...(showActions ? [{ label: '', actions: actionButtons }] : [])
    ],
    [navItems, activeId, handleSelect, showActions]
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
// Test helpers
// ---------------------------------------------------------------------------

/** The Menubar: the first `nav` of the layout. */
function menubarOf(canvasElement: HTMLElement) {
  return within(canvasElement.querySelector('nav')!)
}

function isBold(element: HTMLElement) {
  return getComputedStyle(element).fontWeight === '700'
}

/**
 * Collapses the sidebar and checks that the button which opens it again stands exactly where the
 * toggle was: to the user it is one button that only swaps its icon.
 */
async function collapseInPlace(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  const position = (element: HTMLElement) => {
    const { x, y } = element.getBoundingClientRect()
    return [Math.round(x), Math.round(y)]
  }
  const toggle = canvas.getByRole('button', { name: 'Seitenleiste einklappen' })
  const before = position(toggle)
  await userEvent.click(toggle)
  // The button in the content, shown once the sidebar has closed (until then the toggle in the
  // sidebar carries the same name)
  const trigger = await within(canvas.getByRole('main')).findByRole('button', {
    name: 'Seitenleiste ausklappen'
  })
  await expect(position(trigger)).toEqual(before)
}

// ---------------------------------------------------------------------------
// Desktop
// ---------------------------------------------------------------------------

/**
 * Full desktop layout: Header, Menubar, submenu, sidebar, content and Footer.
 * - Menubar: main items left, action buttons right. "Sammlungen" is marked, its sub item
 *   "Handschriften" is the current page.
 * - Submenu (**prototype**): the sub items of "Sammlungen", headed by the main item. It pushes
 *   the content to the right.
 * - Sidebar: "Alle Briefe", collapsible; the button next to the title brings it back.
 *
 * Click any item to mark it as active; on "Home" or "Suche" the submenu disappears.
 */
export const Desktop: Story = {
  globals: DESKTOP,
  render: () => (
    <SelectableAppLayout
      initialActiveId="manuscripts"
      logo={logoImage}
      sidebar={letterList}
      sidebarTitle="Alle Briefe"
      footer={footerContent}
    >
      <ContentWithSidebarTrigger />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Submenu, then "Alle Briefe", then the content
    const submenu = canvas.getByRole('navigation', { name: 'Untermenü' })
    const sidebarHeading = canvas.getByRole('heading', { name: 'Alle Briefe' })
    const main = canvas.getByRole('main')
    await expect(sidebarHeading).toBeVisible()
    const submenuBox = submenu.getBoundingClientRect()
    const sidebarBox = sidebarHeading.closest('aside')!.getBoundingClientRect()
    await expect(sidebarBox.left).toBeGreaterThanOrEqual(submenuBox.right - 1)
    await expect(main.getBoundingClientRect().left).toBeGreaterThanOrEqual(sidebarBox.right - 1)
  }
}

/**
 * **Prototype.** Desktop submenu: while the current page belongs to an item with sub items, they
 * are shown in a fixed submenu on the left, headed by the main item (a link to its page). Nothing
 * expands or collapses. "Über uns" has no page of its own; in the Menubar it leads to its first
 * sub item, in the submenu its heading is plain text.
 */
export const DesktopSubmenu: Story = {
  globals: DESKTOP,
  render: () => (
    <SelectableAppLayout initialActiveId="manuscripts" logo={logoImage} footer={footerContent}>
      <MainContent />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const menubar = menubarOf(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Menü öffnen' })).not.toBeInTheDocument()

    let submenu = canvas.getByRole('navigation', { name: 'Untermenü' })
    let sub = within(submenu)
    const heading = sub.getByRole('button', { name: 'Sammlungen' })
    await expect(isBold(heading)).toBe(true)
    await expect(sub.getByRole('button', { name: 'Handschriften' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    // Fixed: nothing to expand or collapse
    await expect(sub.queryByRole('button', { name: /Unterpunkte/ })).not.toBeInTheDocument()
    // It pushes the content to the right
    const main = canvas.getByRole('main')
    await expect(main.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      submenu.getBoundingClientRect().right - 1
    )

    // Choosing another sub item moves the mark
    await userEvent.click(sub.getByRole('button', { name: 'Inkunabeln' }))
    await expect(sub.getByRole('button', { name: 'Inkunabeln' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    await expect(sub.getByRole('button', { name: 'Handschriften' })).not.toHaveAttribute(
      'aria-current'
    )

    // The heading leads to the page of the main item, which is then marked
    await userEvent.click(heading)
    await expect(sub.getByRole('button', { name: 'Sammlungen' })).toHaveAttribute(
      'aria-current',
      'page'
    )

    // A page without sub items: no submenu
    await userEvent.click(menubar.getByRole('button', { name: 'Home' }))
    await expect(canvas.queryByRole('navigation', { name: 'Untermenü' })).not.toBeInTheDocument()

    // An item without a page of its own leads to its first sub item
    await userEvent.click(menubar.getByRole('button', { name: 'Über uns' }))
    submenu = canvas.getByRole('navigation', { name: 'Untermenü' })
    sub = within(submenu)
    await expect(sub.getByText('Über uns')).toBeVisible()
    await expect(sub.queryByRole('button', { name: 'Über uns' })).not.toBeInTheDocument()
    await expect(sub.getByRole('button', { name: 'Projekt' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  }
}

/**
 * The sidebar has a header row with the collapse toggle and its title ("sidebarTitle") above the
 * content (design "3 Ansichten"). Collapsed, the sidebar is gone completely; the `SidebarTrigger`
 * in the header of the main content brings it back.
 */
export const CollapsibleSidebar: Story = {
  globals: DESKTOP,
  render: () => (
    <SelectableAppLayout
      logo={logoImage}
      sidebar={letterList}
      sidebarTitle="Alle Briefe"
      footer={footerContent}
    >
      <ContentWithSidebarTrigger />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const letter = () => canvas.getByRole('button', { name: 'PersonB an PersonA' })
    await expect(canvas.getByRole('heading', { name: 'Alle Briefe' })).toBeVisible()
    await expect(letter()).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Seitenleiste ausklappen' })
    ).not.toBeInTheDocument()

    await collapseInPlace(canvasElement)
    await expect(canvas.getByText('PersonB an PersonA')).not.toBeVisible()
    // The header goes once the sidebar has closed (animated)
    await waitFor(() =>
      expect(canvas.queryByRole('heading', { name: 'Alle Briefe' })).not.toBeInTheDocument()
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    // The content fades in
    await waitFor(() => expect(letter()).toBeVisible())
  }
}

/**
 * Without a title ("sidebarTitle") the header row of the sidebar shows only the toggle.
 */
export const SidebarWithoutTitle: Story = {
  globals: DESKTOP,
  render: () => (
    <SelectableAppLayout logo={logoImage} sidebar={letterList} footer={footerContent}>
      <ContentWithSidebarTrigger />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sidebar = within(canvasElement.querySelector('aside')!)
    await expect(sidebar.getByRole('button', { name: 'Seitenleiste einklappen' })).toBeVisible()
    await expect(sidebar.queryByRole('heading')).not.toBeInTheDocument()

    await collapseInPlace(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'PersonB an PersonA' })).toBeVisible()
    )
  }
}

// ---------------------------------------------------------------------------
// Tablet
// ---------------------------------------------------------------------------

/**
 * Tablet (narrower than 1024px): the Menubar is visible as on desktop. When the **prototype**
 * submenu appears next to the sidebar, "Alle Briefe" starts collapsed so the content keeps enough
 * room; the button next to the title opens it again.
 */
export const Tablet: Story = {
  globals: TABLET,
  render: () => (
    <SelectableAppLayout
      initialActiveId="home"
      sidebar={letterList}
      sidebarTitle="Alle Briefe"
      footer={footerContent}
    >
      <ContentWithSidebarTrigger />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Without a submenu the sidebar is open
    await expect(canvas.getByRole('heading', { name: 'Alle Briefe' })).toBeVisible()

    // Into a section with sub items: the submenu appears, the sidebar collapses
    await userEvent.click(menubarOf(canvasElement).getByRole('button', { name: 'Sammlungen' }))
    await expect(canvas.getByRole('navigation', { name: 'Untermenü' })).toBeVisible()
    await waitFor(() =>
      expect(canvas.queryByRole('heading', { name: 'Alle Briefe' })).not.toBeInTheDocument()
    )

    // It can be opened again next to the submenu
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    await expect(canvas.getByRole('heading', { name: 'Alle Briefe' })).toBeVisible()
    await expect(canvas.getByRole('navigation', { name: 'Untermenü' })).toBeVisible()
  }
}

// ---------------------------------------------------------------------------
// Mobile
// ---------------------------------------------------------------------------

/**
 * **Prototype.** Mobile main menu: the hamburger opens a drawer below the Menubar that pushes in
 * from the left over the dimmed content. Items with sub items have an arrow that expands and
 * collapses them; the label itself leads to the item's page. "Über uns" has no page of its own,
 * the whole row expands it. The group of the current page is expanded when the drawer opens.
 * Choosing a page, tapping the hamburger again, tapping next to the drawer or Escape closes it.
 */
export const Mobile: Story = {
  globals: MOBILE,
  render: () => (
    <SelectableAppLayout initialActiveId="manuscripts" footer={footerContent}>
      <MainContent />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hamburger = canvas.getByRole('button', { name: 'Menü öffnen' })
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByRole('navigation', { name: 'Hauptmenü' })).not.toBeInTheDocument()

    // Open: focus moves into the drawer, the hamburger shows its open state
    await userEvent.click(hamburger)
    const drawer = await canvas.findByRole('navigation', { name: 'Hauptmenü' })
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true')
    await expect(hamburger).toHaveAccessibleName('Menü schließen')
    await waitFor(() => expect(drawer.contains(document.activeElement)).toBe(true))

    // The group of the current page is expanded, its main item bold, the page itself marked
    let menu = within(drawer)
    const collections = menu.getByRole('button', { name: 'Sammlungen' })
    await expect(isBold(collections)).toBe(true)
    await expect(collections).not.toHaveAttribute('aria-current')
    const arrow = menu.getByRole('button', { name: 'Unterpunkte von Sammlungen' })
    await expect(arrow).toHaveAttribute('aria-expanded', 'true')
    // The arrow is an icon button of the design system (36 × 36)
    await expect(arrow.getBoundingClientRect().width).toBe(36)
    await expect(arrow.getBoundingClientRect().height).toBe(36)
    await expect(menu.getByRole('button', { name: 'Handschriften' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    await expect(isBold(menu.getByRole('button', { name: 'Home' }))).toBe(false)

    // "Über uns" has no page of its own: the row expands it, the drawer stays open
    const about = menu.getByRole('button', { name: 'Über uns' })
    await expect(about).toHaveAttribute('aria-expanded', 'false')
    await expect(menu.queryByRole('button', { name: 'Team' })).not.toBeInTheDocument()
    await userEvent.click(about)
    await expect(about).toHaveAttribute('aria-expanded', 'true')
    await expect(menu.getByRole('button', { name: 'Team' })).toBeVisible()

    // The arrow collapses a group without closing the drawer
    await userEvent.click(arrow)
    await expect(menu.queryByRole('button', { name: 'Handschriften' })).not.toBeInTheDocument()
    await expect(drawer).toBeVisible()

    // Choosing a page closes the drawer
    await userEvent.click(menu.getByRole('button', { name: 'Team' }))
    await waitFor(() =>
      expect(canvas.queryByRole('navigation', { name: 'Hauptmenü' })).not.toBeInTheDocument()
    )
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')

    // Reopened, the group of the new page is expanded and the old one collapsed
    await userEvent.click(hamburger)
    menu = within(await canvas.findByRole('navigation', { name: 'Hauptmenü' }))
    await expect(menu.getByRole('button', { name: 'Team' })).toHaveAttribute('aria-current', 'page')
    await expect(isBold(menu.getByRole('button', { name: 'Über uns' }))).toBe(true)
    await expect(menu.queryByRole('button', { name: 'Handschriften' })).not.toBeInTheDocument()

    // The hamburger closes it again
    await userEvent.click(hamburger)
    await waitFor(() =>
      expect(canvas.queryByRole('navigation', { name: 'Hauptmenü' })).not.toBeInTheDocument()
    )

    // Escape closes it and returns the focus to the hamburger
    await userEvent.click(hamburger)
    await canvas.findByRole('navigation', { name: 'Hauptmenü' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(canvas.queryByRole('navigation', { name: 'Hauptmenü' })).not.toBeInTheDocument()
    )
    await expect(hamburger).toHaveFocus()

    // The content next to the drawer is dimmed; tapping there closes the drawer
    await userEvent.click(hamburger)
    await canvas.findByRole('navigation', { name: 'Hauptmenü' })
    const overlay = canvasElement.querySelector<HTMLElement>('[data-slot="nav-drawer-overlay"]')!
    await expect(document.elementFromPoint(window.innerWidth - 20, 400)).toBe(overlay)
    await userEvent.click(overlay)
    await waitFor(() =>
      expect(canvas.queryByRole('navigation', { name: 'Hauptmenü' })).not.toBeInTheDocument()
    )
  }
}

/**
 * **Prototype.** Mobile main menu without sub items: only main items between the lines.
 */
export const MobileWithoutSubitems: Story = {
  globals: MOBILE,
  render: () => (
    <SelectableAppLayout navItems={FLAT_NAV_ITEMS} initialActiveId="overview">
      <MainContent />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hamburger = canvas.getByRole('button', { name: 'Menü öffnen' })
    await userEvent.click(hamburger)
    let menu = within(await canvas.findByRole('navigation', { name: 'Hauptmenü' }))
    await expect(menu.getByRole('button', { name: 'Übersicht' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    await expect(menu.getByRole('button', { name: 'Daten' })).not.toHaveAttribute('aria-expanded')
    await expect(menu.queryByRole('button', { name: /Unterpunkte/ })).not.toBeInTheDocument()

    // Choosing a page closes the drawer; reopened, that page is marked
    await userEvent.click(menu.getByRole('button', { name: 'Daten' }))
    await waitFor(() =>
      expect(canvas.queryByRole('navigation', { name: 'Hauptmenü' })).not.toBeInTheDocument()
    )
    await userEvent.click(hamburger)
    menu = within(await canvas.findByRole('navigation', { name: 'Hauptmenü' }))
    await expect(menu.getByRole('button', { name: 'Daten' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    await expect(menu.getByRole('button', { name: 'Übersicht' })).not.toHaveAttribute(
      'aria-current'
    )
  }
}

/**
 * **Prototype.** On mobile the main menu and the sidebar ("Alle Briefe") are overlays in the same
 * place: with the sidebar open, the hamburger opens the menu and closes the sidebar. The other way
 * round does not occur, the dimmed content covers the button that opens the sidebar.
 */
export const MobileWithSidebar: Story = {
  globals: MOBILE,
  render: () => (
    <SelectableAppLayout
      initialActiveId="manuscripts"
      sidebar={letterList}
      sidebarTitle="Alle Briefe"
    >
      <ContentWithSidebarTrigger />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    await expect(canvas.getByRole('heading', { name: 'Alle Briefe' })).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Menü öffnen' }))
    await canvas.findByRole('navigation', { name: 'Hauptmenü' })
    await waitFor(() =>
      expect(canvas.queryByRole('heading', { name: 'Alle Briefe' })).not.toBeInTheDocument()
    )
  }
}

// ---------------------------------------------------------------------------
// Other layouts
// ---------------------------------------------------------------------------

/**
 * Minimal layout — no sidebar, no footer, just Header + Menubar + Content.
 * No initially active item (cold-start state).
 */
export const Minimal: Story = {
  render: () => (
    <SelectableAppLayout logo={logoImage} initialActiveId={undefined} showActions={false}>
      <MainContent />
    </SelectableAppLayout>
  )
}

/**
 * Faceted search layout — visual demonstration of a full search interface
 * inside the SCDH AppLayout.
 *
 * - **Sidebar "Filter":** Three collapsible facets (Epoche, Autor:in, Sammlung)
 *   with checkboxes and item counts, styled as in the FacetSearch composite.
 *   The toggle collapses the sidebar, the button next to the search bar opens
 *   it again.
 * - **Main:** A static search bar and 8 example search results rendered
 *   as ListItem cards with thumbnails, metadata, and tags.
 * - **No search** — the facets remember what is checked, but the results do
 *   not change. Unlike the FacetSearch composite, this needs no
 *   SearchServiceProvider and no MSW.
 *
 * The same Header, Menubar, and Footer from the other stories frame the
 * search interface in a realistic SCDH page layout.
 */
export const FacetedSearch: Story = {
  render: () => (
    <SelectableAppLayout
      initialActiveId="search"
      logo={logoImage}
      sidebar={<FacetedSidebarContent />}
      sidebarTitle="Filter"
      footer={footerContent}
    >
      <SearchResultsContent />
    </SelectableAppLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const antike = canvas.getByRole('checkbox', { name: /Antike/ })
    await userEvent.click(antike)
    await expect(antike).toBeChecked()

    await collapseInPlace(canvasElement)
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
    <AppLayout title="SCDH UI Components" sidebar={letterList} sidebarTitle="Alle Briefe">
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
