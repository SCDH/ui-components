import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpenIcon, FolderIcon, SettingsIcon, UsersIcon } from 'lucide-react'
import { Sidebar, SidebarToggle, SidebarContent } from '@/components/ui/scdh/sidebar'
import { TreeView } from '@/components/ui/scdh/tree-view'
import type { TreeDataItem } from '@/components/ui/scdh/tree-view'

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

// Sample file system data (hoisted per rerender-no-inline-components)
const sampleFileSystem: TreeDataItem[] = [
  {
    id: 'src',
    name: 'src',
    children: [
      {
        id: 'components',
        name: 'components',
        children: [
          {
            id: 'ui',
            name: 'ui',
            children: [
              { id: 'button.tsx', name: 'button.tsx' },
              { id: 'tree-view.tsx', name: 'tree-view.tsx' },
              { id: 'input.tsx', name: 'input.tsx' }
            ]
          },
          {
            id: 'forms',
            name: 'forms',
            children: [
              { id: 'login-form.tsx', name: 'login-form.tsx' },
              { id: 'contact-form.tsx', name: 'contact-form.tsx' }
            ]
          }
        ]
      },
      {
        id: 'pages',
        name: 'pages',
        children: [
          { id: 'home.tsx', name: 'home.tsx' },
          { id: 'about.tsx', name: 'about.tsx' },
          { id: 'contact.tsx', name: 'contact.tsx' }
        ]
      },
      { id: 'app.tsx', name: 'App.tsx' },
      { id: 'main.tsx', name: 'main.tsx' }
    ]
  },
  {
    id: 'public',
    name: 'public',
    children: [
      { id: 'index.html', name: 'index.html' },
      { id: 'favicon.ico', name: 'favicon.ico' }
    ]
  },
  { id: 'package.json', name: 'package.json' },
  { id: 'vite.config.ts', name: 'vite.config.ts' },
  { id: 'README.md', name: 'README.md' }
]

/**
 * Sidebar with an integrated TreeView component showing a file system.
 * Uses the same `sampleFileSystem` data as the TreeView Default story.
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
          <TreeView data={sampleFileSystem} />
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
