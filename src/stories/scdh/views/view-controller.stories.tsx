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

/** Horizontal bounds of an element, relative to the inner edge of the story frame. */
function bounds(el: Element, frame: Element) {
  const r = el.getBoundingClientRect()
  const f = frame.getBoundingClientRect()
  const left = f.left + frame.clientLeft
  return { left: r.left - left, right: left + frame.clientWidth - r.right, width: r.width }
}

/** `actual` equals `expected` within 1px (sub-pixel rounding). */
async function expectPx(actual: number, expected: number) {
  await expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1)
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
          '- **Width:** up to 3 views can be open next to the pinned "Metadaten". As many as fit ' +
          'sit side by side (views 320-600px, "Metadaten" half a view, 200-300px); the others are ' +
          'paged through with a `Pager`. Once all columns are at their maximum, the controller is ' +
          'centred. It has a padding of 24px on either side.\n' +
          '- **Narrow:** too narrow for "Metadaten" next to a view, it shows 1 view at a time. The ' +
          'views sit next to each other and are swiped; a `Pager` below shows and sets the active ' +
          'view.\n' +
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
          data-testid="frame"
          className={`h-[560px] border border-ulb-grey-300 dark:border-border ${parameters.frameWidth ? 'box-content' : frameWidth(viewMode)}`}
          style={parameters.frameWidth ? { width: parameters.frameWidth } : undefined}
        >
          <Story />
        </div>
      )
  ]
} satisfies Meta<typeof ViewController>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Widths
// ---------------------------------------------------------------------------

/**
 * One text view in a wide area: the text view stops at its maximum of 600px, the metadata column
 * keeps the ratio 1:2 (300px). What is left stays free as white space on both sides.
 */
export const CentredWhenWide: Story = {
  args: { defaultViews: [METADATA_VIEW, { id: 'reading', mode: 'reading' }] },
  parameters: { frameWidth: 1200 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frame = canvas.getByTestId('frame')
    const metadata = bounds(canvas.getByRole('region', { name: 'Metadaten' }), frame)
    const reading = bounds(canvas.getByRole('region', { name: 'Ansicht – Lesetext' }), frame)

    // Metadata 300px plus its 1px separator, text 600px, 32px apart
    await expectPx(metadata.width, 301)
    await expectPx(reading.width, 600)
    await expectPx(1200 - metadata.left - metadata.width - reading.right - reading.width, 32)
    // Centred: (1200 - 933) / 2 = 133.5px on either side
    await expectPx(metadata.left, 133.5)
    await expectPx(reading.right, 133.5)
  }
}

/**
 * Metadata, reading text and TEI source in a 977px area (after the design "Mind 3 Views": 929px
 * for the columns, 24px padding on either side): the metadata column stays at its minimum of
 * 200px, the two text views share the rest. "Metadaten" is
 * pinned: no selection, no close button, a grey background and the only separator on its right.
 * The lines below the headers are level.
 */
export const ThreeViews: Story = {
  parameters: { frameWidth: 977 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frame = canvas.getByTestId('frame')
    const metadata = canvas.getByRole('region', { name: 'Metadaten' })
    const reading = canvas.getByRole('region', { name: 'Ansicht – Lesetext' })
    const source = canvas.getByRole('region', { name: 'Ansicht – TEI-Quelltext' })

    // 200 + 1 + 32 + 332 + 32 + 332 = 929: no white space besides the 24px padding
    await expectPx(bounds(metadata, frame).width, 201)
    await expectPx(bounds(reading, frame).width, 332)
    await expectPx(bounds(source, frame).width, 332)
    await expectPx(bounds(metadata, frame).left, 24)
    await expectPx(bounds(source, frame).right, 24)

    // Only "Metadaten" has a separator
    await expect(getComputedStyle(metadata).borderRightWidth).toBe('1px')
    for (const view of [reading, source]) {
      await expect(getComputedStyle(view).borderLeftWidth).toBe('0px')
      await expect(getComputedStyle(view).borderRightWidth).toBe('0px')
    }

    // The lines below the headers are level
    const headerBottoms = [metadata, reading, source].map(
      v => v.querySelector('header')!.getBoundingClientRect().bottom
    )
    await expect(new Set(headerBottoms).size).toBe(1)

    // The grey background of "Metadaten" reaches down to the bottom (ulb-grey-050)
    const content = metadata.querySelector<HTMLElement>(':scope > div:last-child')!
    await expect(getComputedStyle(content).backgroundColor).toBe('rgb(247, 247, 247)')
    await expectPx(content.getBoundingClientRect().bottom, metadata.getBoundingClientRect().bottom)

    // "Metadaten" has neither selection nor actions
    await expect(within(metadata).queryByRole('combobox')).not.toBeInTheDocument()
    await expect(within(metadata).queryByRole('button')).not.toBeInTheDocument()

    // Everything fits: no pager
    await expect(
      canvas.queryByRole('navigation', { name: 'Ansicht wechseln' })
    ).not.toBeInTheDocument()
  }
}

// ---------------------------------------------------------------------------
// Paging
// ---------------------------------------------------------------------------

