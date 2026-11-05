import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { AppLayout } from '@/components/ui/scdh/app-layout'
import { SidebarTrigger } from '@/components/ui/scdh/sidebar'
import { ViewController, useViewController } from '@/components/ui/scdh/views'
import { Button } from '@/components/ui/button'
import { EntryList } from '@/components/ui/scdh/entry-list'
import logoSrc from '@/assets/logo_uni_ms.svg'
import { LONG_MODES, METADATA_VIEW } from '../views/mock-data'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'SCDH-UI/App Showcases/ViewController',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `ViewController` in an app: inside an `AppLayout` with `fillViewport` and its ' +
          'sidebar (list of letters), below a title with an "Ansicht hinzufügen" button that ' +
          'operates the controller via `useViewController`. The page does not scroll, only the ' +
          'contents of the views do. The sidebar (288px) can be collapsed: it disappears completely and a button next to the title brings it back.'
      }
    }
  }
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Sidebar content: list of all letters (the title "Alle Briefe" comes from AppLayout)
// ---------------------------------------------------------------------------

const LETTERS = [
  'PersonB an PersonA',
  'PersonA an PersonB',
  'PersonC an PersonA',
  'PersonA an PersonC',
  'PersonD an PersonB',
  'PersonB an PersonD'
].map((label, i) => ({ id: `letter-${i}`, label }))

function LetterList() {
  return <EntryList entries={LETTERS} defaultValue="letter-0" aria-label="Alle Briefe" />
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

function ViewerPage({ initialViewId }: { initialViewId?: string }) {
  const controller = useViewController({
    modes: LONG_MODES,
    defaultActiveViewId: initialViewId,
    defaultViews: [METADATA_VIEW, { id: 'reading', mode: 'reading' }, { id: 'tei', mode: 'tei' }]
  })

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Mobile: trigger, centred bold title and an icon button; desktop: title with date */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-6 pb-2 md:items-start md:pb-6 md:pl-8">
        <div className="flex min-w-0 flex-1 items-center gap-4 md:flex-none md:items-start">
          {/* Shown while the sidebar is collapsed: brings it back */}
          <SidebarTrigger />
          <div className="min-w-0 flex-1 text-center md:flex-none md:text-left">
            <h2 className="truncate text-lg font-bold md:text-2xl md:font-normal">
              PersonB an PersonA
            </h2>
            <p className="hidden text-lg text-ulb-grey-900 md:block">2. Oktober 1956</p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="text-foreground max-md:w-9 max-md:px-0 md:text-scdh-blue-500"
          onClick={() => controller.addView()}
        >
          <Plus className="md:hidden" aria-hidden />
          <span className="max-md:sr-only">Ansicht hinzufügen</span>
        </Button>
      </div>
      <div className="min-h-0 flex-1 md:px-10">
        <ViewController controller={controller} closable />
      </div>
    </div>
  )
}

function ViewerApp({ initialViewId }: { initialViewId?: string }) {
  return (
    <AppLayout
      fillViewport
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      title="Präsentator"
      sidebar={<LetterList />}
      sidebarTitle="Alle Briefe"
      topNavItems={[
        { label: 'Viewer', isActive: true },
        { label: 'Über das Projekt' },
        { label: 'Netzwerk' },
        // Initials of the logged-in user, right in the menubar
        {
          label: '',
          actions: (
            <Button
              variant="tertiary"
              size="icon"
              aria-label="Angemeldet als JS"
              className="border-ulb-grey-800"
            >
              JS
            </Button>
          )
        }
      ]}
    >
      <ViewerPage initialViewId={initialViewId} />
    </AppLayout>
  )
}

/**
 * A letter viewer: title and "Ansicht hinzufügen" above the views. On desktop up to 3 views are
 * visible (the pinned "Metadaten" and 2 others), on tablet 2, on mobile 1. With more views a
 * `Pager` appears. Resize the window or switch the viewport to see the layouts.
 */
