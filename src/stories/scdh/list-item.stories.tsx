import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListItem } from '../../components/ui/scdh/list-item'

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
    title: 'Title'
  },
  decorators: [
    Story => (
      <div className="max-w-[900px]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ListItem>

export default meta

type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// 1) Title only
// ---------------------------------------------------------------------------

/** Minimal list item – only the required title prop is set. */
export const TitleOnly: Story = {
  args: {
    title: 'Title of the item'
  }
}

// ---------------------------------------------------------------------------
// 2) Title, subtitle, description, meta
// ---------------------------------------------------------------------------

/** List item with all text content but no thumbnail, tags, or actions. */
export const WithTextContent: Story = {
  args: {
    meta: 'added on 2025-12-04',
    title: 'Title of the item',
    subtitle: 'Lastname, Firstname',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'
  }
}

// ---------------------------------------------------------------------------
// 3) Title, subtitle, description, meta + thumbnail
// ---------------------------------------------------------------------------

/** List item with a thumbnail image on the left. */
export const WithThumbnail: Story = {
  args: {
    thumbnail: 'https://picsum.photos/seed/scdh-list/200/200',
    thumbnailAlt: 'Preview image of the item',
    meta: 'added on 2025-12-04',
    title: 'Title of the item',
    subtitle: 'Lastname, Firstname',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'
  }
}

// ---------------------------------------------------------------------------
// 4) Title, subtitle, description, meta + tags
// ---------------------------------------------------------------------------

/** List item with coloured tag badges below the description. */
export const WithTags: Story = {
  args: {
    meta: 'added on 2025-12-04',
    title: 'Title of the item',
    subtitle: 'Lastname, Firstname',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    tags: [
      { label: 'Literature', className: 'bg-green-100 text-green-700 border-green-300' },
      { label: 'History', className: 'bg-rose-100 text-rose-600 border-rose-300' },
      { label: 'Medieval', className: 'bg-violet-100 text-violet-600 border-violet-300' }
    ]
  }
}

// ---------------------------------------------------------------------------
// 5) Title, subtitle, description, meta + tags + action button
// ---------------------------------------------------------------------------

/** Complete list item with tags and a single action button. */
export const WithTagsAndAction: Story = {
  args: {
    meta: 'added on 2025-12-04',
    title: 'Title of the item',
    subtitle: 'Lastname, Firstname',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
    tags: [
      { label: 'Literature', className: 'bg-green-100 text-green-700 border-green-300' },
      { label: 'History', className: 'bg-rose-100 text-rose-600 border-rose-300' },
      { label: 'Medieval', className: 'bg-violet-100 text-violet-600 border-violet-300' }
    ],
    actions: [{ label: 'Bearbeiten', variant: 'secondary' }]
  }
}
