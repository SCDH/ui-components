import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Field, FieldLabel } from './field'

const meta = {
  title: 'SCDH-UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disabled state of the radio group'
    },
    defaultValue: {
      control: { type: 'select' },
      options: ['option-one', 'option-two', 'option-three'],
      description: 'Default selected value (uncontrolled)'
    }
  }
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'example',
    disabled: false,
    defaultValue: 'option-one'
  },
  render: args => (
    <RadioGroup {...args}>
      <Field orientation="horizontal" className="flex items-center gap-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <FieldLabel htmlFor="option-one">Option One</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="flex items-center gap-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <FieldLabel htmlFor="option-two">Option Two</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="flex items-center gap-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <FieldLabel htmlFor="option-three">Option Three</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

export const Disabled: Story = {
  args: {
    id: 'disabled-example',
    disabled: false,
    defaultValue: 'option-two'
  },
  render: args => (
    <RadioGroup {...args}>
      <Field orientation="horizontal" className="flex items-center gap-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <FieldLabel htmlFor="option-one">Option One</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="flex items-center gap-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <FieldLabel htmlFor="option-two">Option Two</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="flex items-center gap-2" data-disabled>
        <RadioGroupItem value="option-three" id="option-three" disabled />
        <FieldLabel htmlFor="option-three">Disabled</FieldLabel>
      </Field>
    </RadioGroup>
  )
}
