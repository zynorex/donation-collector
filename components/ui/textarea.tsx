import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[100px] w-full border-3 border-black bg-white px-4 py-3 text-base font-sans text-brutal-black transition-all duration-150 outline-none placeholder:text-brutal-charcoal/60 focus-visible:shadow-brutal-sm focus-visible:ring-0 focus-visible:border-black disabled:cursor-not-allowed disabled:bg-brutal-cream/50 disabled:opacity-50 resize-y",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
