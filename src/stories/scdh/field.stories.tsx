import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldContent,
  FieldError
} from '../../components/ui/field'
import { Input } from '../../components/ui/input'
import { useId, useState } from 'react'
import { userEvent, within, expect } from 'storybook/test'

const meta = {
  title: 'SCDH-UI/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'A structural component that handles layout, labeling, descriptions, and error states for form inputs. It provides consistent spacing and alignment across different form elements.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'responsive'],
      description: 'Controls the layout direction of label and content',
      table: {
        defaultValue: { summary: 'vertical' }
      }
    }
  },
  args: {
    orientation: 'vertical'
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    children: (
      <>
        <FieldLabel htmlFor="field-vertical">Vertical Layout</FieldLabel>
        <FieldContent>
          <Input id="field-vertical" placeholder="Label is above the input" />
          <FieldDescription>Standard layout for most forms</FieldDescription>
        </FieldContent>
      </>
    )
  }
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    children: (
      <>
        <FieldLabel htmlFor="field-horizontal">Horizontal Layout</FieldLabel>
        <FieldContent>
          <Input id="field-horizontal" placeholder="Label is beside the input" />
          <FieldDescription>Useful for settings pages or dense forms</FieldDescription>
        </FieldContent>
      </>
    )
  }
}

export const ValidatedError: Story = {
  name: 'Error State (Static)',
  render: function InteractiveValidationRender() {
    return (
      <Field orientation="vertical" data-invalid={true}>
        <FieldLabel>Username</FieldLabel>
        <FieldContent>
          <Input defaultValue="invalid-user" />
          <FieldError errors={[{ message: 'This username is already taken.' }]} />
        </FieldContent>
      </Field>
    )
  }
}

export const Disabled: Story = {
  name: 'Disabled State',
  render: () => {
    return (
      <Field orientation="vertical" data-disabled={true}>
        <FieldLabel htmlFor="field-disabled">Disabled Field</FieldLabel>
        <FieldContent>
          <Input id="field-disabled" disabled placeholder="Cannot type here" />
          <FieldDescription>
            Opactiy is reduced automatically when input is disabled.
          </FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

export const Required: Story = {
  name: 'Required Indicator',
  render: () => {
    return (
      <Field orientation="vertical">
        <FieldLabel htmlFor="field-required">
          Mandatory Field <span className="text-destructive">*</span>
        </FieldLabel>
        <FieldContent>
          <Input id="field-required" required placeholder="Must be filled" />
        </FieldContent>
      </Field>
    )
  }
}

export const WithDescription: Story = {
  name: 'With Helper Text',
  render: () => {
    return (
      <Field>
        <FieldLabel>API Key</FieldLabel>
        <FieldContent>
          <Input readOnly value="sk_test_51Mz..." />
          <FieldDescription>Your secret API key. Do not share this with anyone.</FieldDescription>
        </FieldContent>
      </Field>
    )
  }
}

export const InteractiveValidation: Story = {
  name: 'Interaction: Form Validation',
  render: function InteractiveValidationStoryRender() {
    const id = useId()
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      // Use "email" as the name for FormData retrieval
      const emailValue = formData.get('email') as string

      // Validation simulation: Check if '@' is missing or empty
      if (!emailValue || !emailValue.includes('@')) {
        setError('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      } else {
        setError(null)
        alert('Form submitted successfully!')
      }
    }

    return (
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field orientation="vertical" data-invalid={!!error}>
          <FieldLabel htmlFor={id}>E-Mail Adresse</FieldLabel>
          <FieldContent>
            <Input
              id={id}
              name="email"
              placeholder="tippen sie 'ungueltige-email'..."
              // Clear error when user types again
              onChange={() => error && setError(null)}
            />
            <FieldDescription>Wir validieren beim Submit.</FieldDescription>
            {error && <FieldError>{error}</FieldError>}
          </FieldContent>
        </Field>

        <button
          type="submit"
          data-testid="submit-button"
          className="w-fit rounded bg-primary px-4 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Validate
        </button>
      </form>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const emailInput = canvas.getByLabelText('E-Mail Adresse')
    const submitBtn = canvas.getByTestId('submit-button')

    // 1. Type invalid input
    await userEvent.type(emailInput, 'ungueltige-email', { delay: 50 })

    // 2. Submit form
    await userEvent.click(submitBtn)

    // 3. Expect error message
    // Using regex for flexible matching and case insensitivity
    const errorMessage = await canvas.findByText(/Bitte geben Sie eine gültige E-Mail-Adresse ein/i)
    expect(errorMessage).toBeInTheDocument()

    // 4. Check if field is marked invalid in DOM
    const field = emailInput.closest('[data-slot="field"]')
    expect(field).toHaveAttribute('data-invalid', 'true')
  }
}
