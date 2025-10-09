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
   */
  variant?: 'default' | 'outline'
  
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
 * SCDH Button Component (Example)
 * 
 * This component wraps the shadcn/ui Button to provide a simplified API
 * while maintaining all the accessibility features and robustness of shadcn.
 * 
 * Key benefits:
 * - Uses shadcn/ui as foundation (accessibility, Radix primitives, etc.)
 * - Applies SCDH-specific styling and brand colors
 * - Simplified API compared to shadcn (fewer variants/sizes)
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
          
          // Designer specifications for border radius (8px)
          "rounded-lg",

          // Font size based on button size for optimal readability
          size === 'small' ? 'text-sm' : size === 'icon' ? 'text-sm' : 'text-base',
          
          // SCDH brand colors for default variant
          variant === 'default' && [
            "bg-scdh-blue text-black",        // Designer specified: rgba(159, 210, 237, 1) bg, black text
            "hover:bg-scdh-blue/80",            // Slightly more transparent on hover
            "active:bg-scdh-blue/60",           // Even more transparent when pressed
            "focus-visible:ring-scdh-blue"      // Focus ring using brand color
          ],
          
          // Apply full width styling when requested
          // This overrides the default inline-flex behavior
          fullWidth && "w-full",
          
          // Allow additional custom classes to be passed in
          // This provides flexibility for distinct styling needs
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
