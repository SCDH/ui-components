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

/**
 * Place and look of the sidebar button. Open and collapsed it is the same tertiary button in the
 * same place, only its icon changes.
 */
function buttonLook(button: HTMLElement) {
  const { left, top } = button.getBoundingClientRect()
  const { backgroundColor, borderTopColor } = getComputedStyle(button)
  return { left, top, backgroundColor, borderTopColor }
}

/**
 * Watches the place of the sidebar button for `ms`, frame by frame: returns the frames in which no
 * sidebar button could be clicked there (moved away, cut off or covered).
 */
function framesWithoutButton(place: { left: number; top: number }, ms: number) {
  return new Promise<number[]>(resolve => {
    const missing: number[] = []
    const start = performance.now()
    const check = () => {
      const elapsed = performance.now() - start
      const hit = document.elementFromPoint(place.left + 18, place.top + 18)
      if (!hit?.closest('button[aria-label^="Seitenleiste"]')) missing.push(Math.round(elapsed))
      if (elapsed < ms) requestAnimationFrame(check)
      else resolve(missing)
    }
    requestAnimationFrame(check)
  })
}

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
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-6 pb-2 md:items-start md:pb-6">
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
          disabled={!controller.canAdd}
          onClick={() => controller.addView()}
        >
          <Plus className="md:hidden" aria-hidden />
          <span className="max-md:sr-only">Ansicht hinzufügen</span>
        </Button>
      </div>
      <div className="min-h-0 flex-1">
        <ViewController controller={controller} closable />
      </div>
    </div>
  )
}

function ViewerApp({ initialViewId }: { initialViewId?: string }) {
  return (
    <AppLayout
      fillViewport
      // The Storybook iframe sizes its root to the content; the ViewController needs a set width
      className="w-screen"
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
 * A letter viewer: title and "Ansicht hinzufügen" above the views. Up to 3 views can be open
 * next to the pinned "Metadaten"; as many as the width allows sit side by side, on a narrow
 * screen 1 at a time. Views that do not fit are reached with a `Pager`. Resize the window, switch
 * the viewport or collapse the sidebar to see the layouts.
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
    const views = canvasElement.querySelector('main')!
    const widthWithSidebar = views.getBoundingClientRect().width
    const toggle = canvas.getByRole('button', { name: 'Seitenleiste einklappen' })
    const openLook = buttonLook(toggle)
    await userEvent.click(toggle)
    // While the sidebar closes (animated), the button stays where it is
    await expect(await framesWithoutButton(openLook, 500)).toEqual([])
    await waitFor(() =>
      expect(views.getBoundingClientRect().width).toBeGreaterThan(widthWithSidebar + 50)
    )
    await expect(letters).not.toBeVisible()
    // The sidebar is gone completely; only the trigger next to the title remains
    const aside = canvasElement.querySelector('aside')!
    await waitFor(() => expect(aside.getBoundingClientRect().width).toBe(0))
    await expect(
      canvas.queryByRole('button', { name: 'Seitenleiste einklappen' })
    ).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' })).toBeVisible()
    // The button stays in place and keeps its look, only the icon changes
    await expect(
      buttonLook(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    ).toEqual(openLook)
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    await waitFor(() =>
      expect(Math.abs(views.getBoundingClientRect().width - widthWithSidebar)).toBeLessThan(2)
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

    // Adding a view operates the controller (whether a pager is needed depends on the width, see
    // the ViewController stories). With 3 views next to "Metadaten" no more can be added.
    const add = canvas.getByRole('button', { name: 'Ansicht hinzufügen' })
    await userEvent.click(add)
    await expect(canvas.queryAllByRole('region')).toHaveLength(4)
    await expect(add).toBeDisabled()
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
    const collapsedLook = buttonLook(
      canvas.getByRole('button', { name: 'Seitenleiste ausklappen' })
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    // The button in the overlay is in the same place and looks the same, only the icon changes
    await expect(
      buttonLook(canvas.getByRole('button', { name: 'Seitenleiste einklappen' }))
    ).toEqual(collapsedLook)
    const letters = canvas.getByRole('navigation', { name: 'Alle Briefe' })
    await expect(letters).toBeVisible()
    // The label in the overlay is regular, as on desktop
    await expect(
      getComputedStyle(canvas.getByRole('heading', { name: 'Alle Briefe' })).fontWeight
    ).toBe('400')
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
