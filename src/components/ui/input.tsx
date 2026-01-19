import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-ulb-grey-500 bg-white px-3 py-2 font-metawebpro font-medium text-lg transition-colors  placeholder:text-ulb-grey-400 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scdh-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
