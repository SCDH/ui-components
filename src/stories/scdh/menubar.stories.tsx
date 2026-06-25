import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from '@storybook/test'
import { HelpCircleIcon, LogInIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Menubar, MenubarItems, MenubarItem, MenubarActions } from '@/components/ui/menubar'

const meta = {
  title: 'SCDH-UI/Menubar',
  component: Menubar,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for the Menubar root'
    }
  }
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Static data (hoisted per rerender-no-inline-components)
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Suche' },
  { id: 'collections', label: 'Sammlungen' },
  { id: 'about', label: 'Über uns' }
] as const

// ---------------------------------------------------------------------------
// SelectableMenubar — interactive wrapper for stories
//
// Simulates the production pattern where active state is derived from the
// current URL (via NavLink / useLocation). In Storybook we track it with
// local state so clicking an item visibly marks it as active.
// ---------------------------------------------------------------------------

interface SelectableMenubarProps {
  /** ID of the initially active item, or undefined for none. */
  initialActiveId?: string
  /** Whether to show the action buttons (Help, Login). */
  showActions?: boolean
}

function SelectableMenubar({
  initialActiveId = 'home',
  showActions = true
}: SelectableMenubarProps) {
  const [activeId, setActiveId] = React.useState(initialActiveId)

  const handleSelect = React.useCallback((id: string) => {
    setActiveId(id)
  }, [])

  return (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <Menubar>
        <MenubarItems>
          {NAV_ITEMS.map(item => (
            <MenubarItem
              key={item.id}
              active={activeId === item.id}
              onClick={() => handleSelect(item.id)}
            >
              {item.label}
            </MenubarItem>
          ))}
        </MenubarItems>

        {showActions && (
          <MenubarActions>
            <Button variant="link" size="icon" aria-label="Hilfe" onClick={fn()}>
              <HelpCircleIcon />
            </Button>
            <Button variant="link" size="icon" aria-label="Login" onClick={fn()}>
              <LogInIcon />
            </Button>
          </MenubarActions>
        )}
      </Menubar>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Default desktop navigation.
 * Nav items left-aligned, action buttons right-aligned.
 * Click any item to activate it — the active item gets a blue bottom border.
 * "Home" is initially active, matching the production `NavLink` pattern
 * where the current URL determines the active state.
 */
export const Default: Story = {
  render: () => <SelectableMenubar />
}

/**
 * Desktop navigation with no initially active item.
 * Click any item to mark it as active. This demonstrates the "cold start"
 * state before any navigation has occurred.
 */
export const NoActiveItem: Story = {
  render: () => <SelectableMenubar initialActiveId={undefined} />
}

/**
 * Minimal navigation — only menu items, no action buttons.
 * Click any item to activate it.
 */
export const ItemsOnly: Story = {
  render: () => <SelectableMenubar showActions={false} />
}
