import { cva } from 'class-variance-authority'

/**
 * Shared variant definitions for MenubarItem.
 *
 * Extracted to a separate file to satisfy react-refresh/only-export-components
 * while still allowing consumers to compose custom menu items.
 */
const menubarItemVariants = cva(
  'inline-flex items-center justify-center text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scah-blue-700 cursor-pointer select-none',
  {
    variants: {
      active: {
        true: '',
        false: ''
      },
      variant: {
        desktop: '',
        mobile: ''
      }
    },
    compoundVariants: [
      {
        variant: 'desktop',
        active: false,
        className:
          'h-full px-[var(--space-linear-150)] text-ulb-grey-700 hover:text-ulb-grey-900 hover:border-ulb-grey-200 border-b-[3px] border-transparent'
      },
      {
        variant: 'desktop',
        active: true,
        className:
          'h-full px-[var(--space-linear-150)] text-scah-blue-700 border-b-[3px] border-scah-blue-700'
      },
      {
        variant: 'mobile',
        active: false,
        className: 'text-ulb-grey-700 hover:bg-ulb-grey-100'
      },
      {
        variant: 'mobile',
        active: true,
        className: 'text-scah-blue-700 bg-ulb-grey-100'
      }
    ],
    defaultVariants: {
      active: false,
      variant: 'desktop'
    }
  }
)

export { menubarItemVariants }
