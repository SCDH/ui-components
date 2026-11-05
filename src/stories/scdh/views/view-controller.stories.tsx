import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ViewController, useViewController } from '@/components/ui/scdh/views'
import { Button } from '@/components/ui/button'
import { LONG_MODES, MANY_VIEWS, METADATA_VIEW, MODES, THREE_VIEWS } from './mock-data'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

/**
 * Width of the story frame. In the Storybook iframe the root shrinks to its content (see
 * `place-items: center` on the body in preview.css), so the frame gets the viewport width
 * explicitly. In the docs page the container is block-level and `w-full` is enough.
 */
const frameWidth = (viewMode: string) => (viewMode === 'docs' ? 'w-full' : 'w-[calc(100vw-2rem)]')

/** A view is visible if it lies inside the horizontal bounds of the container it sits in. */
function isInView(view: Element, container: Element) {
  const v = view.getBoundingClientRect()
  const c = container.getBoundingClientRect()
  return v.left >= c.left - 1 && v.right <= c.right + 1
}

const meta = {
  title: 'SCDH-UI/Composites/ViewController',
  component: ViewController,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Arranges views and holds their state: which views are open, which one is active and how ' +
          "each is set. It does not know what a view shows, that is up to the view's mode.\n\n" +
          '- **Desktop:** up to 3 views side by side (e.g. the pinned "Metadaten" and 2 others), ' +
          '**tablet:** up to 2, filling the height of the container. With more views the others are ' +
          'paged through and a `Pager` appears; pinned views stay in place.\n' +
          '- **Small screens:** 1 view at a time. The views sit next to each other and are swiped; a ' +
          '`Pager` below shows and sets the active view.\n' +
          '- `minViews` (default 2) views always stay open; a view with `pinned: true` can not be ' +
          'closed.\n' +
          '- To operate on the views from outside (e.g. an "add view" button), create the state with ' +
          '`useViewController` and pass it as `controller`.\n\n' +
          'Placed in a container with a bounded height, only the view contents scroll. Inside an ' +
          '`AppLayout`, set `fillViewport` so the page does not scroll (see "App Showcases").\n\n' +
          '*Swiping:* where a content scrolls or pans horizontally itself (e.g. source code without ' +
          'wrapping, an image viewer), its gesture wins; swipe on the free area of the view.'
      }
    }
  },
  tags: ['autodocs'],
  args: { modes: MODES, defaultViews: THREE_VIEWS },
  // The controller fills its container, so give it a fixed frame (unless a story brings its own)
  decorators: [
    (Story, { parameters, viewMode }) =>
      parameters.noFrame ? (
        <Story />
      ) : (
        <div
          className={`h-[560px] border border-ulb-grey-300 dark:border-border ${frameWidth(viewMode)}`}
        >
          <Story />
        </div>
      )
  ]
} satisfies Meta<typeof ViewController>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Desktop
// ---------------------------------------------------------------------------

/**
 * Metadata, reading text and TEI source side by side (after the design "3 Ansichten").
 * "Metadaten" is pinned: narrower than the others, no selection, no close button.
 */
export const ThreeViews: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const metadata = canvas.getByRole('region', { name: 'Metadaten' })
    const reading = canvas.getByRole('region', { name: 'Ansicht – Lesetext' })

    // "Metadaten" is narrower: between 50 % and 75 % of a normal view
    const ratio = metadata.getBoundingClientRect().width / reading.getBoundingClientRect().width
    await expect(ratio).toBeGreaterThanOrEqual(0.5)
    await expect(ratio).toBeLessThanOrEqual(0.75)

    // ... and has neither selection nor actions
    await expect(within(metadata).queryByRole('combobox')).not.toBeInTheDocument()
    await expect(within(metadata).queryByRole('button')).not.toBeInTheDocument()

    // Three views fit: no pager
    await expect(
      canvas.queryByRole('navigation', { name: 'Ansicht wechseln' })
    ).not.toBeInTheDocument()
  }
}

/**
 * Desktop shows at most 3 views: the pinned "Metadaten" and 2 others. With more views the others
 * are paged through and a `Pager` appears. "Metadaten" stays in place. Swiping in a view's
 * content moves the pager along, and the pager moves the views.
 */
