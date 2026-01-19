import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldLabel, FieldDescription, FieldContent } from '../../components/ui/field'
import { Input } from '../../components/ui/input'

const meta = {
  title: 'SCDH-UI/Field',
  component: Field,
  layout: 'centered',
  tags: ['autodocs']
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <FieldLabel htmlFor="checkout-7j9-card-name-43j">Name on Card</FieldLabel>
        <FieldContent>
          <Input id="checkout-7j9-card-name-43j" placeholder="Evil Rabbit" />
          <FieldDescription>Optional helper text.</FieldDescription>
        </FieldContent>
      </>
    ),
    orientation: 'vertical'
  }
}
