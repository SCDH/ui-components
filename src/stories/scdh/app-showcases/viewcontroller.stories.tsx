import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { AppLayout } from '@/components/ui/scdh/app-layout'
import { ViewController, useViewController } from '@/components/ui/scdh/views'
import { Button } from '@/components/ui/button'
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
          'contents of the views do. The sidebar (288px) can be collapsed to give the views more room.'
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
]

function LetterList() {
  return (
    <nav aria-label="Alle Briefe">
      <ul className="overflow-hidden rounded-2xl border border-ulb-grey-200 bg-background py-2 dark:border-border">
        {LETTERS.map((title, i) => (
          <li key={title}>
            <button
              type="button"
              aria-current={i === 0 ? 'page' : undefined}
              className="flex w-full items-center border-l-2 border-transparent px-5 py-3 text-left text-lg text-foreground hover:bg-ulb-grey-050 aria-[current=page]:border-scdh-blue-500 aria-[current=page]:bg-ulb-grey-050 dark:hover:bg-accent dark:aria-[current=page]:bg-accent"
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

function ViewerPage() {
  const controller = useViewController({
    modes: LONG_MODES,
    defaultViews: [METADATA_VIEW, { id: 'reading', mode: 'reading' }, { id: 'tei', mode: 'tei' }]
  })

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h2 className="text-2xl font-medium">PersonB an PersonA</h2>
          <p className="text-md text-ulb-grey-600">2. Oktober 1956</p>
        </div>
        <Button variant="secondary" onClick={() => controller.addView()}>
          <Plus className="md:hidden" aria-hidden />
          <span className="max-md:sr-only">Ansicht hinzufügen</span>
        </Button>
      </div>
      <div className="min-h-0 flex-1 border-t border-ulb-grey-300 dark:border-border">
        <ViewController controller={controller} closable />
      </div>
    </div>
  )
}

/**
 * A letter viewer: title and "Ansicht hinzufügen" above the views. On desktop up to 3 views are
 * visible (the pinned "Metadaten" and 2 others), on tablet 2, on mobile 1. With more views a
 * `Pager` appears. Resize the window or switch the viewport to see the layouts.
 */
export const Demo: Story = {
  render: () => (
    <AppLayout
      fillViewport
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      title="Präsentator"
      sidebar={<LetterList />}
      sidebarTitle="Alle Briefe"
      topNavItems={[
        { label: 'Viewer', isActive: true },
        { label: 'Über das Projekt' },
        { label: 'Netzwerk' }
      ]}
    >
      <ViewerPage />
    </AppLayout>
  ),
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
    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    await waitFor(() =>
      expect(Math.abs(reading.getBoundingClientRect().width - widthWithSidebar)).toBeLessThan(2)
    )
    await expect(letters).toBeVisible()

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
