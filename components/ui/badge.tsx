import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border-2 border-black px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-brutal-lime text-brutal-black shadow-brutal-sm",
        secondary: "bg-brutal-blue text-white shadow-brutal-sm",
        destructive: "bg-brutal-coral text-white shadow-brutal-sm",
        outline: "bg-white text-brutal-black shadow-brutal-sm",
        success: "bg-brutal-mint text-brutal-black shadow-brutal-sm",
        warning: "bg-brutal-yellow text-brutal-black shadow-brutal-sm",
        ghost: "border-transparent bg-brutal-cream text-brutal-charcoal shadow-none",
        link: "border-transparent text-brutal-blue underline-offset-4 hover:underline shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
