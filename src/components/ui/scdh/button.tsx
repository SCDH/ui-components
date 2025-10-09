import * as React from "react"
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * SCDH Button Component Props
 * 
 * This interface extends the shadcn/ui Button but simplifies the API
 * by reducing the number of variants and sizes to what SCDH actually needs.
 * We omit 'variant' and 'size' from shadcn to replace them with our own simplified versions.
 */
export interface ButtonProps extends Omit<ShadcnButtonProps, 'variant' | 'size'> {
  /** 
   * Button variant - simplified from shadcn's 6 variants to 3 SCDH-specific ones
   * - default: SCDH primary button with sky blue colors
   * - outline: Outlined button for secondary actions
   * - ghost: Minimal button without background
   */
  variant?: 'default' | 'outline' | 'ghost'
  
  /** 
   * Button size - simplified from shadcn's 4 sizes to 3 practical ones
   * - default: Standard button size (h-9 px-4 py-2)
   * - small: Compact size for tight spaces (h-8 px-3)
   * - icon: Square button for icon-only usage (h-9 w-9)
   */
  size?: 'default' | 'small' | 'icon'
  
  /** 
   * Makes the button span the full width of its container
   * Useful for forms or mobile layouts
   */
  fullWidth?: boolean
}

/**
 * SCDH Button Component
 * 
 * This component wraps the shadcn/ui Button to provide a simplified API
 * while maintaining all the accessibility features and robustness of shadcn.
 * 
 * Key benefits:
 * - Uses shadcn/ui as foundation (accessibility, Radix primitives, etc.)
 * - Applies SCDH-specific styling (sky blue color scheme)
 * - Simplified API compared to shadcn (fewer variants/sizes)
 * - Uses Tailwind classes instead of hardcoded hex colors
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', fullWidth, className, ...props }, ref) => {
    // Map our simplified SCDH variants to shadcn variants
    // We keep the same names where possible for consistency
    const shadcnVariant = variant === 'default' ? 'default' : variant
    
    // Map our simplified SCDH sizes to shadcn sizes
    // 'small' becomes 'sm', others map directly
    const shadcnSize = size === 'small' ? 'sm' : size === 'icon' ? 'icon' : 'default'

    return (
      <ShadcnButton
        ref={ref}
        variant={shadcnVariant}
        size={shadcnSize}
        className={cn(
          // Base transition for smooth color changes on hover/focus
          "transition-colors duration-200",
          
          // SCDH brand colors for default variant
          // Using Tailwind's sky color palette instead of hardcoded hex values
          // This ensures consistency with the design system
          variant === 'default' && [
            "bg-sky-200 text-sky-900",      // Light sky background with dark text
            "hover:bg-sky-300",             // Slightly darker on hover
            "active:bg-sky-400",            // Even darker when pressed
            "focus-visible:ring-sky-500"    // Sky blue focus ring for accessibility
          ],
          
          // Apply full width styling when requested
          // This overrides the default inline-flex behavior
          fullWidth && "w-full",
          
          // Allow additional custom classes to be passed in
          // This provides flexibility for one-off styling needs
          className
        )}
        {...props}
      />
    )
  }
)

// Set display name for React DevTools debugging
Button.displayName = "Button"

export { Button }
