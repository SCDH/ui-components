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
// Shared render helpers
// ---------------------------------------------------------------------------

/** Renders the desktop nav items (reused across stories). */
function DesktopNavItems() {
  return (
    <MenubarItems>
      <MenubarItem active>Home</MenubarItem>
      <MenubarItem>Suche</MenubarItem>
      <MenubarItem>Sammlungen</MenubarItem>
      <MenubarItem>Über uns</MenubarItem>
    </MenubarItems>
  )
}

/** Renders the right-aligned action buttons (reused across stories). */
function DesktopActions() {
  return (
    <MenubarActions>
      <Button variant="link" size="icon" aria-label="Hilfe" onClick={fn()}>
        <HelpCircleIcon />
      </Button>
      <Button variant="link" size="icon" aria-label="Login" onClick={fn()}>
        <LogInIcon />
      </Button>
    </MenubarActions>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Default desktop navigation.
 * Nav items left-aligned, action buttons right-aligned.
 * Home item is in active state (blue border-bottom).
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <Menubar>
        <DesktopNavItems />
        <DesktopActions />
      </Menubar>
    </div>
  )
}

/**
 * Desktop navigation without active item.
 * All menu items are in default (inactive) state.
 */
export const NoActiveItem: Story = {
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <Menubar>
        <MenubarItems>
          <MenubarItem>Home</MenubarItem>
          <MenubarItem>Suche</MenubarItem>
          <MenubarItem>Sammlungen</MenubarItem>
          <MenubarItem>Über uns</MenubarItem>
        </MenubarItems>
        <DesktopActions />
      </Menubar>
    </div>
  )
}

/**
 * Minimal navigation — only menu items, no action buttons.
 */
export const ItemsOnly: Story = {
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <Menubar>
        <DesktopNavItems />
      </Menubar>
    </div>
  )
}
