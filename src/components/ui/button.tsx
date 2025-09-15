import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-bold ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-main-foreground bg-main brutal-border brutal-shadow hover:brutal-hover",
        noShadow: "text-main-foreground bg-main brutal-border",
        neutral: "bg-secondary-background text-foreground brutal-border brutal-shadow hover:brutal-hover",
        reverse: "text-main-foreground bg-main brutal-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow",

        // Pet-themed variants with pastel colors
        "pet-pink": "bg-chart-2 text-main-foreground brutal-border brutal-shadow hover:brutal-hover",
        "pet-blue": "bg-chart-1 text-main-foreground brutal-border brutal-shadow hover:brutal-hover",
        "pet-green": "bg-chart-4 text-main-foreground brutal-border brutal-shadow hover:brutal-hover",
        "pet-yellow": "bg-chart-3 text-main-foreground brutal-border brutal-shadow hover:brutal-hover",
        "pet-purple": "bg-chart-5 text-main-foreground brutal-border brutal-shadow hover:brutal-hover",
        "pet-orange": "bg-pet-orange text-main-foreground brutal-border brutal-shadow hover:brutal-hover",

        // Status variants
        destructive: "bg-chart-2 text-main-foreground brutal-border brutal-shadow hover:brutal-hover",
        success: "bg-chart-4 text-main-foreground brutal-border brutal-shadow hover:brutal-hover",
        warning: "bg-chart-3 text-main-foreground brutal-border brutal-shadow hover:brutal-hover",

        // Ghost variant
        ghost: "hover:bg-secondary-background hover:text-foreground brutal-border border-transparent hover:border-border",
        link: "text-foreground underline-offset-4 hover:underline brutal-border border-transparent",

        // Legacy compatibility
        outline: "bg-background text-foreground brutal-border brutal-shadow hover:brutal-hover hover:bg-secondary-background",
        secondary: "bg-secondary-background text-foreground brutal-border brutal-shadow hover:brutal-hover",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xl: "h-12 px-10 text-base",
        icon: "size-10",
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