import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUpIcon, PlusIcon, DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/scdh/button';

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
      options: ['default', 'outline', 'ghost'],
      description: 'Button variant - simplified from shadcn'
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'small', 'icon'],
      description: 'Button size - simplified from shadcn'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    }
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variants
export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default'
  }
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline'
  }
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost'
  }
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small'
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
    size: 'small',
    variant: 'outline'
  }
};

// Full Width
export const FullWidth: Story = {
  args: {
    children: (
      <>
        <ArrowUpIcon />
        Full Width Button
      </>
    ),
    fullWidth: true,
    variant: 'default'
  },
  parameters: {
    layout: 'padded'
  }
};

// States
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true
  }
};
