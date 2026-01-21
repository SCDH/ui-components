import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../../components/ui/checkbox'
import { Label } from '@radix-ui/react-label'
import { Field } from '@/components/ui/field'

const meta = {
  title: 'SCDH-UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field orientation="horizontal" className="flex-row items-center gap-2">
      <Checkbox id="example" />
      <Label htmlFor="example">Label</Label>
    </Field>
  )
}
