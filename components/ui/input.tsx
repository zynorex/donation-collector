import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 border-3 border-black bg-white px-4 py-2 text-base font-sans text-brutal-black transition-all duration-150 outline-none placeholder:text-brutal-charcoal/60 focus-visible:shadow-brutal-sm focus-visible:ring-0 focus-visible:border-black disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-brutal-cream/50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
