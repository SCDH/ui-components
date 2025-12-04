import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUpIcon, PlusIcon, DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'SCDH-UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
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
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variants
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default'
  }
};

export const Destructive: Story = {
  args: {
    children: 'Button',
    variant: 'destructive'
  }
};

export const Outline: Story = {
  args: {
    children: 'Button',
    variant: 'outline'
  }
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary'
  }
};

export const Ghost: Story = {
  args: {
    children: 'Button',
    variant: 'ghost'
  }
};

export const Link: Story = {
  args: {
    children: 'Button',
    variant: 'link'
  }
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Button',
    size: 'sm'
  }
};

export const Large: Story = {
  args: {
    children: 'Button',
    size: 'lg'
  }
};

export const Icon: Story = {
  args: {
    children: <ArrowUpIcon />,
    size: 'icon',
    'aria-label': 'Upload'
  }
};

// Combined Examples
export const IconWithText: Story = {
  args: {
    children: (
      <>
        <DownloadIcon />
        Download
      </>
    ),
    variant: 'default'
  }
};

export const SmallWithIcon: Story = {
  args: {
    children: (
      <>
        <PlusIcon />
        Add
      </>
    ),
    size: 'sm',
    variant: 'outline'
  }
};

// States
export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true
  }
};
