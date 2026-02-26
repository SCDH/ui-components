import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListItem } from '../../components/ui/scdh/list-item'
import { SmilePlus } from 'lucide-react'

const meta = {
  title: 'SCDH-UI/ListItem',
  component: ListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A search-result list item card displaying an optional thumbnail, metadata, title, ' +
          'author, description, tags (badges), and action buttons. ' +
          'Built to be used inside search result lists following the SCDH design system.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Main title of the list item' },
    subtitle: { control: 'text', description: 'Subtitle / author line' },
    meta: { control: 'text', description: 'Meta text above the title (e.g. date)' },
    description: { control: 'text', description: 'Description text' },
    thumbnail: { control: 'text', description: 'Thumbnail image URL' }
  },
  args: {
    title: 'Titel des Werkes'
  }
} satisfies Meta<typeof ListItem>

export default meta

type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Default – matches the designer screenshot
// ---------------------------------------------------------------------------

/** Full list item matching the designer mockup with thumbnail, metadata, tags, and actions. */
export const Default: Story = {
  args: { title: 'Titel des Werkes' },
  render: () => (
    <div className="max-w-[900px]">
      <ListItem
        thumbnail={undefined}
        meta="hinzugefügt am 12.04.2025"
        title="Titel des Werkes"
        subtitle="Nachname, Vorname"
        description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."
        tags={[
          { label: 'Tag', className: 'bg-green-100 text-green-700 border-green-300' },
          { label: 'Weiterer Tag', className: 'bg-rose-100 text-rose-600 border-rose-300' },
          { label: 'Bioinformatik', className: 'bg-violet-100 text-violet-600 border-violet-300' }
        ]}
        actions={[
          { label: 'Bearbeiten', variant: 'secondary' },
          {
            label: 'Optionen',
            icon: <SmilePlus className="size-4" />,
            variant: 'tertiary',
            size: 'icon'
          }
        ]}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// With thumbnail image
// ---------------------------------------------------------------------------

/** List item with a thumbnail image loaded from an external source. */
export const WithThumbnail: Story = {
  args: { title: 'Ein Werk mit Bild' },
  render: () => (
    <div className="max-w-[900px]">
      <ListItem
        thumbnail="https://picsum.photos/seed/random-pic/200/200"
        thumbnailAlt="Vorschaubild des Werkes"
        meta="hinzugefügt am 05.01.2026"
        title="Ein Werk mit Bild"
        subtitle="Musterfrau, Erika"
        description="Dieses Suchergebnis zeigt ein Werk mit einem tatsächlichen Vorschaubild an."
        tags={[
          {
            label: 'Philosophie',
            className: 'bg-scdh-blue-100 text-scdh-blue-700 border-scdh-blue-300'
          },
          { label: 'Open Access', className: 'bg-green-100 text-green-700 border-green-300' }
        ]}
        actions={[{ label: 'Bearbeiten', variant: 'secondary' }]}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Minimal – only required props
// ---------------------------------------------------------------------------

/** Minimal list item with only a title – no thumbnail, tags, or actions. */
export const Minimal: Story = {
  args: { title: 'Nur ein Titel' },
  render: () => (
    <div className="max-w-[900px]">
      <ListItem title="Nur ein Titel" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Without actions
// ---------------------------------------------------------------------------

/** List item without any action buttons – read-only display. */
export const WithoutActions: Story = {
  args: { title: 'Forschungsergebnis ohne Aktionen' },
  render: () => (
    <div className="max-w-[900px]">
      <ListItem
        meta="veröffentlicht am 01.06.2025"
        title="Forschungsergebnis ohne Aktionen"
        subtitle="Doe, John"
        description="Ein Suchergebnis das keine Bearbeitungsoptionen bietet und nur zur Anzeige dient."
        tags={[
          { label: 'Geschichte', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' }
        ]}
      />
    </div>
  )
}