/**
 * More views than fit: at 1000px two views fit next to "Metadaten", the third is paged to and a
 * `Pager` appears. "Metadaten" stays in place. Swiping in a view's content moves the pager along,
 * and the pager moves the views.
 */
export const ManyViews: Story = {
  args: { defaultViews: MANY_VIEWS },
  parameters: { frameWidth: 1000 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const metadata = canvas.getByRole('region', { name: 'Metadaten' })
    const [v1, v2, v3] = ['v1', 'v2', 'v3'].map(id =>
      canvasElement.querySelector<HTMLElement>(`#${id}`)!
    )
    const track = v1.parentElement!
    const pager = canvas.getByRole('navigation', { name: 'Ansicht wechseln' })
    // 3 paged views, 2 visible at a time: 2 positions
    const segments = within(pager).getAllByRole('button', { name: /^Seite \d von 2$/ })
    const current = () => segments.findIndex(s => s.getAttribute('aria-current') === 'true')

    await expect(segments).toHaveLength(2)
    await expect(current()).toBe(0)
    await expect(isInView(v1, track) && isInView(v2, track)).toBe(true)
    await expect(isInView(v3, track)).toBe(false)

    // Pager -> views
    await userEvent.click(segments[1])
    await waitFor(() => expect(isInView(v2, track) && isInView(v3, track)).toBe(true))
    await expect(isInView(v1, track)).toBe(false)
    await expect(current()).toBe(1)
    // The pinned view did not move
    await expect(isInView(metadata, canvasElement)).toBe(true)

    // Views -> pager (swiping scrolls the track back by one view)
    track.scrollTo({ left: 0, behavior: 'instant' })
    await waitFor(() => expect(current()).toBe(0))
    await waitFor(() => expect(isInView(v1, track) && isInView(v2, track)).toBe(true))
  }
}

/** A wide area shows all three views next to "Metadaten" (from 1257px on), without a pager. */
export const ThreeSideBySide: Story = {
  args: { defaultViews: MANY_VIEWS },
  parameters: { frameWidth: 1400 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [v1, v2, v3] = ['v1', 'v2', 'v3'].map(id => canvasElement.querySelector(`#${id}`)!)
    const track = v1.parentElement!

    await expect(isInView(v1, track) && isInView(v2, track) && isInView(v3, track)).toBe(true)
    await expect(
      canvas.queryByRole('navigation', { name: 'Ansicht wechseln' })
    ).not.toBeInTheDocument()
  }
}

/** A very wide area: all columns at their maximum, the rest stays free on both sides. */
export const AllAtMaximum: Story = {
  args: { defaultViews: MANY_VIEWS },
  parameters: { frameWidth: 2600 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frame = canvas.getByTestId('frame')
    const metadata = bounds(canvas.getByRole('region', { name: 'Metadaten' }), frame)
    const v3 = bounds(canvasElement.querySelector('#v3')!, frame)

    // 301 + 32 + 3 × 600 + 2 × 32 = 2197, centred
    await expectPx(metadata.width, 301)
    await expectPx(v3.width, 600)
    await expectPx(metadata.left, (2600 - 2197) / 2)
    await expectPx(v3.right, (2600 - 2197) / 2)
  }
}

/** A narrower area (here 700px): one view next to "Metadaten", the others are paged one by one. */
export const OneSideBySide: Story = {
  args: { defaultViews: MANY_VIEWS },
  parameters: { frameWidth: 700 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const metadata = canvas.getByRole('region', { name: 'Metadaten' })
    const [v1, v2] = ['v1', 'v2'].map(id => canvasElement.querySelector(`#${id}`)!)
    const track = v1.parentElement!
    const pager = canvas.getByRole('navigation', { name: 'Ansicht wechseln' })

    // 3 paged views, 1 visible at a time: 3 positions
    await expect(within(pager).getAllByRole('button', { name: /^Seite \d von 3$/ })).toHaveLength(3)
    await expect(isInView(v1, track)).toBe(true)
    await expect(isInView(v2, track)).toBe(false)

    await userEvent.click(within(pager).getByRole('button', { name: 'Nächste Seite' }))
    await waitFor(() => expect(isInView(v2, track)).toBe(true))
    await expect(isInView(v1, track)).toBe(false)
    await expect(isInView(metadata, canvasElement)).toBe(true)
  }
}

/**
 * Resizing keeps the active view in sight, also when switching to swiping, to all views side by
 * side and back (here 700 → 640 → 500 → 400 → 1400 → 700px).
 */
export const ResizeKeepsActiveView: Story = {
  args: { defaultViews: MANY_VIEWS },
  parameters: { frameWidth: 700 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frame = canvas.getByTestId('frame')
    const v3 = canvasElement.querySelector<HTMLElement>('#v3')!
    const track = v3.parentElement!
    const settled = () => new Promise(resolve => setTimeout(resolve, 600))

    await userEvent.click(canvas.getByRole('button', { name: 'Seite 3 von 3' }))
    await waitFor(() => expect(isInView(v3, track)).toBe(true))

    // [width, pager pages]; at 1400px all views fit and there is no pager
    for (const [width, pages] of [
      [640, 3],
      [500, 4],
      [400, 4],
      [1400, 0],
      [700, 3]
    ]) {
      // In small steps, frame by frame, as when dragging the edge of a window
      const from = frame.clientWidth
      for (let i = 1; i <= 10; i++) {
        frame.style.width = `${from + ((width - from) * i) / 10}px`
        await new Promise(requestAnimationFrame)
      }
      await waitFor(() => expect(isInView(v3, track)).toBe(true))
      await settled()
      await expect(isInView(v3, track)).toBe(true)
      if (pages > 0) {
        await expect(
          canvas.getByRole('button', { name: `Seite ${pages} von ${pages}` })
        ).toHaveAttribute('aria-current', 'true')
      }
    }
  }
}

/**
 * The switch to swiping: at 601px "Metadaten" (200px) and a view (320px) still fit next to each
 * other (200 + 1 + 32 + 320 = 553, plus 2 × 24px padding), at 600px all views are swiped.
 */
export const SwipeThreshold: Story = {
  parameters: { frameWidth: 601 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frame = canvas.getByTestId('frame')
    const metadata = canvas.getByRole('region', { name: 'Metadaten' })
    const reading = canvas.getByRole('region', { name: 'Ansicht – Lesetext' })

    await expect(metadata.parentElement).not.toBe(reading.parentElement)
    await expectPx(bounds(metadata, frame).width, 201)
    await expectPx(bounds(reading, frame).width, 320)

    frame.style.width = '600px'
    await waitFor(() =>
      expect(canvas.getByRole('region', { name: 'Metadaten' }).parentElement).toBe(
        canvas.getByRole('region', { name: 'Ansicht – Lesetext' }).parentElement
      )
    )
  }
}

/** Only "Metadaten" open (`minViews` 1): the column stands alone, centred. */
export const OnlyMetadata: Story = {
  args: { defaultViews: [METADATA_VIEW], minViews: 1 },
  parameters: { frameWidth: 1200 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const metadata = bounds(
      canvas.getByRole('region', { name: 'Metadaten' }),
      canvas.getByTestId('frame')
    )
    await expectPx(metadata.left, metadata.right)
  }
}

/** The content elements each view has had, by view id. */
const contents = new Map<string, Set<HTMLDivElement>>()

/** Each view is set up once when the controller first appears, in its place. */
export const MountsOnce: Story = {
  args: {
    getContentRef: (id: string) => (el: HTMLDivElement | null) => {
      if (el) contents.set(id, (contents.get(id) ?? new Set()).add(el))
    }
  },
  parameters: { frameWidth: 1200 },
  beforeEach: () => contents.clear(),
  play: async () => {
    await expect(Object.fromEntries([...contents].map(([id, els]) => [id, els.size]))).toEqual({
      metadata: 1,
      reading: 1,
      tei: 1
    })
  }
}

/**
 * Too narrow for "Metadaten" next to a view (below 601px: 553px for the columns plus the 24px
 * padding on either side), even on a wide screen: one view at a time, "Metadaten" first, all of
 * them swiped. "Metadaten" keeps its look, the padding stays.
 */
export const NarrowArea: Story = {
  parameters: { frameWidth: 540 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(window.innerWidth).toBeGreaterThanOrEqual(768)
    const frame = canvas.getByTestId('frame')
    const metadata = canvas.getByRole('region', { name: 'Metadaten' })
    const reading = canvas.getByRole('region', { name: 'Ansicht – Lesetext' })
    const pager = canvas.getByRole('navigation', { name: 'Ansicht wechseln' })

    // All three views are pages of the swipe, "Metadaten" first and as wide as the area
    await expect(within(pager).getAllByRole('button', { name: /^Seite \d von 3$/ })).toHaveLength(3)
    await expect(metadata.parentElement).toBe(reading.parentElement)
    await expectPx(bounds(metadata, frame).width, 540 - 2 * 24)
    await expectPx(bounds(metadata, frame).left, 24)
    await expect(isInView(reading, metadata.parentElement!)).toBe(false)

    // Still the look of the pinned column: grey content, indented title
    const content = metadata.querySelector<HTMLElement>(':scope > div:last-child')!
    await expect(getComputedStyle(content).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    await expect(getComputedStyle(metadata.querySelector('header > span')!).paddingLeft).toBe(
      '16px'
    )
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
        <Button
          variant="secondary"
          disabled={!controller.canAdd}
          onClick={() => controller.addView()}
        >
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
 * views left, nothing can be closed. With 3 views next to "Metadaten" no more can be added
 * (`canAdd`), the button is disabled.
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

    // At most 3 views next to "Metadaten": then nothing more can be added
    const add = canvas.getByRole('button', { name: 'Ansicht hinzufügen' })
    await userEvent.click(add)
    await userEvent.click(add)
    await expect(canvas.getAllByRole('region')).toHaveLength(4)
    await expect(add).toBeDisabled()
    // Closing one makes room again
    await userEvent.click(closeButtons()[0])
    await expect(canvas.getAllByRole('region')).toHaveLength(3)
    await expect(add).toBeEnabled()
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
