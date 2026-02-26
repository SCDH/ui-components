import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../../components/ui/label'

const meta = {
  title: 'SCDH-UI/Label',
  component: Label,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'large'],
      description: 'The font size of the label'
    }
  }
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'I am a label',
    size: 'large'
  }
}

export const Medium: Story = {
  args: {
    children: 'I am a medium label',
    size: 'medium'
  }
}

export const Large: Story = {
  args: {
    children: 'I am a large label',
    size: 'large'
  }
}
