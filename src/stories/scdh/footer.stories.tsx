import type { Meta, StoryObj } from '@storybook/react-vite'
import { Footer } from '@/components/ui/footer'

const meta = {
  title: 'SCDH-UI/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for the Footer root'
    }
  }
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default footer with a simple text notice.
 * Pushes to the bottom via `mt-auto`.
 */
export const Default: Story = {
  render: () => (
    <div className="flex flex-col min-h-screen bg-ulb-grey-050">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-ulb-grey-900 mb-4">Seiteninhalt</h1>
        <p className="text-ulb-grey-700">
          Der Footer wird durch <code>mt-auto</code> automatisch an den unteren Rand geschoben.
        </p>
      </main>
      <Footer>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-ulb-grey-600">
          <span>&copy; {new Date().getFullYear()} SCDH Münster</span>
          <nav className="flex gap-4">
            <a href="#" className="hover:text-ulb-grey-900 transition-colors">
              Impressum
            </a>
            <a href="#" className="hover:text-ulb-grey-900 transition-colors">
              Datenschutz
            </a>
          </nav>
        </div>
      </Footer>
    </div>
  )
}

/**
 * Minimal footer with only a copyright notice.
 */
export const Minimal: Story = {
  render: () => (
    <div className="flex flex-col min-h-screen bg-ulb-grey-050">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-ulb-grey-900 mb-4">Seiteninhalt</h1>
      </main>
      <Footer>
        <p className="text-sm text-ulb-grey-600 text-center">
          &copy; {new Date().getFullYear()} SCDH Münster
        </p>
      </Footer>
    </div>
  )
}
