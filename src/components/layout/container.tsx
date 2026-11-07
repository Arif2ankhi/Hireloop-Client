import { cn } from "cn"

/**
 * Shared page container: the single source of truth for horizontal alignment.
 * The navbar pill, hero, and every future dark section on the home page use
 * this so their content edges line up. Full-bleed visuals (e.g. the globe)
 * intentionally sit outside it.
 */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", className)}
      {...props}
    />
  )
}
