import { getJobs } from "@/lib/api/jobs";
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  type JobFormData,
} from "@/lib/types/job-form-data";
import { SiteNavbar } from "@/components/site-navbar";
import { JobCard } from "@/components/jobs/job-card";
import {
  JobFiltersPanel,
  JobSortSelect,
} from "@/components/jobs/job-filters";
import { JobPagination } from "@/components/jobs/job-pagination";
import { JobSearchBar } from "@/components/jobs/job-search-bar";
import { Toaster } from "@/components/ui/toast";

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

/** Jobs shown per results page. */
const JOBS_PER_PAGE = 5;

/**
 * Params the page itself applies to the fetched result set, so they are not
 * forwarded to the backend: `page` (client slice), `salary` (stored values
 * are strings with mixed hourly/yearly units — easiest to compare here) and
 * `sort` (same reason).
 */
const UI_PARAMS = new Set(["page", "salary", "sort"]);

/**
 * Flatten possibly-repeated URL params (?type=A&type=B) into one query
 * string that is forwarded to GET /jobs. UI-only params (see UI_PARAMS)
 * stay out of the backend call.
 */
function toQuery(search: Awaited<SearchParams>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (UI_PARAMS.has(key)) continue;
    if (typeof value === "string" && value) {
      params.set(key, value);
    } else if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry) {
          params.append(key, entry);
        }
      }
    }
  }
  return params.toString();
}

/** Case-insensitive tally so legacy casings ("Full-Time") count too. */
function countByField(
  jobs: JobFormData[],
  key: "type" | "category",
  value: string,
) {
  return jobs.filter((job) => job[key]?.toLowerCase() === value.toLowerCase())
    .length;
}

/** Stored salaries are strings ("65000") — compare them numerically. */
function toNumber(value: string | undefined) {
  const amount = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

/**
 * Salary bucket overlap: keep jobs whose [min, max] range intersects the
 * requested range, e.g. "3000 – 4500 / month" fits "Up to 50k" but not
 * "100k – 200k". No param ("") keeps everything.
 */
function filterBySalary(jobs: JobFormData[], range: string) {
  if (!range) return jobs;
  const [minRaw, maxRaw] = range.split("-");
  const min = minRaw ? Number(minRaw) : null;
  const max = maxRaw ? Number(maxRaw) : null;

  return jobs.filter((job) => {
    const jobMin = toNumber(job.salaryMin);
    const jobMax = toNumber(job.salaryMax);
    if (min !== null && !Number.isNaN(min) && jobMax < min) return false;
    if (max !== null && !Number.isNaN(max) && jobMin > max) return false;
    return true;
  });
}

/** ObjectIds are hex with an embedded timestamp — string order = age. */
function fromNewestToOldest(a: JobFormData, b: JobFormData) {
  return (b._id ?? "").localeCompare(a._id ?? "");
}

/** Applies the ?sort=… param. Relevance falls back to recency. */
function sortJobs(
  jobs: JobFormData[],
  sort: string,
  searchValue: string,
): JobFormData[] {
  const sorted = [...jobs];
  switch (sort) {
    case "salary":
      // Highest salary = bigger top-of-range first.
      sorted.sort(
        (a, b) =>
          toNumber(b.salaryMax) - toNumber(a.salaryMax) ||
          fromNewestToOldest(a, b)
      );
      break;
    case "relevance": {
      // Title matches for the active ?search=… come first, then recent.
      const keyword = searchValue.trim().toLowerCase();
      if (!keyword) break; // no search context → recency
      sorted.sort((a, b) => {
        const aMatches = a.title?.toLowerCase().includes(keyword) ? 0 : 1;
        const bMatches = b.title?.toLowerCase().includes(keyword) ? 0 : 1;
        return aMatches - bMatches || fromNewestToOldest(a, b);
      });
      break;
    }
    default:
      // "recent": newest inserted first.
      sorted.sort(fromNewestToOldest);
  }
  return sorted;
}

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = await searchParams;
  // 1. Backend filters (type, category, isRemote, search).
  const backendJobs = await getJobs(toQuery(search));
  // 2. Page-applied pipeline: salary bucket → sort order.
  const sort = typeof search.sort === "string" ? search.sort : "recent";
  const searchValue = typeof search.search === "string" ? search.search : "";
  const jobs = sortJobs(
    filterBySalary(
      backendJobs,
      typeof search.salary === "string" ? search.salary : ""
    ),
    sort,
    searchValue
  );

  // Paging UI: ?page=1..N with 5 jobs per page. Filter/sort changes drop
  // ?page, so users always land back on a valid page.
  const pageParam = typeof search.page === "string" ? Number(search.page) : 1;
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE));
  const page = Math.min(Math.max(Number(pageParam) || 1, 1), totalPages);
  const pageJobs = jobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  /** Result URL for a page number, preserving every other filter param. */
  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(search)) {
      if (typeof value === "string" && value) {
        params.set(key, value);
      } else if (Array.isArray(value)) {
        for (const entry of value) {
          if (entry) params.append(key, entry);
        }
      }
    }
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return `/browse-jobs${query ? `?${query}` : ""}`;
  };

  return (
    <div className="dark min-h-screen bg-[#0b0b0f] text-white">
      <SiteNavbar />
      {/* Toast portal — the "Application submitted" toast lands here after
          the Apply flow navigates back from the job details page */}
      <Toaster />

      <main className="mx-auto w-full max-w-7xl px-4 pt-4 pb-12 sm:px-6 sm:pt-6">
        {/* Search panel */}
        <JobSearchBar defaultValue={searchValue} />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          {/* Filter sidebar — counts over the backend-filtered set */}
          <JobFiltersPanel
            typeCounts={Object.fromEntries(
              JOB_TYPES.map((type) => [
                type,
                countByField(backendJobs, "type", type),
              ])
            )}
            categoryCounts={Object.fromEntries(
              JOB_CATEGORIES.map((category) => [
                category,
                countByField(backendJobs, "category", category),
              ])
            )}
            remoteCount={backendJobs.filter((job) => job.isRemote === "on")
              .length}
            onsiteCount={backendJobs.filter((job) => job.isRemote !== "on")
              .length}
            totalJobs={backendJobs.length}
            initial={{
              type: typeof search.type === "string" ? search.type : "",
              category:
                typeof search.category === "string" ? search.category : "",
              isRemote:
                typeof search.isRemote === "string" ? search.isRemote : "",
              salary: typeof search.salary === "string" ? search.salary : "",
              location:
                typeof search.location === "string" ? search.location : "",
            }}
          />

          {/* Results — single column, 5 jobs per page */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="relative text-lg font-medium text-white">
                Found {jobs.length}{" "}
                {jobs.length === 1 ? "Professional Job" : "Professional Jobs"}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 left-9 h-1 w-16 rounded-full bg-brand-soft/70"
                />
              </h2>
              <JobSortSelect value={sort} />
            </div>

            {pageJobs.length === 0 ? (
              <div className="rounded-xl bg-[#131317] p-10 text-center ring-1 ring-white/5">
                <p className="text-sm font-medium text-white">No jobs found</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Try different keywords or clear the filters.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pageJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}

            <JobPagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
          </div>
        </div>
      </main>
    </div>
  );
}
