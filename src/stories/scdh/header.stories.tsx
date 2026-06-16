import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpenIcon } from 'lucide-react'
import { Header, HeaderLogo, HeaderTitle } from '@/components/ui/header'
import logoSrc from '@/assets/logo_uni_ms.svg'

const meta = {
  title: 'SCDH-UI/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for the Header root'
    }
  }
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default header with logo, title, and optional action buttons.
 * Logo is left-aligned, title is centered.
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <Header>
        <HeaderLogo>
          <img src={logoSrc} alt="SCDH Logo" className="h-[40px] w-auto" />
        </HeaderLogo>
        <HeaderTitle>SCDH UI Components</HeaderTitle>
      </Header>
    </div>
  )
}

/**
 * Header with a custom icon as logo (e.g. Lucide icon).
 */
export const WithIconLogo: Story = {
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <Header>
        <HeaderLogo>
          <BookOpenIcon className="size-8 text-scah-blue-700" />
        </HeaderLogo>
        <HeaderTitle>Digital Library</HeaderTitle>
      </Header>
    </div>
  )
}

/**
 * Minimal header — title only, no logo.
 */
export const TitleOnly: Story = {
  render: () => (
    <div className="min-h-[200px] bg-ulb-grey-050">
      <Header>
        <HeaderTitle>Impressum</HeaderTitle>
      </Header>
    </div>
  )
}
