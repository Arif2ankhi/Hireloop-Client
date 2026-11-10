import Link from "next/link";

/**
 * "5 jobs per page" pagination under the results grid. Server-rendered
 * links keep the current filters/params in the URL, so going back and
 * forward works without any client state.
 *
 * Hidden entirely while everything fits on one page.
 */
export function JobPagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  /** Builds the result-page URL for a given page number. */
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const neighbor = (target: number, label: string, symbol: string) => {
    if (target < 1 || target > totalPages) return null;
    return (
      <Link
        href={hrefFor(target)}
        aria-label={label}
        className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#131317] text-sm text-zinc-400 transition-colors hover:text-white"
      >
        {symbol}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Job results pagination"
      className="flex items-center justify-center gap-1.5 pt-2"
    >
      {neighbor(page - 1, "Previous page", "‹") ?? (
        <span
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#131317] text-sm text-zinc-600 opacity-40"
        >
          ‹
        </span>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (number) =>
          number === page ? (
            <span
              key={number}
              aria-current="page"
              className="flex size-8 items-center justify-center rounded-lg border border-white bg-white text-sm font-medium text-zinc-900"
            >
              {number}
            </span>
          ) : (
            <Link
              key={number}
              href={hrefFor(number)}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#131317] text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {number}
            </Link>
          )
      )}

      {neighbor(page + 1, "Next page", "›") ?? (
        <span
          aria-label="Next page"
          className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#131317] text-sm text-zinc-600 opacity-40"
        >
          ›
        </span>
      )}
    </nav>
  );
}
