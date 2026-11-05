import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { EntryList } from '@/components/ui/scdh/entry-list'

const ENTRIES = [
  { id: 'e1', label: 'Eintrag 1' },
  { id: 'e2', label: 'Weiterer Eintrag' },
  { id: 'e3', label: 'Weiterer Eintrag 3' },
  { id: 'e4', label: 'Eintrag 4' },
  { id: 'e5', label: 'Eintrag 5' },
  { id: 'e6', label: 'Eintrag 6' }
]

const meta = {
  title: 'SCDH-UI/EntryList',
  component: EntryList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'List of entries in a card, e.g. all letters in the sidebar ("Alle Briefe"). The ' +
          'selected entry is shown on grey with a blue edge on the left. Entries are buttons, or ' +
          'links when they have an `href`. Selecting is controlled (`value` + `onValueChange`) or ' +
          'uncontrolled (`defaultValue`).'
      }
    }
  },
  tags: ['autodocs'],
  args: {
    entries: ENTRIES,
    defaultValue: 'e2',
    onValueChange: fn(),
    'aria-label': 'Alle Briefe'
  },
  // The list sits on the grey of the sidebar
  decorators: [
    Story => (
      <div className="w-72 bg-ulb-grey-050 p-6">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof EntryList>

export default meta
type Story = StoryObj<typeof meta>

/** The second entry is selected. A click selects another one and reports its id. */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Weiterer Eintrag' })).toHaveAttribute(
      'aria-current',
      'page'
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Eintrag 4' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('e4')
    await expect(canvas.getByRole('button', { name: 'Eintrag 4' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    await expect(canvas.getByRole('button', { name: 'Weiterer Eintrag' })).not.toHaveAttribute(
      'aria-current'
    )
  }
}

/** Nothing selected. */
export const NoSelection: Story = {
  args: { defaultValue: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('button')).toHaveLength(6)
    await expect(canvasElement.querySelector('[aria-current]')).toBeNull()
  }
}

/** Controlled: the parent owns `value`, a click only reports the id. */
export const Controlled: Story = {
  args: { value: 'e1', defaultValue: undefined },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Eintrag 5' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('e5')
    // Nothing changes until the parent passes a new `value`
    await expect(canvas.getByRole('button', { name: 'Eintrag 1' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    await expect(canvas.getByRole('button', { name: 'Eintrag 5' })).not.toHaveAttribute(
      'aria-current'
    )
  }
}

/** Entries with an `href` are links, e.g. for routing. */
export const WithLinks: Story = {
  args: {
    entries: ENTRIES.map(e => ({ ...e, href: `#${e.id}` })),
    defaultValue: 'e1'
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('link')).toHaveLength(6)
    await expect(canvas.getByRole('link', { name: 'Eintrag 1' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    // The `#` links would navigate the Storybook iframe
    canvasElement.addEventListener('click', e => e.preventDefault())
    await userEvent.click(canvas.getByRole('link', { name: 'Weiterer Eintrag 3' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('e3')
    // Not styled by the host page's link rules
    await expect(
      getComputedStyle(canvas.getByRole('link', { name: 'Weiterer Eintrag 3' })).textDecorationLine
    ).toBe('none')
  }
}

export const ManyEntries: Story = {
  args: {
    entries: Array.from({ length: 15 }, (_, i) => ({
      id: `m${i + 1}`,
      label: `PersonA an PersonB, Brief ${i + 1}`
    })),
    defaultValue: 'm3'
  }
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
