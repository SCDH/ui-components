import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpenIcon, FolderIcon, SettingsIcon, UsersIcon } from 'lucide-react'
import { Sidebar, SidebarToggle, SidebarContent } from '@/components/ui/sidebar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

const meta = {
  title: 'SCDH-UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default sidebar with collapse toggle and example navigation items.
 * The toggle button collapses the sidebar from w-64 to w-16.
 */
export const Default: Story = {
  render: () => (
    <div
      className="min-h-screen bg-ulb-grey-050"
      style={{ '--header-height': '0px' } as React.CSSProperties}
    >
      <Sidebar>
        <SidebarToggle />
        <SidebarContent>
          <nav className="flex flex-col gap-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-ulb-grey-700 hover:bg-ulb-grey-100 text-md"
            >
              <FolderIcon className="size-4 flex-shrink-0" />
              <span>Dokumente</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-ulb-grey-700 hover:bg-ulb-grey-100 text-md"
            >
              <UsersIcon className="size-4 flex-shrink-0" />
              <span>Personen</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-ulb-grey-700 hover:bg-ulb-grey-100 text-md"
            >
              <BookOpenIcon className="size-4 flex-shrink-0" />
              <span>Sammlungen</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-ulb-grey-700 hover:bg-ulb-grey-100 text-md"
            >
              <SettingsIcon className="size-4 flex-shrink-0" />
              <span>Einstellungen</span>
            </a>
          </nav>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}

/**
 * Sidebar with a TreeView-like structure using Accordion components.
 * Each section can be expanded/collapsed independently.
 */
export const WithTreeView: Story = {
  render: () => (
    <div
      className="min-h-screen bg-ulb-grey-050"
      style={{ '--header-height': '0px' } as React.CSSProperties}
    >
      <Sidebar>
        <SidebarToggle />
        <SidebarContent>
          <Accordion type="multiple" className="w-full">
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
        </SidebarContent>
      </Sidebar>
    </div>
  )
}

/**
 * Collapsed sidebar.
 * Only icons inside the collapsed state remain visible via the toggle button.
 */
export const Collapsed: Story = {
  render: () => (
    <div
      className="min-h-screen bg-ulb-grey-050"
      style={{ '--header-height': '0px' } as React.CSSProperties}
    >
      <Sidebar>
        <SidebarToggle />
        <SidebarContent>
          <nav className="flex flex-col gap-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-ulb-grey-700 hover:bg-ulb-grey-100"
            >
              <FolderIcon className="size-4" />
              <span>Dokumente</span>
            </a>
          </nav>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Click the toggle to collapse
    const toggle = canvasElement.querySelector('button') as HTMLButtonElement
    if (toggle) toggle.click()
  }
}
