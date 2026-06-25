import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelpCircleIcon, LogInIcon, FolderIcon, UsersIcon, BookOpenIcon } from 'lucide-react'
import { AppLayout } from '@/components/ui/app-layout'
import type { TopNavItem } from '@/components/ui/app-layout'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import logoSrc from '@/assets/logo_uni_ms.svg'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'SCDH-UI/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  args: {
    title: 'SCDH UI Components'
  }
} satisfies Meta<typeof AppLayout>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Shared mock data
// ---------------------------------------------------------------------------

const topNavItems: TopNavItem[] = [
  { label: 'Home', href: '#', isActive: true },
  { label: 'Suche', href: '#' },
  { label: 'Sammlungen', href: '#' },
  { label: 'Über uns', href: '#' },
  {
    label: '',
    actions: (
      <>
        <Button variant="link" size="icon" aria-label="Hilfe">
          <HelpCircleIcon />
        </Button>
        <Button variant="link" size="icon" aria-label="Login">
          <LogInIcon />
        </Button>
      </>
    )
  }
]

const sidebarContent = (
  <Accordion type="multiple" className="w-full" defaultValue={['facet-1']}>
    <AccordionItem value="facet-1">
      <AccordionTrigger className="text-md text-ulb-grey-800 py-2">
        <FolderIcon className="size-4 mr-2" />
        Epoche
      </AccordionTrigger>
      <AccordionContent>
        <nav className="flex flex-col gap-0.5 pl-2">
          <a
            href="#"
            className="px-3 py-1.5 rounded-md text-sm text-ulb-grey-700 hover:bg-ulb-grey-100"
          >
            Antike (42)
          </a>
          <a
            href="#"
            className="px-3 py-1.5 rounded-md text-sm text-scdh-blue-700 bg-scdh-blue-050"
          >
            Mittelalter (128)
          </a>
          <a
            href="#"
            className="px-3 py-1.5 rounded-md text-sm text-ulb-grey-700 hover:bg-ulb-grey-100"
          >
            Neuzeit (67)
          </a>
        </nav>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="facet-2">
      <AccordionTrigger className="text-md text-ulb-grey-800 py-2">
        <UsersIcon className="size-4 mr-2" />
        Autor:in
      </AccordionTrigger>
      <AccordionContent>
        <nav className="flex flex-col gap-0.5 pl-2">
          <a
            href="#"
            className="px-3 py-1.5 rounded-md text-sm text-ulb-grey-700 hover:bg-ulb-grey-100"
          >
            Goethe, J.W. (15)
          </a>
          <a
            href="#"
            className="px-3 py-1.5 rounded-md text-sm text-ulb-grey-700 hover:bg-ulb-grey-100"
          >
            Schiller, F. (9)
          </a>
        </nav>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="facet-3">
      <AccordionTrigger className="text-md text-ulb-grey-800 py-2">
        <BookOpenIcon className="size-4 mr-2" />
        Sammlung
      </AccordionTrigger>
      <AccordionContent>
        <nav className="flex flex-col gap-0.5 pl-2">
          <a
            href="#"
            className="px-3 py-1.5 rounded-md text-sm text-ulb-grey-700 hover:bg-ulb-grey-100"
          >
            Handschriften (34)
          </a>
          <a
            href="#"
            className="px-3 py-1.5 rounded-md text-sm text-ulb-grey-700 hover:bg-ulb-grey-100"
          >
            Inkunabeln (21)
          </a>
        </nav>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const footerContent = (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-ulb-grey-600">
    <span>&copy; {new Date().getFullYear()} SCDH Münster</span>
    <nav className="flex gap-4">
      <a href="#" className="hover:text-ulb-grey-900 transition-colors">
        Impressum
      </a>
      <a href="#" className="hover:text-ulb-grey-900 transition-colors">
        Datenschutz
      </a>
    </nav>
  </div>
)

const MainContent = () => (
  <div className="p-8">
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
      laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
      beatae vitae dicta sunt explicabo.
    </p>
  </div>
)

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Full desktop layout with Header, Menubar, Sidebar, Content, and Footer.
 * - Header: Logo + centered title
 * - Menubar: Nav items left, action buttons right, Home item active
 * - Sidebar: Collapsible with Accordion-based facets
 * - Footer: Copyright + legal links
 */
export const Desktop: Story = {
  render: () => (
    <AppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      title="SCDH UI Components"
      topNavItems={topNavItems}
      sidebar={sidebarContent}
      footer={footerContent}
    >
      <MainContent />
    </AppLayout>
  )
}

/**
 * Desktop layout with Sidebar initially collapsed.
 */
export const DesktopCollapsedSidebar: Story = {
  render: () => (
    <AppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      title="SCDH UI Components"
      topNavItems={topNavItems}
      sidebar={sidebarContent}
      footer={footerContent}
    >
      <MainContent />
    </AppLayout>
  ),
  play: async ({ canvasElement }) => {
    // Click the sidebar toggle to collapse
    const toggle = canvasElement.querySelector(
      '[aria-label="Seitenleiste einklappen"]'
    ) as HTMLButtonElement
    if (toggle) toggle.click()
  }
}

/**
 * Mobile viewport — hamburger button opens a Sheet.
 * The Sheet contains topNavItems, a Separator, and the sidebar Accordion.
 * Use the Storybook viewport toolbar to switch to a mobile viewport width.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: () => (
    <AppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      title="SCDH UI Components"
      topNavItems={topNavItems}
      sidebar={sidebarContent}
      footer={footerContent}
    >
      <MainContent />
    </AppLayout>
  )
}

/**
 * Tablet viewport — Menubar is visible, sidebar fits alongside content.
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  },
  render: () => (
    <AppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      title="SCDH UI Components"
      topNavItems={topNavItems}
      sidebar={sidebarContent}
      footer={footerContent}
    >
      <MainContent />
    </AppLayout>
  )
}

/**
 * Minimal layout — no sidebar, no footer, just Header + Menubar + Content.
 */
export const Minimal: Story = {
  render: () => (
    <AppLayout
      logo={<img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />}
      title="Minimal App"
      topNavItems={[
        { label: 'Home', href: '#', isActive: true },
        { label: 'About', href: '#' }
      ]}
    >
      <MainContent />
    </AppLayout>
  )
}
