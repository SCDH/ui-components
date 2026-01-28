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

// Real-world composition examples showing common use cases
export const InputField: Story = {
  name: 'Text Input Field',
  render: () => {
    const id = useId()
    return (
      <Field orientation="vertical">
        <FieldLabel htmlFor={id}>Vollständiger Name</FieldLabel>
        <FieldContent>
          <Input id={id} type="text" placeholder="Max Mustermann" />
          <FieldDescription>Geben Sie Ihren Vor- und Nachnamen ein</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

export const EmailField: Story = {
  name: 'Email Input Field',
  render: () => {
    const id = useId()
    return (
      <Field orientation="vertical">
        <FieldLabel htmlFor={id}>E-Mail Adresse</FieldLabel>
        <FieldContent>
          <Input id={id} type="email" placeholder="beispiel@uni-muenster.de" />
          <FieldDescription>Wir werden Ihre E-Mail-Adresse nicht weitergeben</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

export const PasswordField: Story = {
  name: 'Password Input Field',
  render: () => {
    const id = useId()
    return (
      <Field orientation="vertical">
        <FieldLabel htmlFor={id}>Passwort</FieldLabel>
        <FieldContent>
          <Input id={id} type="password" placeholder="••••••••" />
          <FieldDescription>Mindestens 8 Zeichen mit Buchstaben und Zahlen</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

export const NumberField: Story = {
  name: 'Number Input Field',
  render: () => {
    const id = useId()
    return (
      <Field orientation="vertical">
        <FieldLabel htmlFor={id}>Alter</FieldLabel>
        <FieldContent>
          <Input id={id} type="number" min="0" max="120" placeholder="25" />
          <FieldDescription>Geben Sie Ihr Alter in Jahren ein</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

export const DateField: Story = {
  name: 'Date Input Field',
  render: () => {
    const id = useId()
    return (
      <Field orientation="vertical">
        <FieldLabel htmlFor={id}>Geburtsdatum</FieldLabel>
        <FieldContent>
          <Input id={id} type="date" />
          <FieldDescription>Wählen Sie Ihr Geburtsdatum aus</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

export const DisabledField: Story = {
  name: 'Disabled Input Field',
  render: () => {
    const id = useId()
    return (
      <Field orientation="vertical">
        <FieldLabel htmlFor={id}>Benutzername</FieldLabel>
        <FieldContent>
          <Input id={id} type="text" value="max.mustermann" disabled />
          <FieldDescription>Dieser Wert kann nicht geändert werden</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

export const RequiredField: Story = {
  name: 'Required Input Field',
  render: () => {
    const id = useId()
    return (
      <Field orientation="vertical">
        <FieldLabel htmlFor={id}>
          Name <span className="text-destructive">*</span>
        </FieldLabel>
        <FieldContent>
          <Input id={id} type="text" placeholder="Pflichtfeld" required />
          <FieldDescription>Dieses Feld ist erforderlich</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

// Fields with non-input content
export const ReadOnlyField: Story = {
  name: 'Read-Only Text Field',
  render: () => {
    return (
      <Field orientation="vertical">
        <FieldLabel>Registrierungsdatum</FieldLabel>
        <FieldContent>
          <p className="text-base font-medium">15. Januar 2026</p>
          <FieldDescription>Dieses Datum kann nicht geändert werden</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

