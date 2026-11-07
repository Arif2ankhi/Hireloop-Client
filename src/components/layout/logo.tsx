import * as React from "react"
import Image from "next/image"

import logoSrc from "../../../public/images/logo.png"
import { cn } from "cn"

/**
 * Official "hireloop" wordmark (public/images/logo.png, 154x44).
 * Rendered at 2x the intrinsic size for crisp display on all screens.
 */
export function Logo({ className }: React.ComponentProps<"span">) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={logoSrc}
        alt="HireLoop"
        priority
        width={160}
        height={44}
        className="h-8 w-auto sm:h-10"
      />
    </span>
  )
}
