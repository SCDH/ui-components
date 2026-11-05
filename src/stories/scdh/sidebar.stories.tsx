import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/scdh/sidebar'
import { TreeView } from '@/components/ui/scdh/tree-view'
import type { TreeDataItem } from '@/components/ui/scdh/tree-view'
import { EntryList } from '@/components/ui/scdh/entry-list'

const meta = {
  title: 'SCDH-UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sidebar on the left (tablet and desktop) with a header (collapse toggle and title) and ' +
          'scrollable content. Collapsed, it disappears completely; the `SidebarTrigger` in the ' +
          'header of the main content brings it back. The collapse state lives in a ' +
          '`SidebarProvider` (provided by `AppLayout`), so the trigger can sit anywhere next to the ' +
          'sidebar.'
      }
    }
  },
  tags: ['autodocs'],
  // In the Storybook iframe the root shrinks to its content (`place-items: center` on the body in
  // preview.css), so the page gets the viewport width explicitly; in the docs `w-full` is enough
  decorators: [
    (Story, { viewMode }) => (
      <div className={viewMode === 'docs' ? 'w-full' : 'w-screen'}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

const ENTRIES = [
  { id: 'e1', label: 'Eintrag 1' },
  { id: 'e2', label: 'Weiterer Eintrag' },
  { id: 'e3', label: 'Weiterer Eintrag 3' },
  { id: 'e4', label: 'Eintrag 4' },
  { id: 'e5', label: 'Eintrag 5' },
  { id: 'e6', label: 'Eintrag 6' }
]

/** Sidebar next to a main area whose header holds the `SidebarTrigger`. */
function SidebarPage({
  title,
  defaultCollapsed,
  children
}: {
  title: string
  defaultCollapsed?: boolean
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      <div
        className="flex min-h-screen bg-background text-foreground"
        style={{ '--header-height': '0px' } as React.CSSProperties}
      >
        <Sidebar>{children}</Sidebar>
        <main className="min-w-0 flex-1 p-6">
          <div className="flex items-start gap-4">
            <SidebarTrigger />
            <div>
              <h2 className="text-2xl font-medium">{title}</h2>
              <p className="text-md text-ulb-grey-600">7. Oktober 1956</p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

/**
 * Default sidebar (design "3 Ansichten"): header with the collapse toggle and the title, below a
 * list card with the selected entry on grey and a blue edge.
 */
export const Default: Story = {
  render: () => (
    <SidebarPage title="PersonA an PersonB">
      <SidebarHeader>Alle Briefe</SidebarHeader>
      <SidebarContent>
        <EntryList entries={ENTRIES} defaultValue="e2" aria-label="Alle Briefe" />
      </SidebarContent>
    </SidebarPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Alle Briefe' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Seitenleiste einklappen' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Weiterer Eintrag', current: 'page' })
    ).toBeVisible()
    // The trigger only shows while the sidebar is collapsed
    await expect(
      canvas.queryByRole('button', { name: 'Seitenleiste ausklappen' })
    ).not.toBeInTheDocument()
  }
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
    <SidebarPage title="Dateien">
      <SidebarHeader>Dateien</SidebarHeader>
      <SidebarContent>
        <TreeView data={sampleFileSystem} />
      </SidebarContent>
    </SidebarPage>
  )
}

/**
 * Collapsed sidebar: it is gone completely, only the trigger next to the page title remains.
 * A click on it opens the sidebar again.
 */
export const Collapsed: Story = {
  render: () => (
    <SidebarPage title="PersonA an PersonB" defaultCollapsed>
      <SidebarHeader>Alle Briefe</SidebarHeader>
      <SidebarContent>
        <EntryList entries={ENTRIES} defaultValue="e2" aria-label="Alle Briefe" />
      </SidebarContent>
    </SidebarPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const aside = canvasElement.querySelector('aside')!
    await expect(aside.getBoundingClientRect().width).toBe(0)
    await expect(canvas.queryByRole('heading', { name: 'Alle Briefe' })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Seitenleiste ausklappen' }))
    await waitFor(() => expect(aside.getBoundingClientRect().width).toBeGreaterThan(200))
    await expect(canvas.getByRole('heading', { name: 'Alle Briefe' })).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Seitenleiste ausklappen' })
    ).not.toBeInTheDocument()
  }
}