export const ManyViews: Story = {
  args: { defaultViews: MANY_VIEWS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(window.innerWidth).toBeGreaterThanOrEqual(1024)

    const metadata = canvas.getByRole('region', { name: 'Metadaten' })
    const [v1, v2, v3, v4] = ['v1', 'v2', 'v3', 'v4'].map(id =>
      canvasElement.querySelector(`#${id}`)!
    )
    const track = v1.parentElement!
    const pager = canvas.getByRole('navigation', { name: 'Ansicht wechseln' })
    // 4 paged views, 2 visible at a time: 3 positions
    const segments = within(pager).getAllByRole('button', { name: /^Seite \d von 3$/ })
    const current = () => segments.findIndex(s => s.getAttribute('aria-current') === 'true')

    await expect(current()).toBe(0)
    await expect(isInView(v1, track) && isInView(v2, track)).toBe(true)
    await expect(isInView(v3, track)).toBe(false)

    // Pager -> views
    await userEvent.click(segments[2])
    await waitFor(() => expect(isInView(v3, track) && isInView(v4, track)).toBe(true))
    await expect(isInView(v1, track)).toBe(false)
    await expect(current()).toBe(2)
    // The pinned view did not move
    await expect(isInView(metadata, canvasElement)).toBe(true)

    // Views -> pager (swiping scrolls the track by one view)
    track.scrollTo({ left: track.clientWidth / 2, behavior: 'instant' })
    await waitFor(() => expect(current()).toBe(1))
    await waitFor(() => expect(isInView(v2, track) && isInView(v3, track)).toBe(true))
  }
}

/**
 * Tablet shows at most 2 views: the pinned "Metadaten" and 1 other. With more views the other
 * views are paged through one by one.
 */
export const Tablet: Story = {
  args: { defaultViews: MANY_VIEWS },
  globals: { viewport: { value: 'tablet', isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const metadata = canvas.getByRole('region', { name: 'Metadaten' })
    const [v1, v2] = ['v1', 'v2'].map(id => canvasElement.querySelector(`#${id}`)!)
    const track = v1.parentElement!
    const pager = canvas.getByRole('navigation', { name: 'Ansicht wechseln' })

    // 4 paged views, 1 visible at a time: 4 positions
    await expect(within(pager).getAllByRole('button', { name: /^Seite \d von 4$/ })).toHaveLength(4)
    await expect(isInView(v1, track)).toBe(true)
    await expect(isInView(v2, track)).toBe(false)

    await userEvent.click(within(pager).getByRole('button', { name: 'Nächste Seite' }))
    await waitFor(() => expect(isInView(v2, track)).toBe(true))
    await expect(isInView(v1, track)).toBe(false)
    await expect(isInView(metadata, canvasElement)).toBe(true)
  }
}

/** Long content: each view scrolls on its own, the headers stay in place. */
export const LongContent: Story = {
  args: { modes: LONG_MODES },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reading = canvas.getByRole('region', { name: 'Ansicht – Lesetext' })
    const source = canvas.getByRole('region', { name: 'Ansicht – TEI-Quelltext' })
    const scroller = reading.querySelector<HTMLElement>(':scope > div:last-child')!
    const otherScroller = source.querySelector<HTMLElement>(':scope > div:last-child')!

    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
    scroller.scrollTop = 200
    await waitFor(() => expect(scroller.scrollTop).toBe(200))
    await expect(otherScroller.scrollTop).toBe(0)
    await expect(document.scrollingElement!.scrollTop).toBe(0)
  }
}

/** Dark mode: tokens switch with the `dark` class. */
export const DarkMode: Story = {
  parameters: { noFrame: true },
  decorators: [
    (Story, { viewMode }) => (
      <div className={`dark h-[620px] rounded-lg bg-background p-4 ${frameWidth(viewMode)}`}>
        <div className="h-full border border-ulb-grey-300 dark:border-border">
          <Story />
        </div>
      </div>
    )
  ]
}

// ---------------------------------------------------------------------------
// Adding and closing views (state operated from outside)
// ---------------------------------------------------------------------------

