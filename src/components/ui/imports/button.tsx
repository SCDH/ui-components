import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Basic Button Setup by shadcn/ui
// https://ui.shadcn.com/docs/components/button

// What is Radix UI Slot?
// Slot is a utility component that merges props and forwards them to its immediate child.
// It allows polymorphic rendering - your Button can render as a <button>, <a>, or any other element.
// Example: <Button asChild><a href="/home">Link</a></Button> renders as <a> with Button styles.

// What is class-variance-authority (cva)?
// CVA is a utility for managing complex className strings in a more structured way.
// It helps generating typesafe CSS variants for components in React/TypeScript projects.

const buttonVariants = cva(
  // Base styles, for all variants and sizes
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// TypeScript Interface for Button Props
// An interface defines the "shape" of an object - what properties it should have and their types
export interface ButtonProps
  // `extends` combines multiple interfaces/types into one (Intersection)
  // This is called "Interface Extension" or "Multiple Inheritance"
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, // All standard button HTML attributes (onClick, disabled, etc.)
    VariantProps<typeof buttonVariants> { // Extracts variant types from our cva definition
  // `typeof buttonVariants` gets the type of the cva function result
  // `VariantProps` then extracts the variant props (variant, size) as optional properties
  
  // Optional property (note the ?)
  // `asChild` allows rendering as a different component via Radix UI's Slot
  asChild?: boolean
}

// React.forwardRef is used to pass refs through components
// Generic type parameters: <RefType, PropsType>
// This enables parent components to get direct access to the underlying DOM element
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // First parameter: destructured props with default values
  // `...props` is the rest operator - collects all remaining props
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Conditional component selection using ternary operator
    // If asChild=true, render as Slot (Radix primitive), otherwise as regular button
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        // cn() merges className strings intelligently (handles conflicts)
        // buttonVariants() is called as a function with our variant values
        // This generates the appropriate Tailwind classes based on the variants
        className={cn(buttonVariants({ variant, size, className }))}
        // Forward the ref to the underlying element (important for DOM access)
        ref={ref}
        // Spread operator: passes all remaining props (onClick, disabled, etc.)
        {...props}
      />
    )
  }
)

// DisplayName for better debugging in React DevTools
// Without this, the component would show as "Anonymous" in the component tree
Button.displayName = "Button"

export { Button, buttonVariants }
