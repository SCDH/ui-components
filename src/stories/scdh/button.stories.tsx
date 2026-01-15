import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ArrowUpIcon, PlusIcon, DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'SCDH-UI/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button variant from shadcn/ui'
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size from shadcn/ui'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    asChild: {
      control: 'boolean',
      description: 'Use Radix Slot for composition'
    }
  },
  args: { onClick: fn() }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Variants
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary'
  }
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary'
  }
}

export const Tertiary: Story = {
  args: {
    children: 'Button',
    variant: 'tertiary'
  }
}

export const Link: Story = {
  args: {
    children: 'Button',
    variant: 'link'
  }
}

// Sizes
export const Small: Story = {
  args: {
    children: 'Button',
    size: 'sm'
  }
}

export const Large: Story = {
  args: {
    children: 'Button',
    size: 'lg'
  }
}

export const Icon: Story = {
  args: {
    children: <ArrowUpIcon />,
    size: 'icon',
    'aria-label': 'Upload'
  }
}

// Combined Examples
export const IconWithText: Story = {
  args: {
    children: (
      <>
        <DownloadIcon />
        Download
      </>
    ),
    size: 'lg',
    variant: 'primary'
  }
}

export const SmallWithIcon: Story = {
  args: {
    children: (
      <>
        <DownloadIcon />
        Download
      </>
    ),
    size: 'sm',
    variant: 'secondary'
  }
}

// States
export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true
  }
}
