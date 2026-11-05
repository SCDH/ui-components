import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'
import { expect, userEvent, within } from 'storybook/test'
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
          'contents of the views do. The sidebar takes 320px, which is what is left for the views.'
      }
    }
  }
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Sidebar: list of all letters (desktop and tablet; on mobile AppLayout moves it into the menu)
// ---------------------------------------------------------------------------

const LETTERS = [
  { title: 'PersonB an PersonA', date: '2.10.1956' },
  { title: 'PersonA an PersonB', date: '15.1.1957' },
  { title: 'PersonC an PersonA', date: '3.3.1957' },
  { title: 'PersonA an PersonC', date: '19.4.1957' },
  { title: 'PersonD an PersonB', date: '8.8.1958' }
]

function LetterList() {
  return (
    <nav aria-label="Alle Briefe" className="flex flex-col gap-4 pt-4">
      <h2 className="px-1 text-lg font-medium">Alle Briefe</h2>
      <ul className="overflow-hidden rounded-xl border border-ulb-grey-200 bg-background">
        {LETTERS.map((letter, i) => (
          <li key={letter.title}>
            <button
              type="button"
              aria-current={i === 0 ? 'page' : undefined}
              className="flex w-full flex-col px-4 py-2 text-left text-md text-foreground hover:bg-ulb-grey-100 aria-[current=page]:border-l-2 aria-[current=page]:border-scdh-blue-700 aria-[current=page]:bg-ulb-grey-100"
            >
              <span className="text-lg">{letter.title}</span>
              <span className="text-ulb-grey-600">{letter.date}</span>
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
