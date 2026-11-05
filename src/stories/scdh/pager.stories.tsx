import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Pager } from '@/components/ui/scdh/pager'

const meta = {
  title: 'SCDH-UI/Pager',
  component: Pager,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compact navigation for swipeable pages: arrow buttons with a progress bar between them. ' +
          'The pager does not contain the pages and does not handle swiping itself. The host swipes ' +
          'its pages and passes the resulting `index`; the pager reports `onIndexChange` when the ' +
          'user taps an arrow or a segment of the progress bar. Dragging over the bar does nothing.'
      }
    }
  },
  tags: ['autodocs'],
  args: { count: 3, onIndexChange: fn() },
  decorators: [
    Story => (
      <div className="w-[360px] border border-ulb-grey-300 dark:border-border">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Pager>

export default meta
type Story = StoryObj<typeof meta>

/** Uncontrolled. Arrows are disabled at the ends. */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const previous = canvas.getByRole('button', { name: 'Vorherige Seite' })
    const next = canvas.getByRole('button', { name: 'Nächste Seite' })
    await expect(previous).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Seite 1 von 3' })).toHaveAttribute(
      'aria-current',
      'true'
    )

    await userEvent.click(next)
    await expect(args.onIndexChange).toHaveBeenLastCalledWith(1)
    await expect(canvas.getByRole('button', { name: 'Seite 2 von 3' })).toHaveAttribute(
      'aria-current',
      'true'
    )

    await userEvent.click(next)
    await expect(next).toBeDisabled()
    await expect(args.onIndexChange).toHaveBeenLastCalledWith(2)
  }
}

/** A tap on a segment of the progress bar jumps to that page. */
export const ClickOnProgressBar: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Seite 3 von 3' }))
    await expect(args.onIndexChange).toHaveBeenCalledWith(2)
  }
}

/** Dragging over the progress bar does not change the page. */
export const NoSwipeOnProgressBar: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: canvas.getByRole('button', { name: 'Seite 1 von 3' }) },
      { target: canvas.getByRole('button', { name: 'Seite 3 von 3' }) },
      { keys: '[/MouseLeft]' }
    ])
    await expect(args.onIndexChange).not.toHaveBeenCalled()
    await expect(canvas.getByRole('button', { name: 'Seite 1 von 3' })).toHaveAttribute(
      'aria-current',
      'true'
    )
  }
}

/** Controlled: the host owns the index, e.g. from the scroll position of swiped pages. */
export const Controlled: Story = {
  args: { index: 1 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Nächste Seite' }))
    await expect(args.onIndexChange).toHaveBeenCalledWith(2)
    // Controlled: the index stays until the host changes it
    await expect(canvas.getByRole('button', { name: 'Seite 2 von 3' })).toHaveAttribute(
      'aria-current',
      'true'
    )
  }
}

export const SinglePage: Story = {
  args: { count: 1 }
}

export const ManyPages: Story = {
  args: { count: 12, defaultIndex: 5 }
}

export const DarkMode: Story = {
  decorators: [
    Story => (
      <div className="dark rounded-lg bg-background p-4">
        <Story />
      </div>
    )
  ]
}
