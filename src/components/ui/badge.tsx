import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-base brutal-border px-3 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] overflow-hidden brutal-shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-main text-main-foreground",
        neutral: "bg-secondary-background text-foreground",

        // Pet-themed variants with chart colors
        "pet-pink": "bg-chart-2 text-main-foreground",
        "pet-blue": "bg-chart-1 text-main-foreground",
        "pet-green": "bg-chart-4 text-main-foreground",
        "pet-yellow": "bg-chart-3 text-main-foreground",
        "pet-purple": "bg-chart-5 text-main-foreground",
        "pet-orange": "bg-pet-orange text-main-foreground",

        // Status variants
        success: "bg-chart-4 text-main-foreground",
        warning: "bg-chart-3 text-main-foreground",
        destructive: "bg-chart-2 text-main-foreground",

        // Legacy compatibility
        secondary: "bg-secondary-background text-foreground",
        outline: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }