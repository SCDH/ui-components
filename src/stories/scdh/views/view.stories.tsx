import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { View } from '@/components/ui/scdh/views'
import { Button } from '@/components/ui/button'
import { MODES, LONG_MODES } from './mock-data'
import { Metadata } from './mock-content'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'SCDH-UI/View',
  component: View,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One view of a document: a fixed header (title, mode selection, actions) above a content ' +
          'area that scrolls on its own. The mode selection decides what the view shows ' +
          '(reading text, TEI source, facsimile). Arranging views is up to the `ViewController`.'
      }
    }
  },
  tags: ['autodocs'],
  args: {
    id: 'view',
    title: 'Ansicht',
    modes: MODES
  },
  // A view fills its container, so give it a fixed frame
  decorators: [
    (Story, { parameters }) =>
      parameters.noFrame ? (
        <Story />
      ) : (
        <div className="flex h-[420px] max-w-xl border border-ulb-grey-300 dark:border-border">
          <Story />
        </div>
      )
  ]
} satisfies Meta<typeof View>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Header with "Ansicht" and a mode selection. Selecting a mode switches the content. */
export const Default: Story = {
  args: { onModeChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Ansicht – Lesetext' })
    await expect(within(region).getByText(/Sehr geehrter Herr Kollege/)).toBeVisible()

    await userEvent.click(canvas.getByRole('combobox'))
    // The options are rendered in a portal
    await userEvent.click(
      await within(document.body).findByRole('option', { name: 'TEI-Quelltext' })
    )

    await expect(args.onModeChange).toHaveBeenCalledWith('tei')
    await waitFor(() =>
      expect(canvas.getByRole('region', { name: 'Ansicht – TEI-Quelltext' })).toBeVisible()
    )
    await expect(canvas.getByText(/<TEI xmlns/)).toBeVisible()
  }
}

/** A view without modes: just a title and content, e.g. the pinned metadata view. */
export const SingleMode: Story = {
  args: { id: 'metadata', title: 'Metadaten', modes: undefined, children: <Metadata /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Metadaten' })).toBeVisible()
    await expect(canvas.queryByRole('combobox')).not.toBeInTheDocument()
  }
}

/** Extra buttons on the right of the header. */
export const WithActions: Story = {
  args: {
    actions: (
      <Button variant="secondary" size="sm">
        Kopieren
      </Button>
    )
  }
}

const scrollerRef = React.createRef<HTMLDivElement>()

/** Long content: only the content scrolls, the header stays. `contentRef` reaches the scroller. */
export const LongContent: Story = {
  args: { modes: LONG_MODES },
  render: args => <View {...args} contentRef={scrollerRef} />,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Ansicht – Lesetext' })
    const scroller = scrollerRef.current!
    const header = region.querySelector('header')!

    await expect(region).toContainElement(scroller)
    await expect(scroller).not.toContainElement(header)
    await expect(getComputedStyle(scroller).overflowY).toBe('auto')
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)

    const headerTop = header.getBoundingClientRect().top
    scroller.scrollTop = 120
    await waitFor(() => expect(scroller.scrollTop).toBe(120))
    await expect(header.getBoundingClientRect().top).toBe(headerTop)
  }
}

/** Dark mode: tokens switch with the `dark` class. */
export const DarkMode: Story = {
  parameters: { noFrame: true },
  decorators: [
    Story => (
      <div className="dark rounded-lg bg-background p-4">
        <div className="flex h-[420px] max-w-xl border border-ulb-grey-300 dark:border-border">
          <Story />
        </div>
      </div>
    )
  ]
}
