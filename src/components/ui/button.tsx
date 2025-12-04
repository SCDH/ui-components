import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-100 whitespace-nowrap rounded-md font-metawebpro font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-scdh-blue-600 text-white shadow hover:bg-scdh-blue-700",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border border-scdh-blue-600 bg-background shadow-sm hover:bg-scdh-blue-050 hover:text-scdh-blue-700",
        secondary:
          "bg-ulb-grey-200 text-ulb-grey-900 shadow-sm hover:bg-ulb-grey-300",
        ghost: "hover:bg-scdh-blue-050 hover:text-scdh-blue-700",
        link: "text-scdh-blue-600 underline-offset-4 hover:underline hover:text-scdh-blue-700",
      },
      size: {
        default: "h-[40px] px-200 py-100 text-md",
        sm: "h-[32px] rounded-sm px-150 text-sm",
        lg: "h-[48px] rounded-lg px-300 text-lg",
        icon: "h-[40px] w-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
