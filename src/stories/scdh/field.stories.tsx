import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldLabel, FieldDescription, FieldContent } from '../../components/ui/field'
import { Input } from '../../components/ui/input'

const meta = {
  title: 'SCDH-UI/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'A flexible layout component for form fields and labeled content. While commonly used with input elements in forms, Field supports any type of content including static text, links, and custom components.'
      }
    }
  },
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

// Basic Field composition examples
export const Default: Story = {
  args: {
    children: (
      <>
        <FieldLabel htmlFor="field-default">Label</FieldLabel>
        <FieldContent>
          <Input id="field-default" placeholder="Bitte geben Sie einen Wert ein" />
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
        <FieldLabel htmlFor="field-horizontal">Label</FieldLabel>
        <FieldContent>
          <Input id="field-horizontal" placeholder="Bitte geben Sie einen Wert ein" />
          <FieldDescription>Kurze Beschreibung des Feldes</FieldDescription>
        </FieldContent>
      </>
    ),
    orientation: 'horizontal'
  }
}
