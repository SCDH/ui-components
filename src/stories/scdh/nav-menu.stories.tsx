import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from '@storybook/test'
import { HelpCircleIcon, LogInIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  NavMenu,
  NavMenuItems,
  NavMenuItem,
  NavMenuActions,
  NavMenuMobile,
  NavMenuMobileTrigger,
  NavMenuMobileContent
} from '@/components/ui/nav-menu'

const meta = {
  title: 'SCDH-UI/NavMenu',
  component: NavMenu,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for the NavMenu root'
    }
  }
} satisfies Meta<typeof NavMenu>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Shared render helpers
// ---------------------------------------------------------------------------

/** Renders the desktop nav items (reused across stories). */
function DesktopNavItems() {
  return (
    <NavMenuItems>
      <NavMenuItem active>Home</NavMenuItem>
      <NavMenuItem>Suche</NavMenuItem>
      <NavMenuItem>Sammlungen</NavMenuItem>
      <NavMenuItem>Über uns</NavMenuItem>
    </NavMenuItems>
  )
}

/** Renders the right-aligned action buttons (reused across stories). */
function DesktopActions() {
  return (
    <NavMenuActions>
      <Button variant="link" size="icon" aria-label="Hilfe" onClick={fn()}>
        <HelpCircleIcon />
      </Button>
      <Button variant="link" size="icon" aria-label="Login" onClick={fn()}>
        <LogInIcon />
      </Button>
    </NavMenuActions>
  )
}

/** Renders the mobile nav items inside the sheet (reused across stories). */
function MobileNavItems() {
  return (
    <>
      <NavMenuItem variant="mobile" active>
        Home
      </NavMenuItem>
      <NavMenuItem variant="mobile">Suche</NavMenuItem>
      <NavMenuItem variant="mobile">Sammlungen</NavMenuItem>
      <NavMenuItem variant="mobile">Über uns</NavMenuItem>
    </>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Default desktop navigation.
 * Nav items left-aligned, action buttons right-aligned.
 * Home item is in active state (blue border-bottom).
 * Only one item can be active at a time (radio-group behaviour).
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <NavMenu>
        <DesktopNavItems />
        <DesktopActions />
        <NavMenuMobile>
          <NavMenuMobileTrigger />
          <NavMenuMobileContent>
            <MobileNavItems />
          </NavMenuMobileContent>
        </NavMenuMobile>
      </NavMenu>
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
      <NavMenu>
        <NavMenuItems>
          <NavMenuItem>Home</NavMenuItem>
          <NavMenuItem>Suche</NavMenuItem>
          <NavMenuItem>Sammlungen</NavMenuItem>
          <NavMenuItem>Über uns</NavMenuItem>
        </NavMenuItems>
        <DesktopActions />
        <NavMenuMobile>
          <NavMenuMobileTrigger />
          <NavMenuMobileContent>
            <NavMenuItem variant="mobile">Home</NavMenuItem>
            <NavMenuItem variant="mobile">Suche</NavMenuItem>
            <NavMenuItem variant="mobile">Sammlungen</NavMenuItem>
            <NavMenuItem variant="mobile">Über uns</NavMenuItem>
          </NavMenuMobileContent>
        </NavMenuMobile>
      </NavMenu>
    </div>
  )
}

/**
 * Mobile viewport — hamburger button is visible, desktop nav is hidden.
 * Use the Storybook viewport toolbar to switch to a mobile viewport width.
 */
export const MobileViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <NavMenu>
        <DesktopNavItems />
        <DesktopActions />
        <NavMenuMobile>
          <NavMenuMobileTrigger />
          <NavMenuMobileContent>
            <MobileNavItems />
          </NavMenuMobileContent>
        </NavMenuMobile>
      </NavMenu>
    </div>
  )
}

/**
 * Minimal navigation — only menu items, no action buttons.
 */
export const ItemsOnly: Story = {
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <NavMenu>
        <DesktopNavItems />
        <NavMenuMobile>
          <NavMenuMobileTrigger />
          <NavMenuMobileContent>
            <MobileNavItems />
          </NavMenuMobileContent>
        </NavMenuMobile>
      </NavMenu>
    </div>
  )
}
