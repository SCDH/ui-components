import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelpCircleIcon, LogInIcon } from 'lucide-react'
import {
  NavHeader,
  NavHeaderMobileTrigger,
  NavHeaderMobileContent
} from '@/components/ui/nav-header'
import { Header, HeaderLogo, HeaderTitle } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { NavMenu, NavMenuItems, NavMenuItem, NavMenuActions } from '@/components/ui/nav-menu'
import logoSrc from '@/assets/logo_uni_ms.svg'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'SCDH-UI/NavHeader',
  component: NavHeader,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof NavHeader>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Shared render helpers
// ---------------------------------------------------------------------------

function DesktopNavItems() {
  return (
    <>
      <NavMenuItem active>Home</NavMenuItem>
      <NavMenuItem>Suche</NavMenuItem>
      <NavMenuItem>Sammlungen</NavMenuItem>
      <NavMenuItem>Über uns</NavMenuItem>
    </>
  )
}

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

function MainContent() {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold text-ulb-grey-900 mb-4">Willkommen</h1>
      <p className="text-ulb-grey-700 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p className="text-ulb-grey-700 mb-4">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p className="text-ulb-grey-700">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
        architecto beatae vitae dicta sunt explicabo.
      </p>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Default NavHeader — desktop: Header + NavMenu stacked with content below.
 * Mobile: Hamburger inside Header, menu opens as overlay below the header,
 * main content is blurred.
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-ulb-grey-050">
      <NavHeader>
        {/* z-30 keeps the header above the mobile backdrop */}
        <Header className="relative z-30 max-md:justify-start max-md:gap-4">
          <NavHeaderMobileTrigger />
          <HeaderLogo>
            <img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />
          </HeaderLogo>
          <HeaderTitle className="max-md:hidden">SCDH UI Components</HeaderTitle>
        </Header>

        {/* Desktop nav bar — hidden on mobile */}
        <NavMenu className="max-md:hidden">
          <NavMenuItems>
            <DesktopNavItems />
          </NavMenuItems>
          <NavMenuActions>
            <Button variant="link" size="icon" aria-label="Hilfe">
              <HelpCircleIcon />
            </Button>
            <Button variant="link" size="icon" aria-label="Login">
              <LogInIcon />
            </Button>
          </NavMenuActions>
        </NavMenu>

        {/* Mobile menu overlay */}
        <NavHeaderMobileContent>
          <MobileNavItems />
        </NavHeaderMobileContent>

        <MainContent />
      </NavHeader>
    </div>
  )
}

/**
 * Mobile viewport — hamburger toggles to X, menu overlays the blurred content.
 * Header stays fully visible.
 */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' }
  },
  render: () => (
    <div className="min-h-screen bg-ulb-grey-050">
      <NavHeader>
        <Header className="relative z-30 max-md:justify-start max-md:gap-4">
          <NavHeaderMobileTrigger />
          <HeaderLogo>
            <img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />
          </HeaderLogo>
          <HeaderTitle className="max-md:hidden">SCDH UI Components</HeaderTitle>
        </Header>

        <NavMenu className="max-md:hidden">
          <NavMenuItems>
            <DesktopNavItems />
          </NavMenuItems>
          <NavMenuActions>
            <Button variant="link" size="icon" aria-label="Hilfe">
              <HelpCircleIcon />
            </Button>
            <Button variant="link" size="icon" aria-label="Login">
              <LogInIcon />
            </Button>
          </NavMenuActions>
        </NavMenu>

        <NavHeaderMobileContent>
          <MobileNavItems />
        </NavHeaderMobileContent>

        <MainContent />
      </NavHeader>
    </div>
  )
}

/**
 * Compact variant — no action buttons, no active item.
 */
export const Compact: Story = {
  render: () => (
    <div className="min-h-screen bg-ulb-grey-050">
      <NavHeader>
        <Header className="relative z-30 max-md:justify-start max-md:gap-4">
          <NavHeaderMobileTrigger />
          <HeaderLogo>
            <img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />
          </HeaderLogo>
          <HeaderTitle className="max-md:hidden">SCDH UI Components</HeaderTitle>
        </Header>

        <NavMenu className="max-md:hidden">
          <NavMenuItems>
            <NavMenuItem>Home</NavMenuItem>
            <NavMenuItem>Suche</NavMenuItem>
            <NavMenuItem>Sammlungen</NavMenuItem>
            <NavMenuItem>Über uns</NavMenuItem>
          </NavMenuItems>
        </NavMenu>

        <NavHeaderMobileContent>
          <NavMenuItem variant="mobile">Home</NavMenuItem>
          <NavMenuItem variant="mobile">Suche</NavMenuItem>
          <NavMenuItem variant="mobile">Sammlungen</NavMenuItem>
          <NavMenuItem variant="mobile">Über uns</NavMenuItem>
        </NavHeaderMobileContent>

        <MainContent />
      </NavHeader>
    </div>
  )
}