export const Demo: Story = {
  render: () => <ViewerApp />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The page does not scroll, only the view contents do
    await expect(document.scrollingElement!.scrollHeight).toBeLessThanOrEqual(window.innerHeight)
    const reading = canvas.getByRole('region', { name: 'Ansicht – Lesetext' })
    const scroller = reading.querySelector<HTMLElement>(':scope > div:last-child')!
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)

    // The sidebar takes its share of the width; nothing spills out of the page
    await expect(canvas.getByRole('navigation', { name: 'Alle Briefe' })).toBeVisible()
    await expect(document.scrollingElement!.scrollWidth).toBeLessThanOrEqual(window.innerWidth)

    // Collapsing the sidebar gives the views more width, expanding takes it back
    const letters = canvas.getByRole('navigation', { name: 'Alle Briefe' })
    const widthWithSidebar = reading.getBoundingClientRect().width
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste einklappen' }))
    await waitFor(() =>
      expect(reading.getBoundingClientRect().width).toBeGreaterThan(widthWithSidebar + 50)
    )
    await expect(letters).not.toBeVisible()
    // The sidebar is gone completely; only the trigger next to the title remains
    const aside = canvasElement.querySelector('aside')!
    await waitFor(() => expect(aside.getBoundingClientRect().width).toBe(0))
    await expect(
      canvas.queryByRole('button', { name: 'Seitenleiste einklappen' })
    ).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    await waitFor(() =>
      expect(Math.abs(reading.getBoundingClientRect().width - widthWithSidebar)).toBeLessThan(2)
    )
    await expect(letters).toBeVisible()

    // All buttons show the pointer cursor
    const pointer = (el: HTMLElement) => expect(getComputedStyle(el).cursor).toBe('pointer')
    await pointer(canvas.getByRole('button', { name: 'Seitenleiste einklappen' }))
    await pointer(canvas.getByRole('button', { name: 'Ansicht hinzufügen' }))
    await pointer(within(reading).getByRole('button', { name: /schließen/ }))
    await pointer(within(reading).getByRole('combobox'))
    await pointer(canvas.getByRole('button', { name: 'PersonA an PersonB' }))

    // Title and the add button
    await expect(canvas.getByRole('heading', { name: 'PersonB an PersonA' })).toBeVisible()
    await expect(canvas.queryAllByRole('region')).toHaveLength(3)

    // Adding a view operates the controller; a fourth view needs the pager
    await expect(
      canvas.queryByRole('navigation', { name: 'Ansicht wechseln' })
    ).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Ansicht hinzufügen' }))
    await expect(canvas.queryAllByRole('region')).toHaveLength(4)
    await expect(canvas.getByRole('navigation', { name: 'Ansicht wechseln' })).toBeInTheDocument()
    await expect(document.scrollingElement!.scrollHeight).toBeLessThanOrEqual(window.innerHeight)
  }
}

/**
 * Mobile (design "Mobile Ansicht", 393 × 852): the header shows the title only, the menubar has
 * the menu button on the left and the user on the right. The list of letters is an overlay below
 * the menubar, opened with the button next to the title. The views are swiped, the pager sits
 * below.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      options: {
        iphone: { name: 'iPhone 393 × 852', styles: { width: '393px', height: '852px' } }
      }
    }
  },
  globals: { viewport: { value: 'iphone', isRotated: false } },
  // As in the design: the second page, the reading text, is shown
  render: () => <ViewerApp initialViewId="reading" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Header: title only, no logo
    await expect(canvas.queryByAltText('SCDH Logo')).not.toBeInTheDocument()
    await expect(canvas.getByText('Präsentator')).toBeVisible()
    // Menubar: menu button left, user right
    await expect(canvas.getByRole('button', { name: 'Menü öffnen' })).toBeVisible()
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Menü öffnen' })).cursor).toBe(
      'pointer'
    )
    await expect(canvas.getByRole('button', { name: 'Angemeldet als JS' })).toBeVisible()

    // The list starts closed; the trigger next to the title opens it as an overlay
    await expect(canvas.queryByRole('navigation', { name: 'Alle Briefe' })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    const letters = canvas.getByRole('navigation', { name: 'Alle Briefe' })
    await expect(letters).toBeVisible()
    const aside = canvasElement.querySelector('aside')!
    const menubar = canvasElement.querySelector('nav')!.getBoundingClientRect()
    const panel = aside.getBoundingClientRect()
    await expect(panel.left).toBe(0)
    await expect(Math.abs(panel.top - menubar.bottom)).toBeLessThan(2)
    await expect(panel.width).toBeLessThan(window.innerWidth * 0.7)

    // The toggle in the overlay closes it again
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste einklappen' }))
    await expect(canvas.queryByRole('navigation', { name: 'Alle Briefe' })).not.toBeInTheDocument()

    // Views are swiped, the pager shows one page per view
    const pager = canvas.getByRole('navigation', { name: 'Ansicht wechseln' })
    const pages = within(pager).getAllByRole('button', { name: /^Seite \d von 3$/ })
    await expect(pages).toHaveLength(3)
    await expect(pages[1]).toHaveAttribute('aria-current', 'true')
    await expect(document.scrollingElement!.scrollWidth).toBeLessThanOrEqual(window.innerWidth)
  }
}
