import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Dark shell shared by the dashboard job pages: only sets the theme wrapper,
 * page background and padding — inner layout is each page's responsibility.
 */
export function DarkPage({ children }: { children: ReactNode }) {
  return (
    <div className="dark min-h-screen bg-[#0b0b0f] p-4 text-white sm:p-6">
      {children}
    </div>
  );
}

/**
 * Breadcrumb + page heading block. Every crumb except the last is a link;
 * keys label and href for the crumbs already visited.
 */
export function PageHeader({
  items,
  title,
  description,
}: {
  /** Ordered crumbs, e.g. `[{ label: "Manage Jobs", href: "..." }, { label: "…"}]` */
  items: ReadonlyArray<{ label: string; href?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-xs text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.label}>
              {isLast ? (
                <span className="text-zinc-300">{item.label}</span>
              ) : (
                <Link href={item.href ?? "#"} className="hover:text-zinc-300">
                  {item.label}
                </Link>
              )}
              {isLast ? null : <span className="mx-1.5">›</span>}
            </span>
          );
        })}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
