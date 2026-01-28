import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldLabel, FieldDescription, FieldContent } from '../../components/ui/field'
import { Input } from '../../components/ui/input'

const meta = {
  title: 'SCDH-UI/Text Field',
  component: Field,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'responsive'],
      description: 'Layout orientation of the field'
    }
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <FieldLabel htmlFor="checkout-7j9-card-name-43j">Label</FieldLabel>
        <FieldContent>
          <Input id="checkout-7j9-card-name-43j" placeholder="Bitte geben Sie einen Namen ein" />
          <FieldDescription>Kurze Beschreibung des Feldes</FieldDescription>
        </FieldContent>
      </>
    ),
    orientation: 'vertical'
  }
}

export const Horizontal: Story = {
  args: {
    children: (
      <>
        <FieldLabel htmlFor="checkout-7j9-card-name-43j">Label</FieldLabel>
        <FieldContent>
          <Input id="checkout-7j9-card-name-43j" placeholder="Bitte geben Sie einen Namen ein" />
          <FieldDescription>Kurze Beschreibung des Feldes</FieldDescription>
        </FieldContent>
      </>
    ),
    orientation: 'horizontal'
  }
}
