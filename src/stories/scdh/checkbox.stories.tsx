import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../../components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Field } from '@/components/ui/field'

const meta = {
  title: 'SCDH-UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disabled state of the checkbox'
    },
    checked: {
      control: 'boolean',
      description: 'Checked state (controlled)'
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (uncontrolled)'
    }
  },
  args: {
    checked: false,
    disabled: false
  }
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'example',
    defaultChecked: false,
    disabled: false
  },
  render: args => (
    <Field orientation="horizontal" className="flex-row items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Label</Label>
    </Field>
  )
}

export const Compact: Story = {
  args: {
    id: 'compact-example',
    defaultChecked: false,
    disabled: false
  },
  render: args => (
    <Field orientation="horizontal" className="flex-row items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id} size="medium">
        Ich akzeptiere die Bedingungen
      </Label>
    </Field>
  )
}

export const Checked: Story = {
  args: {
    id: 'checked-example',
    defaultChecked: true,
    disabled: false
  },
  render: args => (
    <Field orientation="horizontal" className="flex-row items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Ich akzeptiere die Bedingungen</Label>
    </Field>
  )
}

export const Disabled: Story = {
  args: {
    id: 'disabled-example',
    defaultChecked: false,
    disabled: true
  },
  render: args => (
    <Field orientation="horizontal" className="flex-row items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Deaktiviert</Label>
    </Field>
  )
}

export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked-example',
    defaultChecked: true,
    disabled: true
  },
  render: args => (
    <Field orientation="horizontal" className="flex-row items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Deaktiviert und ausgewählt</Label>
    </Field>
  )
}