function AddAndCloseDemo({ width }: { width: string }) {
  const controller = useViewController({
    modes: MODES,
    defaultViews: [METADATA_VIEW, { id: 'reading', mode: 'reading' }]
  })
  return (
    <div className={`flex h-[560px] flex-col gap-3 ${width}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">PersonB an PersonA</h2>
        <Button variant="secondary" onClick={() => controller.addView()}>
          Ansicht hinzufügen
        </Button>
      </div>
      <div className="min-h-0 flex-1 border border-ulb-grey-300 dark:border-border">
        <ViewController controller={controller} closable />
      </div>
    </div>
  )
}

/**
 * "Ansicht hinzufügen" lives outside the views and operates the controller via
 * `useViewController`. `minViews` (2) keeps "Metadaten" and one more view open: with only two
 * views left, nothing can be closed.
 */
export const AddAndCloseViews: Story = {
  parameters: { noFrame: true },
  render: (_args, { viewMode }) => <AddAndCloseDemo width={frameWidth(viewMode)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const closeButtons = () => canvas.queryAllByRole('button', { name: /schließen/ })

    // Two views = minViews: nothing can be closed
    await expect(canvas.getAllByRole('region')).toHaveLength(2)
    await expect(closeButtons()).toHaveLength(0)

    // Add one: the new view can be closed, "Metadaten" never
    await userEvent.click(canvas.getByRole('button', { name: 'Ansicht hinzufügen' }))
    await expect(canvas.getAllByRole('region')).toHaveLength(3)
    await expect(closeButtons()).toHaveLength(2)
    await expect(
      within(canvas.getByRole('region', { name: 'Metadaten' })).queryByRole('button', {
        name: /schließen/
      })
    ).not.toBeInTheDocument()

    // Close one: back at minViews, the last remaining view has no close button
    await userEvent.click(closeButtons()[0])
    await expect(canvas.getAllByRole('region')).toHaveLength(2)
    await expect(closeButtons()).toHaveLength(0)

    // More than 3 views: the pager appears, with 3 views it is gone again
    const add = canvas.getByRole('button', { name: 'Ansicht hinzufügen' })
    await userEvent.click(add)
    await expect(
      canvas.queryByRole('navigation', { name: 'Ansicht wechseln' })
    ).not.toBeInTheDocument()
    await userEvent.click(add)
    await expect(canvas.getByRole('navigation', { name: 'Ansicht wechseln' })).toBeInTheDocument()
    await userEvent.click(closeButtons()[0])
    await expect(
      canvas.queryByRole('navigation', { name: 'Ansicht wechseln' })
    ).not.toBeInTheDocument()
  }
}

// ---------------------------------------------------------------------------
// Small screens
// ---------------------------------------------------------------------------

/**
 * Small screen (after the design "Mobile Ansicht"): the views sit next to each other and are
 * swiped in their content area. The `Pager` below follows the swiping and also switches views
 * (arrows, tap on the progress bar). "Metadaten" is the first page and has no close button.
 */
export const Mobile: Story = {
  args: {
    closable: true,
    defaultViews: [...THREE_VIEWS, { id: 'facsimile', mode: 'facsimile' }]
  },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pager = canvas.getByRole('navigation', { name: 'Ansicht wechseln' })
    const segments = within(pager).getAllByRole('button', { name: /^Seite \d von 4$/ })
    const current = () => segments.findIndex(s => s.getAttribute('aria-current') === 'true')
    const track = canvas.getByRole('region', { name: 'Metadaten' }).parentElement!

    await expect(current()).toBe(0)
    await expect(within(pager).getByRole('button', { name: 'Vorherige Seite' })).toBeDisabled()

    // Pager -> views: tap on the progress bar scrolls to that view
    await userEvent.click(segments[2])
    await waitFor(() => expect(current()).toBe(2))
    await waitFor(() => expect(Math.round(track.scrollLeft)).toBe(2 * track.clientWidth))

    // Views -> pager: swiping (here: scrolling) moves the pager along
    track.scrollTo({ left: track.clientWidth, behavior: 'instant' })
    await waitFor(() => expect(current()).toBe(1))

    // Dragging over the progress bar does nothing
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: segments[0] },
      { target: segments[3] },
      { keys: '[/MouseLeft]' }
    ])
    await expect(current()).toBe(1)

    // Pinned view: no close button; the others have one
    await expect(
      within(canvas.getByRole('region', { name: 'Metadaten' })).queryByRole('button', {
        name: /schließen/
      })
    ).not.toBeInTheDocument()
    await expect(
      within(canvas.getByRole('region', { name: 'Ansicht – Lesetext' })).getByRole('button', {
        name: /schließen/
      })
    ).toBeInTheDocument()
  }
}
