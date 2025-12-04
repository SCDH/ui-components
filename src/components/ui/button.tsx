import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-100 whitespace-nowrap rounded-lg font-metawebpro font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scdh-blue-700 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "text-black bg-scdh-blue-300 hover:bg-scdh-blue-200 active:bg-scdh-blue-400",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border border-scdh-blue-600 bg-background shadow-sm hover:bg-scdh-blue-050 hover:text-scdh-blue-700",
        secondary:
          "bg-ulb-grey-200 text-ulb-grey-900 shadow-sm hover:bg-ulb-grey-300",
        ghost: "hover:bg-scdh-blue-050 hover:text-scdh-blue-700",
        link: "text-scdh-blue-600 underline-offset-4 hover:underline hover:text-scdh-blue-700",
      },
      size: {
        default: "h-[36px] px-3 text-lg",
        sm: "h-[28px] px-2 text-md",
        lg: "h-[36px] px-3 text-lg",
        icon: "h-[40px] w-[40px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
