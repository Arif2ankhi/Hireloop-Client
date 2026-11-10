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

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

/** Jobs shown per results page. */
const JOBS_PER_PAGE = 5;

/** Params that are page-UI state, not backend filters. */
const UI_PARAMS = new Set(["page"]);

/**
 * Flatten possibly-repeated URL params (?type=A&type=B) into one query
 * string that is forwarded to GET /jobs. UI-only params (page) stay out of
 * the backend call.
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

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = await searchParams;
  const jobs = await getJobs(toQuery(search));

  // Paging UI: ?page=1..N with 5 jobs per page. Filters that the user picks
  // later should reset page back to 1.
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

  const searchValue = typeof search.search === "string" ? search.search : "";

  return (
    <div className="dark min-h-screen bg-[#0b0b0f] text-white">
      <SiteNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 pt-4 pb-12 sm:px-6 sm:pt-6">
        {/* Search panel */}
        <JobSearchBar defaultValue={searchValue} />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          {/* Filter sidebar */}
          <JobFiltersPanel
            typeCounts={Object.fromEntries(
              JOB_TYPES.map((type) => [type, countByField(jobs, "type", type)])
            )}
            categoryCounts={Object.fromEntries(
              JOB_CATEGORIES.map((category) => [
                category,
                countByField(jobs, "category", category),
              ])
            )}
            remoteCount={jobs.filter((job) => job.isRemote === "on").length}
            onsiteCount={jobs.filter((job) => job.isRemote !== "on").length}
            totalJobs={jobs.length}
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
              <JobSortSelect />
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
